import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qjsvgpvbtrcnbhcjdcci.supabase.co',
  'IgluoeNjdE60qmrjKPyXogFxriG0aQr0Rk65XUROa4LBHQFNfdFt+9V2Oc8UdddNhPGagxwSeIuKv4d8/rdzGQ=='
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
    // Get the file from the request
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'document';

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return res.status(400).json({
        error: 'File too large',
        maxSize: '10MB'
      });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return res.status(400).json({
        error: 'File type not allowed',
        allowedTypes: allowedTypes
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${timestamp}_${randomString}.${fileExtension}`;

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, fileData, {
        contentType: file.type,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Upload failed',
        details: error.message
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Log the upload
    console.log('File uploaded successfully:', fileName);

    // Return success response
    return res.status(200).json({
      success: true,
      id: data.path,
      url: urlData.publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
