import { createClient } from '@supabase/supabase-js';
const admin = require('firebase-admin');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qjsvgpvbtrcnbhcjdcci.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

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
    const { userId, title, body, url, tokens: providedTokens, topic } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    let fcmTokens = [];

    if (providedTokens && providedTokens.length > 0) {
      // Use provided tokens
      fcmTokens = providedTokens;
    } else if (userId) {
      // Get user's FCM tokens from database
      const { data: tokens, error: tokenError } = await supabase
        .from('user_devices')
        .select('fcm_token, platform')
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

      fcmTokens = tokens.map(t => t.fcm_token);
    } else if (topic) {
      // Send to topic
      const message = {
        topic: topic,
        notification: {
          title: title,
          body: body || 'لديك إشعار جديد من لوكس بايت'
        },
        data: {
          url: url || '/'
        }
      };

      try {
        const response = await admin.messaging().send(message);
        return res.status(200).json({
          success: true,
          message: 'Notification sent to topic successfully',
          response: response
        });
      } catch (error) {
        console.error('Firebase Admin error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to send notification: ' + error.message
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either userId, tokens, or topic is required'
      });
    }

    // Send to multiple tokens
    if (fcmTokens.length > 0) {
      const message = {
        notification: {
          title: title,
          body: body || 'لديك إشعار جديد من لوكس بايت'
        },
        data: {
          url: url || '/'
        }
      };

      try {
        const response = await admin.messaging().sendEachForMulticast({
          tokens: fcmTokens,
          ...message
        });

        return res.status(200).json({
          success: true,
          message: 'Notifications sent successfully',
          response: response,
          tokensCount: fcmTokens.length
        });
      } catch (error) {
        console.error('Firebase Admin error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to send notifications: ' + error.message
        });
      }
    }

    return res.status(400).json({
      success: false,
      error: 'No valid tokens or topic provided'
    });

  } catch (error) {
    console.error('Error in sendNotification:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
}