-- ===============================
-- restaurant_schema.sql — Complete Restaurant Database Schema
-- ===============================

-- Storage bucket for restaurant documents
select storage.create_bucket('restaurant_docs', public:=true);

-- Documents table
create table if not exists restaurant_documents (
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

-- Menu items table
create table if not exists menu_items (
  id bigint generated always as identity primary key,
  name text not null,
  category text,
  price numeric not null default 0,
  description text,
  available boolean default true,
  image_url text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table if not exists restaurant_orders (
  id bigint generated always as identity primary key,
  customer_id bigint,
  customer_name text,
  phone text,
  delivery_address text,
  total_amount numeric not null default 0,
  status text not null default 'pending', -- pending/confirmed/preparing/ready/delivered/cancelled
  notes text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references restaurant_orders(id) on delete cascade,
  menu_item_id bigint references menu_items(id) on delete set null,
  item_name text,
  quantity int not null default 1,
  price numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Customers table
create table if not exists restaurant_customers (
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
create table if not exists restaurant_staff (
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
create table if not exists restaurant_sales (
  id bigint generated always as identity primary key,
  order_id bigint references restaurant_orders(id) on delete set null,
  amount numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table restaurant_documents enable row level security;
alter table menu_items enable row level security;
alter table restaurant_orders enable row level security;
alter table order_items enable row level security;
alter table restaurant_customers enable row level security;
alter table restaurant_staff enable row level security;
alter table restaurant_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "restaurant docs by owner" on restaurant_documents for all using (owner = auth.uid());
create policy "menu items by owner" on menu_items for all using (owner = auth.uid());
create policy "orders by owner" on restaurant_orders for all using (owner = auth.uid());
create policy "order items by owner" on order_items for all using (owner = auth.uid());
create policy "customers by owner" on restaurant_customers for all using (owner = auth.uid());
create policy "staff by owner" on restaurant_staff for all using (owner = auth.uid());
create policy "sales by owner" on restaurant_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger menu_items_updated_at before update on menu_items for each row execute function set_updated_at();
create trigger orders_updated_at before update on restaurant_orders for each row execute function set_updated_at();
create trigger customers_updated_at before update on restaurant_customers for each row execute function set_updated_at();
create trigger staff_updated_at before update on restaurant_staff for each row execute function set_updated_at();

-- RPC: Restaurant KPIs for today
create or replace function restaurant_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 6;
  docs_done int;
  orders_today int;
  revenue_today numeric;
  active boolean := true;
begin
  select count(*) into docs_done from restaurant_documents where owner = auth.uid() and completed is true;
  select count(*) into orders_today from restaurant_orders where owner = auth.uid() and created_at::date = current_date and status = 'delivered';
  select coalesce(sum(amount),0) into revenue_today from restaurant_sales where owner = auth.uid() and created_at::date = current_date;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'orders_today', coalesce(orders_today,0),
    'revenue_today', coalesce(revenue_today,0),
    'active', active
  );
end;
$$;

-- RPC: Restaurant sales summary
create or replace function restaurant_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from restaurant_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Restaurant sales series
create or replace function restaurant_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join restaurant_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;

-- RPC: Top dishes
create or replace function restaurant_top_dishes(p_limit int default 10)
returns table(name text, total_ordered bigint, revenue numeric) language sql security definer as $$
select
  oi.item_name as name,
  sum(oi.quantity) as total_ordered,
  sum(oi.quantity * oi.price) as revenue
from order_items oi
join restaurant_orders ro on ro.id = oi.order_id
where ro.owner = auth.uid() and ro.status = 'delivered'
group by oi.item_name
order by total_ordered desc
limit p_limit;
$$;
-- restaurant_schema.sql — Complete Restaurant Database Schema
-- ===============================

-- Storage bucket for restaurant documents
select storage.create_bucket('restaurant_docs', public:=true);

-- Documents table
create table if not exists restaurant_documents (
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

-- Menu items table
create table if not exists menu_items (
  id bigint generated always as identity primary key,
  name text not null,
  category text,
  price numeric not null default 0,
  description text,
  available boolean default true,
  image_url text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table if not exists restaurant_orders (
  id bigint generated always as identity primary key,
  customer_id bigint,
  customer_name text,
  phone text,
  delivery_address text,
  total_amount numeric not null default 0,
  status text not null default 'pending', -- pending/confirmed/preparing/ready/delivered/cancelled
  notes text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references restaurant_orders(id) on delete cascade,
  menu_item_id bigint references menu_items(id) on delete set null,
  item_name text,
  quantity int not null default 1,
  price numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Customers table
create table if not exists restaurant_customers (
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
create table if not exists restaurant_staff (
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
create table if not exists restaurant_sales (
  id bigint generated always as identity primary key,
  order_id bigint references restaurant_orders(id) on delete set null,
  amount numeric not null default 0,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table restaurant_documents enable row level security;
alter table menu_items enable row level security;
alter table restaurant_orders enable row level security;
alter table order_items enable row level security;
alter table restaurant_customers enable row level security;
alter table restaurant_staff enable row level security;
alter table restaurant_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "restaurant docs by owner" on restaurant_documents for all using (owner = auth.uid());
create policy "menu items by owner" on menu_items for all using (owner = auth.uid());
create policy "orders by owner" on restaurant_orders for all using (owner = auth.uid());
create policy "order items by owner" on order_items for all using (owner = auth.uid());
create policy "customers by owner" on restaurant_customers for all using (owner = auth.uid());
create policy "staff by owner" on restaurant_staff for all using (owner = auth.uid());
create policy "sales by owner" on restaurant_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger menu_items_updated_at before update on menu_items for each row execute function set_updated_at();
create trigger orders_updated_at before update on restaurant_orders for each row execute function set_updated_at();
create trigger customers_updated_at before update on restaurant_customers for each row execute function set_updated_at();
create trigger staff_updated_at before update on restaurant_staff for each row execute function set_updated_at();

-- RPC: Restaurant KPIs for today
create or replace function restaurant_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 6;
  docs_done int;
  orders_today int;
  revenue_today numeric;
  active boolean := true;
begin
  select count(*) into docs_done from restaurant_documents where owner = auth.uid() and completed is true;
  select count(*) into orders_today from restaurant_orders where owner = auth.uid() and created_at::date = current_date and status = 'delivered';
  select coalesce(sum(amount),0) into revenue_today from restaurant_sales where owner = auth.uid() and created_at::date = current_date;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'orders_today', coalesce(orders_today,0),
    'revenue_today', coalesce(revenue_today,0),
    'active', active
  );
end;
$$;

-- RPC: Restaurant sales summary
create or replace function restaurant_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from restaurant_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Restaurant sales series
create or replace function restaurant_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join restaurant_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;

-- RPC: Top dishes
create or replace function restaurant_top_dishes(p_limit int default 10)
returns table(name text, total_ordered bigint, revenue numeric) language sql security definer as $$
select
  oi.item_name as name,
  sum(oi.quantity) as total_ordered,
  sum(oi.quantity * oi.price) as revenue
from order_items oi
join restaurant_orders ro on ro.id = oi.order_id
where ro.owner = auth.uid() and ro.status = 'delivered'
group by oi.item_name
order by total_ordered desc
limit p_limit;
$$;
