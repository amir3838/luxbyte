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
    const { user_id, documents } = req.body;

    if (!user_id || !documents) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'documents']
      });
    }

    const uploadedDocuments = {};

    // Process each document
    for (const [docType, fileData] of Object.entries(documents)) {
      if (fileData && fileData.file) {
        try {
          // Generate unique filename
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileExtension = fileData.extension || 'jpg';
          const fileName = `${user_id}/courier/documents/${docType}_${timestamp}_${randomString}.${fileExtension}`;

          // Convert base64 to buffer
          const fileBuffer = Buffer.from(fileData.file, 'base64');

          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('courier')
            .upload(fileName, fileBuffer, {
              contentType: fileData.mimeType || 'image/jpeg',
              cacheControl: '3600'
            });

          if (error) {
            console.error(`Upload error for ${docType}:`, error);
            uploadedDocuments[docType] = { error: error.message };
          } else {
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('courier')
              .getPublicUrl(fileName);

            uploadedDocuments[docType] = {
              success: true,
              fileName: fileName,
              url: urlData.publicUrl
            };
          }
        } catch (error) {
          console.error(`Processing error for ${docType}:`, error);
          uploadedDocuments[docType] = { error: error.message };
        }
      }
    }

    // Log the courier documents upload
    await supabase
      .from('audit_logs')
      .insert([{
        user_id,
        action: 'COURIER_DOCUMENTS_UPLOADED',
        table_name: 'courier_documents',
        record_id: user_id,
        new_values: {
          documents: Object.keys(uploadedDocuments),
          uploaded_at: new Date().toISOString()
        }
      }]);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Courier documents uploaded successfully',
      documents: uploadedDocuments
    });

  } catch (error) {
    console.error('Courier documents upload error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
