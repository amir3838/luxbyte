// ===============================
// Clinic API - Luxbyte
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'clinic_docs';

// Documents
export async function uploadDocument({ file, kind }) {
    const user = await requireAuth();
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}_${kind}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false });

    if (uploadError) throw new Error(`فشل رفع الملف: ${uploadError.message}`);

    const { data: publicData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

    const { data, error } = await supabase
        .from('clinic_documents')
        .insert({ kind, storage_path: path, public_url: publicData.publicUrl })
        .select()
        .single();

    if (error) throw new Error(`فشل حفظ بيانات المستند: ${error.message}`);
    return data;
}

export async function listDocuments() {
    await requireAuth();
    const { data, error } = await supabase
        .from('clinic_documents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب المستندات: ${error.message}`);
    return data;
}

// Patients
export async function listPatients({ q = '', status = 'all', limit = 50, offset = 0 } = {}) {
    await requireAuth();
    let query = supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

    if (q) {
        query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    if (status !== 'all') {
        query = query.eq('is_active', status === 'active');
    }

    const { data, error } = await query;
    if (error) throw new Error(`فشل جلب المرضى: ${error.message}`);
    return data;
}

export async function addPatient(data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('patients')
        .insert(data)
        .select()
        .single();

    if (error) throw new Error(`فشل إضافة المريض: ${error.message}`);
    return result;
}

export async function updatePatient(id, data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث المريض: ${error.message}`);
    return result;
}

// Appointments
export async function listAppointments({ date, status } = {}) {
    await requireAuth();
    let query = supabase
        .from('appointments')
        .select(`
            *,
            patients(name, phone)
        `)
        .order('at', { ascending: false });

    if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        query = query.gte('at', startDate.toISOString()).lt('at', endDate.toISOString());
    }

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw new Error(`فشل جلب المواعيد: ${error.message}`);
    return data;
}

export async function updateAppointmentStatus(id, status) {
    await requireAuth();
    const { data, error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة الموعد: ${error.message}`);
    return data;
}

// Medical Records
export async function getMedicalRecords(patientId) {
    await requireAuth();
    const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب السجلات الطبية: ${error.message}`);
    return data;
}

export async function addMedicalRecord(data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('medical_records')
        .insert(data)
        .select()
        .single();

    if (error) throw new Error(`فشل إضافة السجل الطبي: ${error.message}`);
    return result;
}

// Staff
export async function listStaff() {
    await requireAuth();
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب الموظفين: ${error.message}`);
    return data;
}

// KPIs
export async function getKpis() {
    await requireAuth();
    const { data, error } = await supabase.rpc('clinic_kpis_today');
    if (error) throw new Error(`فشل جلب المؤشرات: ${error.message}`);
    return data;
}

export async function getSalesSeries(days = 14) {
    await requireAuth();
    const { data, error } = await supabase.rpc('clinic_sales_series', { days });
    if (error) throw new Error(`فشل جلب بيانات المبيعات: ${error.message}`);
    return data;
}
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'clinic_docs';

// Documents
export async function uploadDocument({ file, kind }) {
    const user = await requireAuth();
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}_${kind}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false });

    if (uploadError) throw new Error(`فشل رفع الملف: ${uploadError.message}`);

    const { data: publicData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

    const { data, error } = await supabase
        .from('clinic_documents')
        .insert({ kind, storage_path: path, public_url: publicData.publicUrl })
        .select()
        .single();

    if (error) throw new Error(`فشل حفظ بيانات المستند: ${error.message}`);
    return data;
}

export async function listDocuments() {
    await requireAuth();
    const { data, error } = await supabase
        .from('clinic_documents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب المستندات: ${error.message}`);
    return data;
}

// Patients
export async function listPatients({ q = '', status = 'all', limit = 50, offset = 0 } = {}) {
    await requireAuth();
    let query = supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

    if (q) {
        query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    if (status !== 'all') {
        query = query.eq('is_active', status === 'active');
    }

    const { data, error } = await query;
    if (error) throw new Error(`فشل جلب المرضى: ${error.message}`);
    return data;
}

export async function addPatient(data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('patients')
        .insert(data)
        .select()
        .single();

    if (error) throw new Error(`فشل إضافة المريض: ${error.message}`);
    return result;
}

export async function updatePatient(id, data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث المريض: ${error.message}`);
    return result;
}

// Appointments
export async function listAppointments({ date, status } = {}) {
    await requireAuth();
    let query = supabase
        .from('appointments')
        .select(`
            *,
            patients(name, phone)
        `)
        .order('at', { ascending: false });

    if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        query = query.gte('at', startDate.toISOString()).lt('at', endDate.toISOString());
    }

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw new Error(`فشل جلب المواعيد: ${error.message}`);
    return data;
}

export async function updateAppointmentStatus(id, status) {
    await requireAuth();
    const { data, error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة الموعد: ${error.message}`);
    return data;
}

// Medical Records
export async function getMedicalRecords(patientId) {
    await requireAuth();
    const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب السجلات الطبية: ${error.message}`);
    return data;
}

export async function addMedicalRecord(data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('medical_records')
        .insert(data)
        .select()
        .single();

    if (error) throw new Error(`فشل إضافة السجل الطبي: ${error.message}`);
    return result;
}

// Staff
export async function listStaff() {
    await requireAuth();
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب الموظفين: ${error.message}`);
    return data;
}

// KPIs
export async function getKpis() {
    await requireAuth();
    const { data, error } = await supabase.rpc('clinic_kpis_today');
    if (error) throw new Error(`فشل جلب المؤشرات: ${error.message}`);
    return data;
}

export async function getSalesSeries(days = 14) {
    await requireAuth();
    const { data, error } = await supabase.rpc('clinic_sales_series', { days });
    if (error) throw new Error(`فشل جلب بيانات المبيعات: ${error.message}`);
    return data;
}