const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { 
      request_id, 
      business_type, 
      status, 
      review_notes,
      admin_user_id 
    } = req.body;

    // Validate required fields
    if (!request_id || !business_type || !status || !admin_user_id) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['request_id', 'business_type', 'status', 'admin_user_id']
      });
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'under_review'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        valid_statuses: validStatuses
      });
    }

    // Check if admin user exists and has admin role
    const { data: adminProfile, error: adminError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', admin_user_id)
      .single();

    if (adminError || !adminProfile || adminProfile.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Unauthorized - Admin access required' 
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

    const tableName = `${business_type}_requests`;

    // Get the current request data
    const { data: currentRequest, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', request_id)
      .single();

    if (fetchError || !currentRequest) {
      return res.status(404).json({ 
        error: 'Request not found' 
      });
    }

    // Update the request status
    const updateData = {
      status,
      reviewed_by: admin_user_id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (review_notes) {
      updateData.review_notes = review_notes;
    }

    const { data: updatedRequest, error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', request_id)
      .select(`
        *,
        user_profiles!inner(first_name, last_name, email, phone)
      `)
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(400).json({ 
        error: 'Failed to update request status',
        details: updateError.message 
      });
    }

    // Log the status update
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: admin_user_id,
        action: 'REQUEST_STATUS_UPDATED',
        table_name: tableName,
        record_id: request_id,
        old_values: { status: currentRequest.status },
        new_values: { status, review_notes }
      }]);

    // Send notification to the user
    const notificationTitle = status === 'approved' ? 'تم قبول طلبك' : 
                            status === 'rejected' ? 'تم رفض طلبك' : 
                            'تم تحديث حالة طلبك';

    const notificationMessage = status === 'approved' ? 
      `تم قبول طلب تسجيل ${business_type} الخاص بك. مرحباً بك في منصة LUXBYTE!` :
      status === 'rejected' ? 
      `تم رفض طلب تسجيل ${business_type} الخاص بك. ${review_notes ? 'السبب: ' + review_notes : ''}` :
      `تم تحديث حالة طلب تسجيل ${business_type} الخاص بك إلى ${status}`;

    await supabase
      .from('notifications')
      .insert([{
        user_id: currentRequest.user_id,
        title: notificationTitle,
        message: notificationMessage,
        type: status === 'approved' ? 'success' : 
              status === 'rejected' ? 'error' : 'info',
        data: {
          request_id,
          business_type,
          status,
          review_notes
        }
      }]);

    // If approved, update user profile role
    if (status === 'approved') {
      await supabase
        .from('user_profiles')
        .update({ 
          role: business_type,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', currentRequest.user_id);
    }

    return res.status(200).json({
      success: true,
      request: updatedRequest,
      message: `Request status updated to ${status} successfully`
    });

  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
