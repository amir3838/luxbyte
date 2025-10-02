// ===============================
// driver/api/driver.js — All data I/O with Supabase (DB + Storage)
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'driver_docs';

// ---- Documents
export async function uploadDocument({ file, kind }) {
  const user = await requireAuth();
  const ext = file.name.split('.').pop();
  const path = `${user.id}/${Date.now()}_${kind}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await supabase
    .from('driver_documents')
    .insert({ kind, storage_path: path, public_url: pub?.publicUrl || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listDocuments() {
  await requireAuth();
  const { data, error } = await supabase.from('driver_documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ---- Rides
export async function listRides({ status = 'all' } = {}) {
  await requireAuth();
  let q = supabase.from('rides').select('*, customer:driver_customers(*)').order('created_at', { ascending: false }).limit(100);
  if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function updateRideStatus(id, status) {
  await requireAuth();
  const { data, error } = await supabase.from('rides').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ---- Vehicle
export async function getVehicle() {
  await requireAuth();
  const { data, error } = await supabase.from('vehicle').select('*').single();
  if (error) throw error;
  return data;
}

export async function updateVehicle(payload) {
  await requireAuth();
  const { data, error } = await supabase.from('vehicle').upsert(payload, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

// ---- Shifts
export async function startShift() {
  await requireAuth();
  const { data, error } = await supabase.from('driver_shifts').insert({ start_at: new Date().toISOString(), status: 'open' }).select().single();
  if (error) throw error;
  return data;
}

export async function endShift() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_close_current_shift');
  if (error) throw error;
  return data;
}

// ---- Location
export async function updateLocation({ lat, lng }) {
  await requireAuth();
  const { data, error } = await supabase.from('driver_locations').insert({ latitude: lat, longitude: lng }).select().single();
  if (error) throw error;
  return data;
}

// ---- KPIs
export async function getKpis() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_kpis_today');
  if (error) throw error;
  return data;
}

// ---- Reports
export async function getSalesSummary() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_sales_summary');
  if (error) throw error;
  return data;
}

export async function getSalesSeries() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_sales_series');
  if (error) throw error;
  return data;
}
// driver/api/driver.js — All data I/O with Supabase (DB + Storage)
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'driver_docs';

// ---- Documents
export async function uploadDocument({ file, kind }) {
  const user = await requireAuth();
  const ext = file.name.split('.').pop();
  const path = `${user.id}/${Date.now()}_${kind}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await supabase
    .from('driver_documents')
    .insert({ kind, storage_path: path, public_url: pub?.publicUrl || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listDocuments() {
  await requireAuth();
  const { data, error } = await supabase.from('driver_documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ---- Rides
export async function listRides({ status = 'all' } = {}) {
  await requireAuth();
  let q = supabase.from('rides').select('*, customer:driver_customers(*)').order('created_at', { ascending: false }).limit(100);
  if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function updateRideStatus(id, status) {
  await requireAuth();
  const { data, error } = await supabase.from('rides').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ---- Vehicle
export async function getVehicle() {
  await requireAuth();
  const { data, error } = await supabase.from('vehicle').select('*').single();
  if (error) throw error;
  return data;
}

export async function updateVehicle(payload) {
  await requireAuth();
  const { data, error } = await supabase.from('vehicle').upsert(payload, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

// ---- Shifts
export async function startShift() {
  await requireAuth();
  const { data, error } = await supabase.from('driver_shifts').insert({ start_at: new Date().toISOString(), status: 'open' }).select().single();
  if (error) throw error;
  return data;
}

export async function endShift() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_close_current_shift');
  if (error) throw error;
  return data;
}

// ---- Location
export async function updateLocation({ lat, lng }) {
  await requireAuth();
  const { data, error } = await supabase.from('driver_locations').insert({ latitude: lat, longitude: lng }).select().single();
  if (error) throw error;
  return data;
}

// ---- KPIs
export async function getKpis() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_kpis_today');
  if (error) throw error;
  return data;
}

// ---- Reports
export async function getSalesSummary() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_sales_summary');
  if (error) throw error;
  return data;
}

export async function getSalesSeries() {
  await requireAuth();
  const { data, error } = await supabase.rpc('driver_sales_series');
  if (error) throw error;
  return data;
}
