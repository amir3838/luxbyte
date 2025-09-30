const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      user_id,
      business_type,
      status,
      page = 1,
      limit = 10,
      admin_view = false
    } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({
        error: 'user_id is required'
      });
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user_id)
      .single();

    const isAdmin = userProfile?.role === 'admin';

    let query;
    let tableName;

    if (business_type) {
      // Get requests from specific business type
      const validTypes = ['restaurant', 'supermarket', 'pharmacy', 'clinic', 'courier', 'driver'];
      if (!validTypes.includes(business_type)) {
        return res.status(400).json({
          error: 'Invalid business type',
          valid_types: validTypes
        });
      }

      tableName = `${business_type}_requests`;
      query = supabase.from(tableName).select(`
        *,
        user_profiles!inner(first_name, last_name, email, phone)
      `);

      // Apply filters
      if (!admin_view || !isAdmin) {
        query = query.eq('user_id', user_id);
      }

      if (status) {
        query = query.eq('status', status);
      }

    } else {
      // Get all business requests using the view
      query = supabase.from('all_business_requests').select(`
        *,
        user_profiles!inner(first_name, last_name, email, phone)
      `);

      if (!admin_view || !isAdmin) {
        query = query.eq('user_id', user_id);
      }

      if (status) {
        query = query.eq('status', status);
      }
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Order by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(400).json({
        error: 'Failed to fetch business requests',
        details: error.message
      });
    }

    // Get total count for pagination
    let totalCount = 0;
    if (business_type) {
      const { count: total } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .eq(!admin_view || !isAdmin ? 'user_id' : 'id', !admin_view || !isAdmin ? user_id : 'not.null');
      totalCount = total || 0;
    } else {
      const { count: total } = await supabase
        .from('all_business_requests')
        .select('*', { count: 'exact', head: true })
        .eq(!admin_view || !isAdmin ? 'user_id' : 'id', !admin_view || !isAdmin ? user_id : 'not.null');
      totalCount = total || 0;
    }

    return res.status(200).json({
      success: true,
      data: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      filters: {
        business_type: business_type || 'all',
        status: status || 'all',
        admin_view: admin_view === 'true' && isAdmin
      }
    });

  } catch (error) {
    console.error('Get requests error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
