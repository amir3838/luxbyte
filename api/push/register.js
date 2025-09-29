/**
 * API Endpoint: Register FCM Token
 * نقطة API: تسجيل توكن FCM
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://qjsvgpvbtrcnbhcjdcci.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * Register FCM token for push notifications
 * تسجيل توكن FCM للإشعارات
 */
export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      });
    }

    const { token, platform = 'web', user_id } = req.body;

    // Validate required fields
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token is required' 
      });
    }

    if (!user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }

    // Validate platform
    if (!['web', 'android', 'ios'].includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid platform' 
      });
    }

    // Save token to database
    const { data, error } = await supabase
      .from('push_tokens')
      .upsert({
        user_id: user_id,
        token: token,
        platform: platform
      }, {
        onConflict: 'token'
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error: ' + error.message 
      });
    }

    console.log('Token registered successfully:', { user_id, platform });

    return res.status(200).json({
      success: true,
      message: 'Token registered successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in registerToken:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    });
  }
}