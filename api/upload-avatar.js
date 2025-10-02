import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { user_id, avatar_data } = req.body;

    if (!user_id || !avatar_data) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'avatar_data']
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = avatar_data.extension || 'jpg';
    const fileName = `avatars/${user_id}/avatar_${timestamp}_${randomString}.${fileExtension}`;

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(avatar_data.file, 'base64');

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: avatar_data.mimeType || 'image/jpeg',
        cacheControl: '3600'
      });

    if (error) {
      console.error('Avatar upload error:', error);
      return res.status(500).json({
        error: 'Failed to upload avatar',
        details: error.message
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user profile with avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return res.status(500).json({
        error: 'Failed to update profile',
        details: updateError.message
      });
    }

    // Log the avatar upload
    await supabase
      .from('audit_logs')
      .insert([{
        user_id,
        action: 'AVATAR_UPLOADED',
        table_name: 'profiles',
        record_id: user_id,
        new_values: {
          avatar_url: urlData.publicUrl,
          uploaded_at: new Date().toISOString()
        }
      }]);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar_url: urlData.publicUrl
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
