// Vercel API endpoint for error logging
// POST /api/log-error

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timestamp, sessionId, level, message, data, url, userAgent, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Log to Supabase
    const { error } = await supabase
      .from('error_logs')
      .insert({
        timestamp: timestamp || new Date().toISOString(),
        session_id: sessionId,
        level: level || 'error',
        message,
        data: data ? JSON.stringify(data) : null,
        url,
        user_agent: userAgent,
        user_id: userId,
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });

    if (error) {
      console.error('Error logging failed:', error);
      return res.status(500).json({ error: 'Failed to log error' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Log error handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
  }
}
