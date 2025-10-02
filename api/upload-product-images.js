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
    const { user_id, business_type, product_id, images } = req.body;

    if (!user_id || !business_type || !product_id || !images) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'business_type', 'product_id', 'images']
      });
    }

    // Validate business type
    const validTypes = ['pharmacy', 'restaurant', 'supermarket', 'clinic', 'courier', 'driver'];
    if (!validTypes.includes(business_type)) {
      return res.status(400).json({
        error: 'Invalid business type',
        valid_types: validTypes
      });
    }

    const uploadedImages = [];

    // Process each image
    for (let i = 0; i < images.length; i++) {
      const imageData = images[i];
      if (imageData && imageData.file) {
        try {
          // Generate unique filename
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileExtension = imageData.extension || 'jpg';
          const fileName = `${user_id}/${business_type}/products/${product_id}/image_${i + 1}_${timestamp}_${randomString}.${fileExtension}`;

          // Convert base64 to buffer
          const fileBuffer = Buffer.from(imageData.file, 'base64');

          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from(business_type)
            .upload(fileName, fileBuffer, {
              contentType: imageData.mimeType || 'image/jpeg',
              cacheControl: '3600'
            });

          if (error) {
            console.error(`Upload error for image ${i + 1}:`, error);
            uploadedImages.push({
              index: i,
              error: error.message
            });
          } else {
            // Get public URL
            const { data: urlData } = supabase.storage
              .from(business_type)
              .getPublicUrl(fileName);

            uploadedImages.push({
              index: i,
              success: true,
              fileName: fileName,
              url: urlData.publicUrl
            });
          }
        } catch (error) {
          console.error(`Processing error for image ${i + 1}:`, error);
          uploadedImages.push({
            index: i,
            error: error.message
          });
        }
      }
    }

    // Log the product images upload
    await supabase
      .from('audit_logs')
      .insert([{
        user_id,
        action: 'PRODUCT_IMAGES_UPLOADED',
        table_name: 'products',
        record_id: product_id,
        new_values: {
          business_type,
          product_id,
          images_count: uploadedImages.length,
          uploaded_at: new Date().toISOString()
        }
      }]);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Product images uploaded successfully',
      images: uploadedImages
    });

  } catch (error) {
    console.error('Product images upload error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
