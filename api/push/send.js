const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://qjsvgpvbtrcnbhcjdcci.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { userId, title, body, url } = req.body;

    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        error: 'User ID and title are required'
      });
    }

    // Get user's FCM tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('push_tokens')
      .select('token, platform')
      .eq('user_id', userId);

    if (tokenError) {
      console.error('Database error:', tokenError);
      return res.status(500).json({
        success: false,
        error: 'Database error: ' + tokenError.message
      });
    }

    if (!tokens || tokens.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No tokens found for user'
      });
    }

    // Return mock response (Firebase Admin not configured yet)
    return res.status(200).json({
      success: true,
      message: 'Notification queued (Firebase Admin not configured)',
      tokensCount: tokens.length,
      notification: {
        title,
        body: body || 'لديك إشعار جديد من لوكس بايت',
        url: url || '/'
      }
    });

  } catch (error) {
    console.error('Error in sendNotification:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
}