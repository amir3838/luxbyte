-- إنشاء جداول إدارة الملفات والمستندات لمشروع Luxbyte
-- تاريخ الإنشاء: 2025-01-28

-- جدول أنواع الأنشطة
CREATE TABLE IF NOT EXISTS activity_types (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج أنواع الأنشطة
INSERT INTO activity_types (name_ar, name_en, description_ar, description_en) VALUES
('مطعم', 'Restaurant', 'إدارة الطلبات والقوائم', 'Order and menu management'),
('سوبر ماركت', 'Supermarket', 'نظام نقاط البيع والمبيعات', 'POS and sales system'),
('صيدلية', 'Pharmacy', 'إدارة المخزون والطلبات الطبية', 'Medical inventory and order management'),
('عيادة', 'Clinic', 'حجز المواعيد وإدارة المرضى', 'Appointment booking and patient management'),
('مندوب التوصيل', 'Courier', 'شبكة توصيل سريعة وآمنة', 'Fast and secure delivery network'),
('سائق رئيسي', 'Master Driver', 'خدمة نقل الركاب', 'Passenger transport service');

-- جدول أنواع المستندات المطلوبة
CREATE TABLE IF NOT EXISTS document_types (
    id SERIAL PRIMARY KEY,
    activity_type_id INTEGER REFERENCES activity_types(id) ON DELETE CASCADE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    is_required BOOLEAN DEFAULT false,
    file_formats TEXT[] DEFAULT ARRAY['jpg', 'jpeg', 'png', 'pdf'],
    max_file_size_mb INTEGER DEFAULT 5,
    preferred_dimensions VARCHAR(50), -- مثل "512x512" أو "1280x720"
    description_ar TEXT,
    description_en TEXT,
    suggested_filename VARCHAR(100),
    storage_path_template VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج أنواع المستندات للمطعم
INSERT INTO document_types (activity_type_id, name_ar, name_en, is_required, file_formats, max_file_size_mb, preferred_dimensions, description_ar, description_en, suggested_filename, storage_path_template) VALUES
(1, 'لوجو المطعم', 'Restaurant Logo', true, ARRAY['png'], 2, '512x512', 'لوجو المطعم بخلفية شفافة', 'Restaurant logo with transparent background', 'restaurant_logo.png', 'restaurant/requests/{uid}/'),
(1, 'صورة غلاف', 'Cover Photo', true, ARRAY['jpg', 'jpeg'], 5, '1200x600', 'صورة غلاف المطعم', 'Restaurant cover photo', 'restaurant_cover.jpg', 'restaurant/requests/{uid}/'),
(1, 'واجهة المحل', 'Store Facade', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة واجهة المحل الخارجية', 'External store facade photo', 'restaurant_facade.jpg', 'restaurant/requests/{uid}/'),
(1, 'السجل التجاري', 'Commercial Registration', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'السجل التجاري للمطعم', 'Restaurant commercial registration', 'restaurant_cr.pdf', 'restaurant/requests/{uid}/'),
(1, 'رخصة التشغيل', 'Operating License', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'رخصة تشغيل المطعم', 'Restaurant operating license', 'restaurant_op_license.pdf', 'restaurant/requests/{uid}/'),
(1, 'قائمة الطعام', 'Menu', false, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'قائمة الطعام (اختياري)', 'Menu (optional)', 'menu.pdf', 'restaurant/requests/{uid}/');

-- إدراج أنواع المستندات للسوبر ماركت
INSERT INTO document_types (activity_type_id, name_ar, name_en, is_required, file_formats, max_file_size_mb, preferred_dimensions, description_ar, description_en, suggested_filename, storage_path_template) VALUES
(2, 'لوجو السوبر ماركت', 'Supermarket Logo', true, ARRAY['png'], 2, '512x512', 'لوجو السوبر ماركت', 'Supermarket logo', 'market_logo.png', 'supermarket/requests/{uid}/'),
(2, 'واجهة/أرفف المتجر', 'Store Shelves', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة أرفف المتجر الداخلية', 'Internal store shelves photo', 'market_shelves.jpg', 'supermarket/requests/{uid}/'),
(2, 'السجل التجاري', 'Commercial Registration', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'السجل التجاري للسوبر ماركت', 'Supermarket commercial registration', 'market_cr.pdf', 'supermarket/requests/{uid}/'),
(2, 'رخصة النشاط', 'Activity License', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'رخصة نشاط السوبر ماركت', 'Supermarket activity license', 'market_activity_license.pdf', 'supermarket/requests/{uid}/'),
(2, 'صورة خارجية للمحل', 'External Store Photo', false, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة خارجية للمحل (اختياري)', 'External store photo (optional)', 'market_facade.jpg', 'supermarket/requests/{uid}/');

-- إدراج أنواع المستندات للصيدلية
INSERT INTO document_types (activity_type_id, name_ar, name_en, is_required, file_formats, max_file_size_mb, preferred_dimensions, description_ar, description_en, suggested_filename, storage_path_template) VALUES
(3, 'لوجو الصيدلية', 'Pharmacy Logo', true, ARRAY['png'], 2, '512x512', 'لوجو الصيدلية', 'Pharmacy logo', 'pharmacy_logo.png', 'pharmacy/requests/{uid}/'),
(3, 'واجهة الصيدلية', 'Pharmacy Facade', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة واجهة الصيدلية', 'Pharmacy facade photo', 'pharmacy_facade.jpg', 'pharmacy/requests/{uid}/'),
(3, 'ترخيص مزاولة المهنة', 'Practice License', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'ترخيص مزاولة مهنة الصيدلة', 'Pharmacy practice license', 'pharmacy_practice_license.pdf', 'pharmacy/requests/{uid}/'),
(3, 'السجل التجاري', 'Commercial Registration', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'السجل التجاري للصيدلية', 'Pharmacy commercial registration', 'pharmacy_cr.pdf', 'pharmacy/requests/{uid}/'),
(3, 'لافتة داخلية/كونتر', 'Interior Signage', false, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'لافتة داخلية أو كونتر الصيدلية (اختياري)', 'Interior signage or counter (optional)', 'pharmacy_interior.jpg', 'pharmacy/requests/{uid}/');

-- إدراج أنواع المستندات للعيادة
INSERT INTO document_types (activity_type_id, name_ar, name_en, is_required, file_formats, max_file_size_mb, preferred_dimensions, description_ar, description_en, suggested_filename, storage_path_template) VALUES
(4, 'لوجو العيادة', 'Clinic Logo', true, ARRAY['png', 'jpg', 'jpeg'], 2, '512x512', 'لوجو العيادة أو صورة الطبيب', 'Clinic logo or doctor photo', 'clinic_logo.png', 'clinic/requests/{uid}/'),
(4, 'واجهة/الاستقبال', 'Reception Area', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة واجهة العيادة أو منطقة الاستقبال', 'Clinic facade or reception area photo', 'clinic_facade.jpg', 'clinic/requests/{uid}/'),
(4, 'رخصة العيادة', 'Clinic License', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'رخصة العيادة', 'Clinic license', 'clinic_license.pdf', 'clinic/requests/{uid}/'),
(4, 'بطاقة الطبيب - الوجه الأمامي', 'Doctor ID Front', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة بطاقة الطبيب - الوجه الأمامي', 'Doctor ID card front side', 'doctor_id_front.jpg', 'clinic/requests/{uid}/'),
(4, 'بطاقة الطبيب - الوجه الخلفي', 'Doctor ID Back', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة بطاقة الطبيب - الوجه الخلفي', 'Doctor ID card back side', 'doctor_id_back.jpg', 'clinic/requests/{uid}/'),
(4, 'شهادة مزاولة/زمالة', 'Practice Certificate', false, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'شهادة مزاولة المهنة أو الزمالة (اختياري)', 'Practice or fellowship certificate (optional)', 'doctor_certificate.pdf', 'clinic/requests/{uid}/');

-- إدراج أنواع المستندات لمندوب التوصيل
INSERT INTO document_types (activity_type_id, name_ar, name_en, is_required, file_formats, max_file_size_mb, preferred_dimensions, description_ar, description_en, suggested_filename, storage_path_template) VALUES
(5, 'بطاقة الهوية - الوجه الأمامي', 'ID Card Front', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة بطاقة الهوية - الوجه الأمامي', 'ID card front side', 'id_front.jpg', 'courier/requests/{uid}/'),
(5, 'بطاقة الهوية - الوجه الخلفي', 'ID Card Back', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة بطاقة الهوية - الوجه الخلفي', 'ID card back side', 'id_back.jpg', 'courier/requests/{uid}/'),
(5, 'رخصة القيادة', 'Driving License', true, ARRAY['jpg', 'jpeg', 'pdf'], 5, '1280x720', 'رخصة القيادة', 'Driving license', 'driving_license.jpg', 'courier/requests/{uid}/'),
(5, 'صورة المركبة + اللوحة', 'Vehicle Photo', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة المركبة مع لوحة الأرقام', 'Vehicle photo with license plate', 'vehicle_photo.jpg', 'courier/requests/{uid}/'),
(5, 'صحيفة الحالة الجنائية', 'Background Check', false, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'صحيفة الحالة الجنائية (اختياري)', 'Background check (optional)', 'background_check.pdf', 'courier/requests/{uid}/'),
(5, 'رخصة المركبة', 'Vehicle License', false, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'رخصة المركبة أو ترخيص السير (اختياري)', 'Vehicle license (optional)', 'vehicle_license.pdf', 'courier/requests/{uid}/');

-- إدراج أنواع المستندات للسائق الرئيسي
INSERT INTO document_types (activity_type_id, name_ar, name_en, is_required, file_formats, max_file_size_mb, preferred_dimensions, description_ar, description_en, suggested_filename, storage_path_template) VALUES
(6, 'بطاقة الهوية - الوجه الأمامي', 'ID Card Front', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة بطاقة الهوية - الوجه الأمامي', 'ID card front side', 'id_front.jpg', 'courier/requests/{uid}/'),
(6, 'بطاقة الهوية - الوجه الخلفي', 'ID Card Back', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة بطاقة الهوية - الوجه الخلفي', 'ID card back side', 'id_back.jpg', 'courier/requests/{uid}/'),
(6, 'رخصة القيادة', 'Driving License', true, ARRAY['jpg', 'jpeg', 'pdf'], 5, '1280x720', 'رخصة القيادة', 'Driving license', 'driving_license.jpg', 'courier/requests/{uid}/'),
(6, 'صورة المركبة + اللوحة', 'Vehicle Photo', true, ARRAY['jpg', 'jpeg'], 5, '1280x720', 'صورة المركبة مع لوحة الأرقام', 'Vehicle photo with license plate', 'vehicle_photo.jpg', 'courier/requests/{uid}/'),
(6, 'رخصة المركبة', 'Vehicle License', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'رخصة المركبة أو ترخيص السير', 'Vehicle license', 'vehicle_license.pdf', 'courier/requests/{uid}/'),
(6, 'تأمين المركبة', 'Vehicle Insurance', true, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'تأمين المركبة الساري', 'Valid vehicle insurance', 'insurance.pdf', 'courier/requests/{uid}/'),
(6, 'صحيفة الحالة الجنائية', 'Background Check', false, ARRAY['pdf', 'jpg', 'jpeg'], 5, NULL, 'صحيفة الحالة الجنائية (اختياري)', 'Background check (optional)', 'background_check.pdf', 'courier/requests/{uid}/');

-- جدول طلبات التسجيل
CREATE TABLE IF NOT EXISTS registration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type_id INTEGER REFERENCES activity_types(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'needs_more_info')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الملفات المرفوعة
CREATE TABLE IF NOT EXISTS uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES registration_requests(id) ON DELETE CASCADE,
    document_type_id INTEGER REFERENCES document_types(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    upload_status VARCHAR(20) DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded', 'processing', 'verified', 'rejected')),
    validation_errors TEXT[],
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_registration_requests_user_id ON registration_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_registration_requests_activity_type_id ON registration_requests(activity_type_id);
CREATE INDEX IF NOT EXISTS idx_registration_requests_status ON registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_request_id ON uploaded_files(request_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_document_type_id ON uploaded_files(document_type_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_upload_status ON uploaded_files(upload_status);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الدالة على الجداول
CREATE TRIGGER update_activity_types_updated_at BEFORE UPDATE ON activity_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_types_updated_at BEFORE UPDATE ON document_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registration_requests_updated_at BEFORE UPDATE ON registration_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_uploaded_files_updated_at BEFORE UPDATE ON uploaded_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء سياسات الأمان (RLS)
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- سياسات للقراءة العامة
CREATE POLICY "Allow public read access to activity_types" ON activity_types FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to document_types" ON document_types FOR SELECT USING (true);

-- سياسات للمستخدمين المسجلين
CREATE POLICY "Users can view their own requests" ON registration_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own requests" ON registration_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending requests" ON registration_requests FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can view files for their requests" ON uploaded_files FOR SELECT USING (
    EXISTS (SELECT 1 FROM registration_requests WHERE id = request_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert files for their requests" ON uploaded_files FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM registration_requests WHERE id = request_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update files for their requests" ON uploaded_files FOR UPDATE USING (
    EXISTS (SELECT 1 FROM registration_requests WHERE id = request_id AND user_id = auth.uid())
);

-- سياسات للمديرين
CREATE POLICY "Admins can view all requests" ON registration_requests FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);
CREATE POLICY "Admins can view all files" ON uploaded_files FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
);
