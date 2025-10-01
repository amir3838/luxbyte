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
    const { email, password, first_name, last_name, phone, role } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'first_name', 'last_name']
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        phone,
        role: role || 'user'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({
        error: 'Failed to create user',
        details: authError.message
      });
    }

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        first_name,
        last_name,
        email,
        phone,
        role: role || 'user',
        status: 'active'
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({
        error: 'Failed to create user profile',
        details: profileError.message
      });
    }

    // Log the registration
    await supabase
      .from('audit_logs')
      .insert([{
        user_id: authData.user.id,
        action: 'USER_REGISTERED',
        table_name: 'user_profiles',
        record_id: authData.user.id,
        new_values: { email, first_name, last_name, role }
      }]);

    // Ensure we always return a proper JSON response
    const response = {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        first_name,
        last_name,
        phone,
        role: role || 'user',
        status: 'active'
      },
      message: 'User registered successfully'
    };

    return res.status(201).json(response);

  } catch (error) {
    console.error('Registration error:', error);

    // Ensure we always return a proper JSON response
    const errorResponse = {
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred'
    };

    return res.status(500).json(errorResponse);
  }
}
