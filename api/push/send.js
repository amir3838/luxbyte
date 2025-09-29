/**
 * API Endpoint: Send Push Notification
 * نقطة API: إرسال الإشعارات
 */

const { createClient } = require('@supabase/supabase-js');
const admin = require('firebase-admin');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://qjsvgpvbtrcnbhcjdcci.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// Initialize Firebase Admin (if service account is provided)
let adminApp = null;
if (process.env.FIREBASE_ADMIN_SA_BASE64) {
  try {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_ADMIN_SA_BASE64, 'base64').toString('utf8')
    );

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

/**
 * Send push notification to user
 * إرسال إشعار للمستخدم
 */
async function sendNotification(req, res) {
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

    const { userId, title, body, url, data } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
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

    // If Firebase Admin is not available, return mock response
    if (!adminApp) {
      console.log('Firebase Admin not configured, returning mock response');
      return res.status(200).json({
        success: true,
        message: 'Notification queued (Firebase Admin not configured)',
        tokensCount: tokens.length,
        notification: {
          title,
          body,
          url
        }
      });
    }

    // Prepare notification payload
    const notification = {
      title: title,
      body: body || 'لديك إشعار جديد من لوكس بايت',
      icon: '/assets/app_icon/LUXBYTEicon.png',
      badge: '/assets/app_icon/LUXBYTEicon.png',
      click_action: url || '/',
      data: {
        url: url || '/',
        ...data
      }
    };

    // Send notifications to all tokens
    const results = [];
    for (const tokenData of tokens) {
      try {
        const message = {
          token: tokenData.token,
          notification: notification,
          webpush: {
            notification: {
              ...notification,
              requireInteraction: true,
              actions: [
                {
                  action: 'open',
                  title: 'فتح',
                  icon: '/assets/app_icon/LUXBYTEicon.png'
                }
              ]
            },
            fcmOptions: {
              link: url || '/'
            }
          }
        };

        const response = await admin.messaging().send(message);
        results.push({ token: tokenData.token, success: true, messageId: response });

      } catch (error) {
        console.error(`Error sending to token ${tokenData.token}:`, error);
        results.push({
          token: tokenData.token,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Notification sent: ${successCount} success, ${failureCount} failed`);

    return res.status(200).json({
      success: true,
      message: `Notification sent to ${successCount} devices`,
      results: {
        total: tokens.length,
        success: successCount,
        failed: failureCount
      },
      notification: notification
    });

  } catch (error) {
    console.error('Error in sendNotification:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
}

// Export for Vercel
module.exports = sendNotification;
