// Vercel API endpoint لتغيير نوع الحساب مع أمان محسن
// POST /api/change-account-type

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminKey = process.env.ADMIN_KEY;
const hmacSecret = process.env.HMAC_SECRET;

if (!supabaseUrl || !supabaseServiceKey || !adminKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limiting (in-memory for simplicity)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip);
  const recentRequests = requests.filter(time => time > windowStart);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

function verifyHMAC(payload, signature, timestamp) {
  if (!hmacSecret) {
    console.warn('HMAC_SECRET not configured, skipping HMAC verification');
    return true; // Skip HMAC if not configured
  }

  const expectedSignature = crypto
    .createHmac('sha256', hmacSecret)
    .update(payload + timestamp)
    .digest('hex');

  // Ensure both signatures have the same length before comparison
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

function logAuditEvent(userId, oldAccount, newAccount, changedBy, ip) {
  console.log(`AUDIT: User ${userId} account changed from ${oldAccount} to ${newAccount} by ${changedBy} from IP ${ip}`);

  // Log to Supabase audit table
  supabase
    .from('account_audit')
    .insert({
      user_id: userId,
      old_account: oldAccount,
      new_account: newAccount,
      changed_by: changedBy,
      changed_at: new Date().toISOString()
    })
    .then(({ error }) => {
      if (error) console.error('Audit log error:', error);
    });
}

export default async function handler(req, res) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-ADMIN-KEY, X-HMAC-Signature, X-Timestamp');
  res.setHeader('X-Request-ID', requestId);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP ${clientIP}`);
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Verify admin key (only from headers)
    const providedAdminKey = req.headers['x-admin-key'];
    if (!providedAdminKey || providedAdminKey !== adminKey) {
      console.warn(`Invalid or missing admin key from IP ${clientIP}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify HMAC if provided
    const hmacSignature = req.headers['x-hmac-signature'];
    const timestamp = req.headers['x-timestamp'];
    if (hmacSignature && timestamp) {
      const payload = JSON.stringify(req.body);
      if (!verifyHMAC(payload, hmacSignature, timestamp)) {
        console.warn(`Invalid HMAC from IP ${clientIP}`);
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { user_id, new_account_type, changed_by } = req.body;

    if (!user_id || !new_account_type) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'new_account_type']
      });
    }

    // Validate account type
    const validAccountTypes = ['pharmacy', 'supermarket', 'restaurant', 'clinic', 'courier', 'driver', 'admin'];
    if (!validAccountTypes.includes(new_account_type)) {
      return res.status(400).json({
        error: 'Invalid account type',
        validTypes: validAccountTypes
      });
    }

    // Get current profile
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('account')
      .eq('user_id', user_id)
      .single();

    if (profileError || !currentProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const oldAccountType = currentProfile.account;

    // Check if account type is actually changing
    if (oldAccountType === new_account_type) {
      return res.status(400).json({
        error: 'Account type is already set to this value',
        current_type: oldAccountType
      });
    }

    // Update account type
    const { data, error } = await supabase
      .from('profiles')
      .update({ account: new_account_type })
      .eq('user_id', user_id)
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to update account type' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Log audit event
    logAuditEvent(
      user_id,
      oldAccountType,
      new_account_type,
      changed_by || 'admin_api',
      clientIP
    );

    // Send notification to user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: user_id,
        title: 'تم تغيير نوع الحساب',
        message: `تم تغيير نوع حسابك من ${oldAccountType} إلى ${new_account_type}`,
        type: 'account_change',
        created_at: new Date().toISOString()
      });

    if (notificationError) {
      console.warn('Failed to send notification:', notificationError);
    }

    const processingTime = Date.now() - startTime;
    console.log(`Request ${requestId} completed in ${processingTime}ms`);

    // Ensure we always return a proper JSON response
    const response = {
      success: true,
      message: 'Account type updated successfully',
      request_id: requestId,
      data: {
        user_id,
        old_account_type: oldAccountType,
        new_account_type: new_account_type,
        changed_by: changed_by || 'admin_api',
        updated_at: new Date().toISOString()
      }
    };
    
    return res.status(200).json(response);

  } catch (error) {
    console.error(`Request ${requestId} error:`, error);
    return res.status(500).json({
      error: 'Internal server error',
      request_id: requestId,
      details: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
  }
}