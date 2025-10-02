// ===============================
// restaurant/api/restaurant.js — All data I/O with Supabase (DB + Storage)
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'restaurant_docs';

// ---- Documents
export async function uploadDocument({ file, kind }) {
  const user = await requireAuth();
  const ext = file.name.split('.').pop();
  const path = `${user.id}/${Date.now()}_${kind}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await supabase
    .from('restaurant_documents')
    .insert({ kind, storage_path: path, public_url: pub?.publicUrl || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listDocuments() {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ---- Menu Items
export async function listMenuItems({ search, category } = {}) {
  await requireAuth();
  let q = supabase.from('menu_items').select('*').order('name');
  if (search) q = q.ilike('name', `%${search}%`);
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function upsertMenuItem(row) {
  await requireAuth();
  const { data, error } = await supabase.from('menu_items').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id) {
  await requireAuth();
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ---- Orders
export async function listOrders({ status = 'all' } = {}) {
  await requireAuth();
  let q = supabase.from('restaurant_orders').select('*, customer:restaurant_customers(*)').order('created_at', { ascending: false }).limit(100);
  if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_orders').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ---- Customers
export async function listCustomers() {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_customers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertCustomer(row) {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_customers').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

// ---- KPIs
export async function getKpis() {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_kpis_today');
  if (error) throw error;
  return data;
}

// ---- Reports
export async function getSalesSummary() {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_sales_summary');
  if (error) throw error;
  return data;
}

export async function getSalesSeries() {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_sales_series');
  if (error) throw error;
  return data;
}

export async function getTopDishes(limit = 10) {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_top_dishes', { p_limit: limit });
  if (error) throw error;
  return data;
}
// restaurant/api/restaurant.js — All data I/O with Supabase (DB + Storage)
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'restaurant_docs';

// ---- Documents
export async function uploadDocument({ file, kind }) {
  const user = await requireAuth();
  const ext = file.name.split('.').pop();
  const path = `${user.id}/${Date.now()}_${kind}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await supabase
    .from('restaurant_documents')
    .insert({ kind, storage_path: path, public_url: pub?.publicUrl || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listDocuments() {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ---- Menu Items
export async function listMenuItems({ search, category } = {}) {
  await requireAuth();
  let q = supabase.from('menu_items').select('*').order('name');
  if (search) q = q.ilike('name', `%${search}%`);
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function upsertMenuItem(row) {
  await requireAuth();
  const { data, error } = await supabase.from('menu_items').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id) {
  await requireAuth();
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ---- Orders
export async function listOrders({ status = 'all' } = {}) {
  await requireAuth();
  let q = supabase.from('restaurant_orders').select('*, customer:restaurant_customers(*)').order('created_at', { ascending: false }).limit(100);
  if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_orders').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ---- Customers
export async function listCustomers() {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_customers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertCustomer(row) {
  await requireAuth();
  const { data, error } = await supabase.from('restaurant_customers').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

// ---- KPIs
export async function getKpis() {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_kpis_today');
  if (error) throw error;
  return data;
}

// ---- Reports
export async function getSalesSummary() {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_sales_summary');
  if (error) throw error;
  return data;
}

export async function getSalesSeries() {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_sales_series');
  if (error) throw error;
  return data;
}

export async function getTopDishes(limit = 10) {
  await requireAuth();
  const { data, error } = await supabase.rpc('restaurant_top_dishes', { p_limit: limit });
  if (error) throw error;
  return data;
}
