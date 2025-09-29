-- دوال Supabase للوحات التحكم
-- Supabase Functions for Dashboards

-- دالة الحصول على إحصائيات لوحة التحكم
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id UUID, activity_type TEXT)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', COALESCE((
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = $1
        ), 0),
        'pending_orders', COALESCE((
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = $1 AND status = 'pending'
        ), 0),
        'completed_orders', COALESCE((
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = $1 AND status = 'completed'
        ), 0),
        'total_revenue', COALESCE((
            SELECT SUM(total_amount)
            FROM orders
            WHERE user_id = $1 AND status = 'completed'
        ), 0),
        'total_files', COALESCE((
            SELECT COUNT(*)
            FROM uploaded_files
            WHERE user_id = $1
        ), 0),
        'active_orders', COALESCE((
            SELECT COUNT(*)
            FROM orders
            WHERE user_id = $1 AND status IN ('pending', 'processing', 'shipped')
        ), 0)
    ) INTO stats;

    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على طلبات المستخدم
CREATE OR REPLACE FUNCTION get_user_orders(
    user_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0,
    status_filter TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    orders JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', o.id,
            'order_type', o.order_type,
            'status', o.status,
            'total_amount', o.total_amount,
            'customer_name', o.customer_name,
            'delivery_address', o.delivery_address,
            'notes', o.notes,
            'created_at', o.created_at,
            'updated_at', o.updated_at
        )
    ) INTO orders
    FROM orders o
    WHERE o.user_id = $1
    AND ($4 IS NULL OR o.status = $4)
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(orders, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة إنشاء طلب جديد
CREATE OR REPLACE FUNCTION create_order(
    user_id UUID,
    order_type TEXT,
    total_amount DECIMAL,
    items JSONB,
    delivery_address TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    new_order_id UUID;
    result JSON;
BEGIN
    INSERT INTO orders (
        user_id,
        order_type,
        status,
        total_amount,
        items,
        delivery_address,
        notes,
        created_at,
        updated_at
    ) VALUES (
        $1,
        $2,
        'pending',
        $3,
        $4,
        $5,
        $6,
        NOW(),
        NOW()
    ) RETURNING id INTO new_order_id;

    SELECT json_build_object(
        'success', true,
        'order_id', new_order_id,
        'message', 'تم إنشاء الطلب بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة تحديث حالة الطلب
CREATE OR REPLACE FUNCTION update_order_status(
    order_id UUID,
    user_id UUID,
    new_status TEXT
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    affected_rows INTEGER;
BEGIN
    UPDATE orders
    SET status = $3, updated_at = NOW()
    WHERE id = $1 AND user_id = $2;

    GET DIAGNOSTICS affected_rows = ROW_COUNT;

    IF affected_rows > 0 THEN
        SELECT json_build_object(
            'success', true,
            'message', 'تم تحديث حالة الطلب بنجاح'
        ) INTO result;
    ELSE
        SELECT json_build_object(
            'success', false,
            'message', 'لم يتم العثور على الطلب أو لا توجد صلاحية للتعديل'
        ) INTO result;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على الملفات المرفوعة
CREATE OR REPLACE FUNCTION get_uploaded_files(
    user_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    files JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', f.id,
            'file_name', f.file_name,
            'file_path', f.file_path,
            'file_type', f.file_type,
            'file_size', f.file_size,
            'mime_type', f.mime_type,
            'created_at', f.created_at
        )
    ) INTO files
    FROM uploaded_files f
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(files, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة رفع ملف
CREATE OR REPLACE FUNCTION upload_file(
    user_id UUID,
    request_id UUID,
    file_name TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size BIGINT,
    mime_type TEXT
)
RETURNS JSON AS $$
DECLARE
    new_file_id UUID;
    result JSON;
BEGIN
    INSERT INTO uploaded_files (
        user_id,
        request_id,
        file_name,
        file_path,
        file_type,
        file_size,
        mime_type,
        created_at
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        NOW()
    ) RETURNING id INTO new_file_id;

    SELECT json_build_object(
        'success', true,
        'file_id', new_file_id,
        'message', 'تم رفع الملف بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة حذف ملف
CREATE OR REPLACE FUNCTION delete_file(
    file_id UUID,
    user_id UUID
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    affected_rows INTEGER;
BEGIN
    DELETE FROM uploaded_files
    WHERE id = $1 AND user_id = $2;

    GET DIAGNOSTICS affected_rows = ROW_COUNT;

    IF affected_rows > 0 THEN
        SELECT json_build_object(
            'success', true,
            'message', 'تم حذف الملف بنجاح'
        ) INTO result;
    ELSE
        SELECT json_build_object(
            'success', false,
            'message', 'لم يتم العثور على الملف أو لا توجد صلاحية للحذف'
        ) INTO result;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على بيانات المستخدم
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS JSON AS $$
DECLARE
    profile JSON;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'name', p.name,
        'email', p.email,
        'phone', p.phone,
        'activity_type', p.activity_type,
        'created_at', p.created_at,
        'updated_at', p.updated_at
    ) INTO profile
    FROM user_profiles p
    WHERE p.id = $1;

    RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة تحديث بيانات المستخدم
CREATE OR REPLACE FUNCTION update_user_profile(
    user_id UUID,
    name TEXT DEFAULT NULL,
    phone TEXT DEFAULT NULL,
    additional_data JSONB DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    affected_rows INTEGER;
BEGIN
    UPDATE user_profiles
    SET
        name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        updated_at = NOW()
    WHERE id = $1;

    GET DIAGNOSTICS affected_rows = ROW_COUNT;

    IF affected_rows > 0 THEN
        SELECT json_build_object(
            'success', true,
            'message', 'تم تحديث البيانات بنجاح'
        ) INTO result;
    ELSE
        SELECT json_build_object(
            'success', false,
            'message', 'لم يتم العثور على المستخدم'
        ) INTO result;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على عناصر القائمة (للمطاعم)
CREATE OR REPLACE FUNCTION get_menu_items(
    restaurant_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    items JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', m.id,
            'name', m.name,
            'description', m.description,
            'price', m.price,
            'category', m.category,
            'created_at', m.created_at
        )
    ) INTO items
    FROM menu_items m
    WHERE m.restaurant_id = $1
    ORDER BY m.created_at DESC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(items, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة إضافة عنصر للقائمة
CREATE OR REPLACE FUNCTION add_menu_item(
    restaurant_id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    category TEXT
)
RETURNS JSON AS $$
DECLARE
    new_item_id UUID;
    result JSON;
BEGIN
    INSERT INTO menu_items (
        restaurant_id,
        name,
        description,
        price,
        category,
        created_at
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        NOW()
    ) RETURNING id INTO new_item_id;

    SELECT json_build_object(
        'success', true,
        'item_id', new_item_id,
        'message', 'تم إضافة العنصر بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على المنتجات (للسوبر ماركت)
CREATE OR REPLACE FUNCTION get_products(
    supermarket_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    products JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', p.id,
            'name', p.name,
            'description', p.description,
            'price', p.price,
            'category', p.category,
            'stock_quantity', p.stock_quantity,
            'created_at', p.created_at
        )
    ) INTO products
    FROM products p
    WHERE p.supermarket_id = $1
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(products, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة إضافة منتج
CREATE OR REPLACE FUNCTION add_product(
    supermarket_id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    category TEXT,
    stock_quantity INTEGER
)
RETURNS JSON AS $$
DECLARE
    new_product_id UUID;
    result JSON;
BEGIN
    INSERT INTO products (
        supermarket_id,
        name,
        description,
        price,
        category,
        stock_quantity,
        created_at
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        NOW()
    ) RETURNING id INTO new_product_id;

    SELECT json_build_object(
        'success', true,
        'product_id', new_product_id,
        'message', 'تم إضافة المنتج بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على الأدوية (للصيدليات)
CREATE OR REPLACE FUNCTION get_medicines(
    pharmacy_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    medicines JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', m.id,
            'name', m.name,
            'description', m.description,
            'price', m.price,
            'category', m.category,
            'stock_quantity', m.stock_quantity,
            'expiry_date', m.expiry_date,
            'created_at', m.created_at
        )
    ) INTO medicines
    FROM medicines m
    WHERE m.pharmacy_id = $1
    ORDER BY m.created_at DESC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(medicines, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة إضافة دواء
CREATE OR REPLACE FUNCTION add_medicine(
    pharmacy_id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    category TEXT,
    stock_quantity INTEGER,
    expiry_date DATE
)
RETURNS JSON AS $$
DECLARE
    new_medicine_id UUID;
    result JSON;
BEGIN
    INSERT INTO medicines (
        pharmacy_id,
        name,
        description,
        price,
        category,
        stock_quantity,
        expiry_date,
        created_at
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        NOW()
    ) RETURNING id INTO new_medicine_id;

    SELECT json_build_object(
        'success', true,
        'medicine_id', new_medicine_id,
        'message', 'تم إضافة الدواء بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على المواعيد (للعيادات)
CREATE OR REPLACE FUNCTION get_appointments(
    clinic_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    appointments JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', a.id,
            'patient_name', a.patient_name,
            'appointment_date', a.appointment_date,
            'appointment_time', a.appointment_time,
            'appointment_type', a.appointment_type,
            'status', a.status,
            'notes', a.notes,
            'created_at', a.created_at
        )
    ) INTO appointments
    FROM appointments a
    WHERE a.clinic_id = $1
    ORDER BY a.appointment_date ASC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(appointments, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة إضافة موعد
CREATE OR REPLACE FUNCTION add_appointment(
    clinic_id UUID,
    patient_name TEXT,
    appointment_date DATE,
    appointment_time TIME,
    appointment_type TEXT,
    notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    new_appointment_id UUID;
    result JSON;
BEGIN
    INSERT INTO appointments (
        clinic_id,
        patient_name,
        appointment_date,
        appointment_time,
        appointment_type,
        status,
        notes,
        created_at
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        'scheduled',
        $6,
        NOW()
    ) RETURNING id INTO new_appointment_id;

    SELECT json_build_object(
        'success', true,
        'appointment_id', new_appointment_id,
        'message', 'تم حجز الموعد بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على الطلبات (للمندوبين)
CREATE OR REPLACE FUNCTION get_deliveries(
    courier_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    deliveries JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', d.id,
            'customer_name', d.customer_name,
            'delivery_address', d.delivery_address,
            'delivery_fee', d.delivery_fee,
            'status', d.status,
            'created_at', d.created_at
        )
    ) INTO deliveries
    FROM deliveries d
    WHERE d.courier_id = $1
    ORDER BY d.created_at DESC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(deliveries, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة تحديث موقع المندوب
CREATE OR REPLACE FUNCTION update_courier_location(
    courier_id UUID,
    latitude DECIMAL,
    longitude DECIMAL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    INSERT INTO courier_locations (
        courier_id,
        latitude,
        longitude,
        updated_at
    ) VALUES (
        $1,
        $2,
        $3,
        NOW()
    ) ON CONFLICT (courier_id)
    DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        updated_at = EXCLUDED.updated_at;

    SELECT json_build_object(
        'success', true,
        'message', 'تم تحديث الموقع بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة الحصول على أعضاء الفريق (للسائقين الرئيسيين)
CREATE OR REPLACE FUNCTION get_team_members(
    driver_id UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    members JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', t.id,
            'name', t.name,
            'phone', t.phone,
            'email', t.email,
            'role', t.role,
            'created_at', t.created_at
        )
    ) INTO members
    FROM team_members t
    WHERE t.driver_id = $1
    ORDER BY t.created_at DESC
    LIMIT $2 OFFSET $3;

    RETURN COALESCE(members, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة إضافة عضو للفريق
CREATE OR REPLACE FUNCTION add_team_member(
    driver_id UUID,
    name TEXT,
    phone TEXT,
    email TEXT,
    role TEXT
)
RETURNS JSON AS $$
DECLARE
    new_member_id UUID;
    result JSON;
BEGIN
    INSERT INTO team_members (
        driver_id,
        name,
        phone,
        email,
        role,
        created_at
    ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        NOW()
    ) RETURNING id INTO new_member_id;

    SELECT json_build_object(
        'success', true,
        'member_id', new_member_id,
        'message', 'تم إضافة العضو للفريق بنجاح'
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
