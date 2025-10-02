-- ===============================
-- pharmacy_schema.sql — Complete Pharmacy Database Schema
-- ===============================

-- Storage bucket for pharmacy documents
select storage.create_bucket('pharmacy_docs', public:=true);

-- Documents table
create table if not exists pharmacy_documents (
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

-- Medicines table
create table if not exists medicines (
  id bigint generated always as identity primary key,
  name text not null,
  category text,
  stock_quantity int default 0,
  price numeric not null default 0,
  expiry_date date,
  description text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table if not exists pharmacy_orders (
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
  order_id bigint references pharmacy_orders(id) on delete cascade,
  medicine_id bigint references medicines(id) on delete set null,
  medicine_name text,
  quantity int not null default 1,
  price numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Customers table
create table if not exists pharmacy_customers (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  email text,
  address text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales table
create table if not exists pharmacy_sales (
  id bigint generated always as identity primary key,
  order_id bigint references pharmacy_orders(id) on delete set null,
  amount numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table pharmacy_documents enable row level security;
alter table medicines enable row level security;
alter table pharmacy_orders enable row level security;
alter table order_items enable row level security;
alter table pharmacy_customers enable row level security;
alter table pharmacy_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "pharmacy docs by owner" on pharmacy_documents for all using (owner = auth.uid());
create policy "medicines by owner" on medicines for all using (owner = auth.uid());
create policy "orders by owner" on pharmacy_orders for all using (owner = auth.uid());
create policy "order items by owner" on order_items for all using (owner = auth.uid());
create policy "customers by owner" on pharmacy_customers for all using (owner = auth.uid());
create policy "sales by owner" on pharmacy_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger medicines_updated_at before update on medicines for each row execute function set_updated_at();
create trigger orders_updated_at before update on pharmacy_orders for each row execute function set_updated_at();
create trigger customers_updated_at before update on pharmacy_customers for each row execute function set_updated_at();

-- RPC: Pharmacy KPIs for today
create or replace function pharmacy_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 5;
  docs_done int;
  orders_today int;
  revenue_today numeric;
  medicines_total int;
  medicines_low_stock int;
  active boolean := true;
begin
  select count(*) into docs_done from pharmacy_documents where owner = auth.uid() and completed is true;
  select count(*) into orders_today from pharmacy_orders where owner = auth.uid() and created_at::date = current_date and status = 'completed';
  select coalesce(sum(amount),0) into revenue_today from pharmacy_sales where owner = auth.uid() and created_at::date = current_date;
  select count(*) into medicines_total from medicines where owner = auth.uid();
  select count(*) into medicines_low_stock from medicines where owner = auth.uid() and stock_quantity <= 10;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'orders_today', coalesce(orders_today,0),
    'revenue_today', coalesce(revenue_today,0),
    'medicines_total', coalesce(medicines_total,0),
    'medicines_low_stock', coalesce(medicines_low_stock,0),
    'active', active
  );
end;
$$;

-- RPC: Pharmacy sales summary
create or replace function pharmacy_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from pharmacy_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Pharmacy sales series
create or replace function pharmacy_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join pharmacy_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;

-- RPC: Top medicines
create or replace function pharmacy_top_medicines(p_limit int default 10)
returns table(name text, total_sold bigint, revenue numeric) language sql security definer as $$
select
  oi.medicine_name as name,
  sum(oi.quantity) as total_sold,
  sum(oi.quantity * oi.price) as revenue
from order_items oi
join pharmacy_orders po on po.id = oi.order_id
where po.owner = auth.uid() and po.status = 'completed'
group by oi.medicine_name
order by total_sold desc
limit p_limit;
$$;
-- pharmacy_schema.sql — Complete Pharmacy Database Schema
-- ===============================

-- Storage bucket for pharmacy documents
select storage.create_bucket('pharmacy_docs', public:=true);

-- Documents table
create table if not exists pharmacy_documents (
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

-- Medicines table
create table if not exists medicines (
  id bigint generated always as identity primary key,
  name text not null,
  category text,
  stock_quantity int default 0,
  price numeric not null default 0,
  expiry_date date,
  description text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table if not exists pharmacy_orders (
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
  order_id bigint references pharmacy_orders(id) on delete cascade,
  medicine_id bigint references medicines(id) on delete set null,
  medicine_name text,
  quantity int not null default 1,
  price numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Customers table
create table if not exists pharmacy_customers (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  email text,
  address text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales table
create table if not exists pharmacy_sales (
  id bigint generated always as identity primary key,
  order_id bigint references pharmacy_orders(id) on delete set null,
  amount numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table pharmacy_documents enable row level security;
alter table medicines enable row level security;
alter table pharmacy_orders enable row level security;
alter table order_items enable row level security;
alter table pharmacy_customers enable row level security;
alter table pharmacy_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "pharmacy docs by owner" on pharmacy_documents for all using (owner = auth.uid());
create policy "medicines by owner" on medicines for all using (owner = auth.uid());
create policy "orders by owner" on pharmacy_orders for all using (owner = auth.uid());
create policy "order items by owner" on order_items for all using (owner = auth.uid());
create policy "customers by owner" on pharmacy_customers for all using (owner = auth.uid());
create policy "sales by owner" on pharmacy_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger medicines_updated_at before update on medicines for each row execute function set_updated_at();
create trigger orders_updated_at before update on pharmacy_orders for each row execute function set_updated_at();
create trigger customers_updated_at before update on pharmacy_customers for each row execute function set_updated_at();

-- RPC: Pharmacy KPIs for today
create or replace function pharmacy_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 5;
  docs_done int;
  orders_today int;
  revenue_today numeric;
  medicines_total int;
  medicines_low_stock int;
  active boolean := true;
begin
  select count(*) into docs_done from pharmacy_documents where owner = auth.uid() and completed is true;
  select count(*) into orders_today from pharmacy_orders where owner = auth.uid() and created_at::date = current_date and status = 'completed';
  select coalesce(sum(amount),0) into revenue_today from pharmacy_sales where owner = auth.uid() and created_at::date = current_date;
  select count(*) into medicines_total from medicines where owner = auth.uid();
  select count(*) into medicines_low_stock from medicines where owner = auth.uid() and stock_quantity <= 10;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'orders_today', coalesce(orders_today,0),
    'revenue_today', coalesce(revenue_today,0),
    'medicines_total', coalesce(medicines_total,0),
    'medicines_low_stock', coalesce(medicines_low_stock,0),
    'active', active
  );
end;
$$;

-- RPC: Pharmacy sales summary
create or replace function pharmacy_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from pharmacy_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Pharmacy sales series
create or replace function pharmacy_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join pharmacy_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;

-- RPC: Top medicines
create or replace function pharmacy_top_medicines(p_limit int default 10)
returns table(name text, total_sold bigint, revenue numeric) language sql security definer as $$
select
  oi.medicine_name as name,
  sum(oi.quantity) as total_sold,
  sum(oi.quantity * oi.price) as revenue
from order_items oi
join pharmacy_orders po on po.id = oi.order_id
where po.owner = auth.uid() and po.status = 'completed'
group by oi.medicine_name
order by total_sold desc
limit p_limit;
$$;
