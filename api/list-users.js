// Vercel API endpoint لعرض قائمة المستخدمين
// GET /api/list-users?page=1&limit=10

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 10, admin_key } = req.query;

    // التحقق من مفتاح الإدارة
    if (admin_key !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // الحصول على قائمة المستخدمين مع الملفات الشخصية
    const { data: profiles, error: profilesError, count } = await supabase
      .from('profiles')
      .select(`
        *,
        user:user_id (
          id,
          email,
          created_at,
          last_sign_in_at,
          email_confirmed_at
        )
      `, { count: 'exact' })
      .range(offset, offset + limitNum - 1)
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Database error:', profilesError);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // إحصائيات سريعة
    const { data: stats } = await supabase
      .from('profiles')
      .select('account')
      .then(result => {
        if (result.error) return { data: [] };
        const accounts = result.data.map(p => p.account);
        const stats = {};
        accounts.forEach(account => {
          stats[account] = (stats[account] || 0) + 1;
        });
        return { data: stats };
      });

    return res.status(200).json({
      success: true,
      data: {
        users: profiles || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          pages: Math.ceil((count || 0) / limitNum)
        },
        stats: stats || {}
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
