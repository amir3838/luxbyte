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
    const {
      business_type,
      business_data,
      documents,
      location,
      user_id
    } = req.body;

    // Validate required fields
    if (!business_type || !business_data || !user_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['business_type', 'business_data', 'user_id']
      });
    }

    // Validate business type
    const validTypes = ['restaurant', 'supermarket', 'pharmacy', 'clinic', 'courier', 'driver'];
    if (!validTypes.includes(business_type)) {
      return res.status(400).json({
        error: 'Invalid business type',
        valid_types: validTypes
      });
    }

    // Prepare data for insertion
    const insertData = {
      user_id,
      address: business_data.address,
      location: location ? `POINT(${location.lng} ${location.lat})` : null,
      city: business_data.city,
      governorate: business_data.governorate,
      status: 'pending',
      documents: documents || {},
      ...business_data
    };

    // Insert into appropriate table
    let result;
    const tableName = `${business_type}_requests`;

    const { data, error } = await supabase
      .from(tableName)
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(400).json({
        error: 'Failed to create business request',
        details: error.message
      });
    }

    // Upload files to storage if provided
    if (documents && Object.keys(documents).length > 0) {
      for (const [docType, fileData] of Object.entries(documents)) {
        if (fileData && fileData.file) {
          const fileName = `${user_id}/${business_type}/${docType}_${Date.now()}.${fileData.extension}`;

          const { error: uploadError } = await supabase.storage
            .from(business_type)
            .upload(fileName, fileData.file, {
              contentType: fileData.mimeType,
              cacheControl: '3600'
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            // Continue with other files even if one fails
          } else {
            // Update document path in the request
            await supabase
              .from(tableName)
              .update({
                documents: {
                  ...data.documents,
                  [docType]: fileName
                }
              })
              .eq('id', data.id);
          }
        }
      }
    }

    // Log the business request creation
    await supabase
      .from('audit_logs')
      .insert([{
        user_id,
        action: 'BUSINESS_REQUEST_CREATED',
        table_name: tableName,
        record_id: data.id,
        new_values: { business_type, status: 'pending' }
      }]);

    // Send notification to admin
    await supabase
      .from('notifications')
      .insert([{
        user_id: user_id, // This will be sent to the user who created the request
        title: 'تم إرسال طلب التسجيل',
        message: `تم إرسال طلب تسجيل ${business_type} بنجاح. سيتم مراجعته قريباً.`,
        type: 'success'
      }]);

    // Ensure we always return a proper JSON response
    const response = {
      success: true,
      request_id: data.id,
      business_type,
      status: 'pending',
      message: 'Business request submitted successfully'
    };
    
    return res.status(201).json(response);

  } catch (error) {
    console.error('Business request error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
