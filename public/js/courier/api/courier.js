// ===============================
// Courier API - Luxbyte
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'courier_docs';

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
        .from('courier_documents')
        .insert({ kind, storage_path: path, public_url: publicData.publicUrl })
        .select()
        .single();

    if (error) throw new Error(`فشل حفظ بيانات المستند: ${error.message}`);
    return data;
}

export async function listDocuments() {
    await requireAuth();
    const { data, error } = await supabase
        .from('courier_documents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب المستندات: ${error.message}`);
    return data;
}

// Deliveries
export async function listDeliveries({ status = 'all', from = null, to = null, limit = 50 } = {}) {
    await requireAuth();
    let query = supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    if (from) {
        query = query.gte('created_at', from);
    }

    if (to) {
        query = query.lte('created_at', to);
    }

    const { data, error } = await query;
    if (error) throw new Error(`فشل جلب التوصيلات: ${error.message}`);
    return data;
}

export async function acceptDelivery(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'picked-up' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل قبول التوصيل: ${error.message}`);
    return data;
}

export async function rejectDelivery(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل رفض التوصيل: ${error.message}`);
    return data;
}

export async function markPickedUp(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'picked-up' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة الاستلام: ${error.message}`);
    return data;
}

export async function markInTransit(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'in-transit' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة التوصيل: ${error.message}`);
    return data;
}

export async function markDelivered(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'delivered' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة التسليم: ${error.message}`);
    return data;
}

// Shifts
export async function startShift() {
    await requireAuth();
    const { data, error } = await supabase
        .from('courier_shifts')
        .insert({ start_at: new Date().toISOString() })
        .select()
        .single();

    if (error) throw new Error(`فشل بدء الدوام: ${error.message}`);
    return data;
}

export async function endShift() {
    await requireAuth();
    const { data: activeShift, error: fetchError } = await supabase
        .from('courier_shifts')
        .select('*')
        .eq('owner', (await supabase.auth.getUser()).data.user.id)
        .is('end_at', null)
        .order('start_at', { ascending: false })
        .limit(1)
        .single();

    if (fetchError) throw new Error(`فشل جلب الدوام النشط: ${fetchError.message}`);

    const endTime = new Date();
    const startTime = new Date(activeShift.start_at);
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);

    const { data, error } = await supabase
        .from('courier_shifts')
        .update({
            end_at: endTime.toISOString(),
            total_hours: totalHours
        })
        .eq('id', activeShift.id)
        .select()
        .single();

    if (error) throw new Error(`فشل إنهاء الدوام: ${error.message}`);
    return data;
}

// Vehicle
export async function getVehicle() {
    await requireAuth();
    const { data, error } = await supabase
        .from('vehicle')
        .select('*')
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw new Error(`فشل جلب بيانات المركبة: ${error.message}`);
    }
    return data;
}

export async function updateVehicle(data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('vehicle')
        .upsert(data)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث بيانات المركبة: ${error.message}`);
    return result;
}

// Location
export async function updateLocation({ lat, lng }) {
    await requireAuth();
    // Store location in vehicle table or create separate locations table
    const { data, error } = await supabase
        .from('vehicle')
        .upsert({
            location_lat: lat,
            location_lng: lng,
            location_updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث الموقع: ${error.message}`);
    return data;
}

// KPIs
export async function getKpis() {
    await requireAuth();
    const { data, error } = await supabase.rpc('courier_kpis_today');
    if (error) throw new Error(`فشل جلب المؤشرات: ${error.message}`);
    return data;
}

export async function getSalesSeries(days = 14) {
    await requireAuth();
    const { data, error } = await supabase.rpc('courier_sales_series', { days });
    if (error) throw new Error(`فشل جلب بيانات المبيعات: ${error.message}`);
    return data;
}
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'courier_docs';

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
        .from('courier_documents')
        .insert({ kind, storage_path: path, public_url: publicData.publicUrl })
        .select()
        .single();

    if (error) throw new Error(`فشل حفظ بيانات المستند: ${error.message}`);
    return data;
}

export async function listDocuments() {
    await requireAuth();
    const { data, error } = await supabase
        .from('courier_documents')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`فشل جلب المستندات: ${error.message}`);
    return data;
}

// Deliveries
export async function listDeliveries({ status = 'all', from = null, to = null, limit = 50 } = {}) {
    await requireAuth();
    let query = supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    if (from) {
        query = query.gte('created_at', from);
    }

    if (to) {
        query = query.lte('created_at', to);
    }

    const { data, error } = await query;
    if (error) throw new Error(`فشل جلب التوصيلات: ${error.message}`);
    return data;
}

export async function acceptDelivery(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'picked-up' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل قبول التوصيل: ${error.message}`);
    return data;
}

export async function rejectDelivery(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل رفض التوصيل: ${error.message}`);
    return data;
}

export async function markPickedUp(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'picked-up' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة الاستلام: ${error.message}`);
    return data;
}

export async function markInTransit(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'in-transit' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة التوصيل: ${error.message}`);
    return data;
}

export async function markDelivered(id) {
    await requireAuth();
    const { data, error } = await supabase
        .from('deliveries')
        .update({ status: 'delivered' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث حالة التسليم: ${error.message}`);
    return data;
}

// Shifts
export async function startShift() {
    await requireAuth();
    const { data, error } = await supabase
        .from('courier_shifts')
        .insert({ start_at: new Date().toISOString() })
        .select()
        .single();

    if (error) throw new Error(`فشل بدء الدوام: ${error.message}`);
    return data;
}

export async function endShift() {
    await requireAuth();
    const { data: activeShift, error: fetchError } = await supabase
        .from('courier_shifts')
        .select('*')
        .eq('owner', (await supabase.auth.getUser()).data.user.id)
        .is('end_at', null)
        .order('start_at', { ascending: false })
        .limit(1)
        .single();

    if (fetchError) throw new Error(`فشل جلب الدوام النشط: ${fetchError.message}`);

    const endTime = new Date();
    const startTime = new Date(activeShift.start_at);
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);

    const { data, error } = await supabase
        .from('courier_shifts')
        .update({
            end_at: endTime.toISOString(),
            total_hours: totalHours
        })
        .eq('id', activeShift.id)
        .select()
        .single();

    if (error) throw new Error(`فشل إنهاء الدوام: ${error.message}`);
    return data;
}

// Vehicle
export async function getVehicle() {
    await requireAuth();
    const { data, error } = await supabase
        .from('vehicle')
        .select('*')
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw new Error(`فشل جلب بيانات المركبة: ${error.message}`);
    }
    return data;
}

export async function updateVehicle(data) {
    await requireAuth();
    const { data: result, error } = await supabase
        .from('vehicle')
        .upsert(data)
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث بيانات المركبة: ${error.message}`);
    return result;
}

// Location
export async function updateLocation({ lat, lng }) {
    await requireAuth();
    // Store location in vehicle table or create separate locations table
    const { data, error } = await supabase
        .from('vehicle')
        .upsert({
            location_lat: lat,
            location_lng: lng,
            location_updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw new Error(`فشل تحديث الموقع: ${error.message}`);
    return data;
}

// KPIs
export async function getKpis() {
    await requireAuth();
    const { data, error } = await supabase.rpc('courier_kpis_today');
    if (error) throw new Error(`فشل جلب المؤشرات: ${error.message}`);
    return data;
}

export async function getSalesSeries(days = 14) {
    await requireAuth();
    const { data, error } = await supabase.rpc('courier_sales_series', { days });
    if (error) throw new Error(`فشل جلب بيانات المبيعات: ${error.message}`);
    return data;
}