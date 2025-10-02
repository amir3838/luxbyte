// ===============================
// supermarket/api/supermarket.js — All data I/O with Supabase (DB + Storage)
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'supermarket_docs';

// ---- Documents
export async function uploadDocument({ file, kind }) {
  const user = await requireAuth();
  const ext = file.name.split('.').pop();
  const path = `${user.id}/${Date.now()}_${kind}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await supabase
    .from('supermarket_documents')
    .insert({ kind, storage_path: path, public_url: pub?.publicUrl || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listDocuments() {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ---- Products
export async function listProducts({ search, category, low_stock = false } = {}) {
  await requireAuth();
  let q = supabase.from('products').select('*').order('name');
  if (search) q = q.ilike('name', `%${search}%`);
  if (category) q = q.eq('category', category);
  if (low_stock) q = q.lte('stock_quantity', 10);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function upsertProduct(row) {
  await requireAuth();
  const { data, error } = await supabase.from('products').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  await requireAuth();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ---- Orders
export async function listOrders({ status = 'all' } = {}) {
  await requireAuth();
  let q = supabase.from('supermarket_orders').select('*, customer:supermarket_customers(*)').order('created_at', { ascending: false }).limit(100);
  if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_orders').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ---- Customers
export async function listCustomers() {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_customers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertCustomer(row) {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_customers').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

// ---- KPIs
export async function getKpis() {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_kpis_today');
  if (error) throw error;
  return data;
}

// ---- Reports
export async function getSalesSummary() {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_sales_summary');
  if (error) throw error;
  return data;
}

export async function getSalesSeries() {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_sales_series');
  if (error) throw error;
  return data;
}

export async function getTopProducts(limit = 10) {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_top_products', { p_limit: limit });
  if (error) throw error;
  return data;
}
// supermarket/api/supermarket.js — All data I/O with Supabase (DB + Storage)
// ===============================
import { supabase, requireAuth } from '../../supabase-client.js';

const BUCKET = 'supermarket_docs';

// ---- Documents
export async function uploadDocument({ file, kind }) {
  const user = await requireAuth();
  const ext = file.name.split('.').pop();
  const path = `${user.id}/${Date.now()}_${kind}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const { data, error } = await supabase
    .from('supermarket_documents')
    .insert({ kind, storage_path: path, public_url: pub?.publicUrl || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listDocuments() {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_documents').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ---- Products
export async function listProducts({ search, category, low_stock = false } = {}) {
  await requireAuth();
  let q = supabase.from('products').select('*').order('name');
  if (search) q = q.ilike('name', `%${search}%`);
  if (category) q = q.eq('category', category);
  if (low_stock) q = q.lte('stock_quantity', 10);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function upsertProduct(row) {
  await requireAuth();
  const { data, error } = await supabase.from('products').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  await requireAuth();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ---- Orders
export async function listOrders({ status = 'all' } = {}) {
  await requireAuth();
  let q = supabase.from('supermarket_orders').select('*, customer:supermarket_customers(*)').order('created_at', { ascending: false }).limit(100);
  if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_orders').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ---- Customers
export async function listCustomers() {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_customers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertCustomer(row) {
  await requireAuth();
  const { data, error } = await supabase.from('supermarket_customers').upsert(row, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data;
}

// ---- KPIs
export async function getKpis() {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_kpis_today');
  if (error) throw error;
  return data;
}

// ---- Reports
export async function getSalesSummary() {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_sales_summary');
  if (error) throw error;
  return data;
}

export async function getSalesSeries() {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_sales_series');
  if (error) throw error;
  return data;
}

export async function getTopProducts(limit = 10) {
  await requireAuth();
  const { data, error } = await supabase.rpc('supermarket_top_products', { p_limit: limit });
  if (error) throw error;
  return data;
}
