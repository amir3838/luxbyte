-- ===============================
-- supermarket_schema.sql — Complete Supermarket Database Schema
-- ===============================

-- Storage bucket for supermarket documents
select storage.create_bucket('supermarket_docs', public:=true);

-- Documents table
create table if not exists supermarket_documents (
  id bigint generated always as identity primary key,
  kind text not null,
  display_name text,
  storage_path text not null,
  public_url text,
  mime text,
  required boolean default false,
  completed boolean default true,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Products table
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  category text,
  stock_quantity int default 0,
  price numeric not null default 0,
  expiry_date date,
  description text,
  barcode text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table if not exists supermarket_orders (
  id bigint generated always as identity primary key,
  customer_id bigint,
  customer_name text,
  phone text,
  delivery_address text,
  total_amount numeric not null default 0,
  status text not null default 'pending', -- pending/processing/ready/completed/cancelled
  notes text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references supermarket_orders(id) on delete cascade,
  product_id bigint references products(id) on delete set null,
  product_name text,
  quantity int not null default 1,
  price numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Customers table
create table if not exists supermarket_customers (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  email text,
  address text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Staff table
create table if not exists supermarket_staff (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null,
  phone text,
  email text,
  active boolean default true,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales table
create table if not exists supermarket_sales (
  id bigint generated always as identity primary key,
  order_id bigint references supermarket_orders(id) on delete set null,
  amount numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table supermarket_documents enable row level security;
alter table products enable row level security;
alter table supermarket_orders enable row level security;
alter table order_items enable row level security;
alter table supermarket_customers enable row level security;
alter table supermarket_staff enable row level security;
alter table supermarket_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "supermarket docs by owner" on supermarket_documents for all using (owner = auth.uid());
create policy "products by owner" on products for all using (owner = auth.uid());
create policy "orders by owner" on supermarket_orders for all using (owner = auth.uid());
create policy "order items by owner" on order_items for all using (owner = auth.uid());
create policy "customers by owner" on supermarket_customers for all using (owner = auth.uid());
create policy "staff by owner" on supermarket_staff for all using (owner = auth.uid());
create policy "sales by owner" on supermarket_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products for each row execute function set_updated_at();
create trigger orders_updated_at before update on supermarket_orders for each row execute function set_updated_at();
create trigger customers_updated_at before update on supermarket_customers for each row execute function set_updated_at();
create trigger staff_updated_at before update on supermarket_staff for each row execute function set_updated_at();

-- RPC: Supermarket KPIs for today
create or replace function supermarket_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 6;
  docs_done int;
  orders_today int;
  revenue_today numeric;
  products_total int;
  products_low_stock int;
  active boolean := true;
begin
  select count(*) into docs_done from supermarket_documents where owner = auth.uid() and completed is true;
  select count(*) into orders_today from supermarket_orders where owner = auth.uid() and created_at::date = current_date and status = 'completed';
  select coalesce(sum(amount),0) into revenue_today from supermarket_sales where owner = auth.uid() and created_at::date = current_date;
  select count(*) into products_total from products where owner = auth.uid();
  select count(*) into products_low_stock from products where owner = auth.uid() and stock_quantity <= 10;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'orders_today', coalesce(orders_today,0),
    'revenue_today', coalesce(revenue_today,0),
    'products_total', coalesce(products_total,0),
    'products_low_stock', coalesce(products_low_stock,0),
    'active', active
  );
end;
$$;

-- RPC: Supermarket sales summary
create or replace function supermarket_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from supermarket_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Supermarket sales series
create or replace function supermarket_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join supermarket_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;

-- RPC: Top products
create or replace function supermarket_top_products(p_limit int default 10)
returns table(name text, total_sold bigint, revenue numeric) language sql security definer as $$
select
  oi.product_name as name,
  sum(oi.quantity) as total_sold,
  sum(oi.quantity * oi.price) as revenue
from order_items oi
join supermarket_orders so on so.id = oi.order_id
where so.owner = auth.uid() and so.status = 'completed'
group by oi.product_name
order by total_sold desc
limit p_limit;
$$;
-- supermarket_schema.sql — Complete Supermarket Database Schema
-- ===============================

-- Storage bucket for supermarket documents
select storage.create_bucket('supermarket_docs', public:=true);

-- Documents table
create table if not exists supermarket_documents (
  id bigint generated always as identity primary key,
  kind text not null,
  display_name text,
  storage_path text not null,
  public_url text,
  mime text,
  required boolean default false,
  completed boolean default true,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Products table
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  category text,
  stock_quantity int default 0,
  price numeric not null default 0,
  expiry_date date,
  description text,
  barcode text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table if not exists supermarket_orders (
  id bigint generated always as identity primary key,
  customer_id bigint,
  customer_name text,
  phone text,
  delivery_address text,
  total_amount numeric not null default 0,
  status text not null default 'pending', -- pending/processing/ready/completed/cancelled
  notes text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references supermarket_orders(id) on delete cascade,
  product_id bigint references products(id) on delete set null,
  product_name text,
  quantity int not null default 1,
  price numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Customers table
create table if not exists supermarket_customers (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  email text,
  address text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Staff table
create table if not exists supermarket_staff (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null,
  phone text,
  email text,
  active boolean default true,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales table
create table if not exists supermarket_sales (
  id bigint generated always as identity primary key,
  order_id bigint references supermarket_orders(id) on delete set null,
  amount numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table supermarket_documents enable row level security;
alter table products enable row level security;
alter table supermarket_orders enable row level security;
alter table order_items enable row level security;
alter table supermarket_customers enable row level security;
alter table supermarket_staff enable row level security;
alter table supermarket_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "supermarket docs by owner" on supermarket_documents for all using (owner = auth.uid());
create policy "products by owner" on products for all using (owner = auth.uid());
create policy "orders by owner" on supermarket_orders for all using (owner = auth.uid());
create policy "order items by owner" on order_items for all using (owner = auth.uid());
create policy "customers by owner" on supermarket_customers for all using (owner = auth.uid());
create policy "staff by owner" on supermarket_staff for all using (owner = auth.uid());
create policy "sales by owner" on supermarket_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products for each row execute function set_updated_at();
create trigger orders_updated_at before update on supermarket_orders for each row execute function set_updated_at();
create trigger customers_updated_at before update on supermarket_customers for each row execute function set_updated_at();
create trigger staff_updated_at before update on supermarket_staff for each row execute function set_updated_at();

-- RPC: Supermarket KPIs for today
create or replace function supermarket_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 6;
  docs_done int;
  orders_today int;
  revenue_today numeric;
  products_total int;
  products_low_stock int;
  active boolean := true;
begin
  select count(*) into docs_done from supermarket_documents where owner = auth.uid() and completed is true;
  select count(*) into orders_today from supermarket_orders where owner = auth.uid() and created_at::date = current_date and status = 'completed';
  select coalesce(sum(amount),0) into revenue_today from supermarket_sales where owner = auth.uid() and created_at::date = current_date;
  select count(*) into products_total from products where owner = auth.uid();
  select count(*) into products_low_stock from products where owner = auth.uid() and stock_quantity <= 10;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'orders_today', coalesce(orders_today,0),
    'revenue_today', coalesce(revenue_today,0),
    'products_total', coalesce(products_total,0),
    'products_low_stock', coalesce(products_low_stock,0),
    'active', active
  );
end;
$$;

-- RPC: Supermarket sales summary
create or replace function supermarket_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from supermarket_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Supermarket sales series
create or replace function supermarket_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join supermarket_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;

-- RPC: Top products
create or replace function supermarket_top_products(p_limit int default 10)
returns table(name text, total_sold bigint, revenue numeric) language sql security definer as $$
select
  oi.product_name as name,
  sum(oi.quantity) as total_sold,
  sum(oi.quantity * oi.price) as revenue
from order_items oi
join supermarket_orders so on so.id = oi.order_id
where so.owner = auth.uid() and so.status = 'completed'
group by oi.product_name
order by total_sold desc
limit p_limit;
$$;
