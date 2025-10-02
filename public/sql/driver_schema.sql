-- ===============================
-- driver_schema.sql — Complete Driver Database Schema
-- ===============================

-- Storage bucket for driver documents
select storage.create_bucket('driver_docs', public:=true);

-- Documents table
create table if not exists driver_documents (
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

-- Rides table
create table if not exists rides (
  id bigint generated always as identity primary key,
  customer_id bigint,
  customer_name text,
  phone text,
  pickup_address text not null,
  destination_address text not null,
  fare numeric not null default 0,
  status text not null default 'pending', -- pending/accepted/in-progress/completed/cancelled
  notes text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customers table
create table if not exists driver_customers (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  email text,
  address text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Vehicle table
create table if not exists vehicle (
  id bigint generated always as identity primary key,
  type text, -- sedan/suv/van
  make text,
  model_year int,
  color text,
  plate text,
  status text default 'excellent',
  owner uuid default auth.uid(),
  updated_at timestamptz default now()
);

-- Shifts table
create table if not exists driver_shifts (
  id bigint generated always as identity primary key,
  start_at timestamptz not null,
  end_at timestamptz,
  status text not null default 'open', -- open/closed
  total_hours numeric,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Locations table
create table if not exists driver_locations (
  id bigint generated always as identity primary key,
  latitude double precision not null,
  longitude double precision not null,
  at timestamptz not null default now(),
  owner uuid default auth.uid()
);

-- Sales table
create table if not exists driver_sales (
  id bigint generated always as identity primary key,
  ride_id bigint references rides(id) on delete set null,
  amount numeric not null default 0,
  commission numeric,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table driver_documents enable row level security;
alter table rides enable row level security;
alter table driver_customers enable row level security;
alter table vehicle enable row level security;
alter table driver_shifts enable row level security;
alter table driver_locations enable row level security;
alter table driver_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "driver docs by owner" on driver_documents for all using (owner = auth.uid());
create policy "rides by owner" on rides for all using (owner = auth.uid());
create policy "customers by owner" on driver_customers for all using (owner = auth.uid());
create policy "vehicle by owner" on vehicle for all using (owner = auth.uid());
create policy "shifts by owner" on driver_shifts for all using (owner = auth.uid());
create policy "locations by owner" on driver_locations for all using (owner = auth.uid());
create policy "sales by owner" on driver_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger rides_updated_at before update on rides for each row execute function set_updated_at();
create trigger customers_updated_at before update on driver_customers for each row execute function set_updated_at();
create trigger vehicle_updated_at before update on vehicle for each row execute function set_updated_at();

-- RPC: Close current shift
create or replace function driver_close_current_shift()
returns jsonb language plpgsql security definer as $$
declare
  r driver_shifts;
begin
  update driver_shifts
  set end_at = now(), status = 'closed', total_hours = extract(epoch from (now() - start_at))/3600
  where owner = auth.uid() and status = 'open'
  returning * into r;
  return to_jsonb(r);
end;
$$;

-- RPC: Driver KPIs for today
create or replace function driver_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 5;
  docs_done int;
  rides_today int;
  earnings_today numeric;
  active boolean := true;
begin
  select count(*) into docs_done from driver_documents where owner = auth.uid() and completed is true;
  select count(*) into rides_today from rides where owner = auth.uid() and created_at::date = current_date and status = 'completed';
  select coalesce(sum(amount),0) into earnings_today from driver_sales where owner = auth.uid() and created_at::date = current_date;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'rides_today', coalesce(rides_today,0),
    'earnings_today', coalesce(earnings_today,0),
    'active', active
  );
end;
$$;

-- RPC: Driver sales summary
create or replace function driver_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from driver_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Driver sales series
create or replace function driver_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join driver_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;
-- driver_schema.sql — Complete Driver Database Schema
-- ===============================

-- Storage bucket for driver documents
select storage.create_bucket('driver_docs', public:=true);

-- Documents table
create table if not exists driver_documents (
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

-- Rides table
create table if not exists rides (
  id bigint generated always as identity primary key,
  customer_id bigint,
  customer_name text,
  phone text,
  pickup_address text not null,
  destination_address text not null,
  fare numeric not null default 0,
  status text not null default 'pending', -- pending/accepted/in-progress/completed/cancelled
  notes text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customers table
create table if not exists driver_customers (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  email text,
  address text,
  owner uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Vehicle table
create table if not exists vehicle (
  id bigint generated always as identity primary key,
  type text, -- sedan/suv/van
  make text,
  model_year int,
  color text,
  plate text,
  status text default 'excellent',
  owner uuid default auth.uid(),
  updated_at timestamptz default now()
);

-- Shifts table
create table if not exists driver_shifts (
  id bigint generated always as identity primary key,
  start_at timestamptz not null,
  end_at timestamptz,
  status text not null default 'open', -- open/closed
  total_hours numeric,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Locations table
create table if not exists driver_locations (
  id bigint generated always as identity primary key,
  latitude double precision not null,
  longitude double precision not null,
  at timestamptz not null default now(),
  owner uuid default auth.uid()
);

-- Sales table
create table if not exists driver_sales (
  id bigint generated always as identity primary key,
  ride_id bigint references rides(id) on delete set null,
  amount numeric not null default 0,
  commission numeric,
  owner uuid default auth.uid(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table driver_documents enable row level security;
alter table rides enable row level security;
alter table driver_customers enable row level security;
alter table vehicle enable row level security;
alter table driver_shifts enable row level security;
alter table driver_locations enable row level security;
alter table driver_sales enable row level security;

-- RLS Policies (per-user isolation)
create policy "driver docs by owner" on driver_documents for all using (owner = auth.uid());
create policy "rides by owner" on rides for all using (owner = auth.uid());
create policy "customers by owner" on driver_customers for all using (owner = auth.uid());
create policy "vehicle by owner" on vehicle for all using (owner = auth.uid());
create policy "shifts by owner" on driver_shifts for all using (owner = auth.uid());
create policy "locations by owner" on driver_locations for all using (owner = auth.uid());
create policy "sales by owner" on driver_sales for all using (owner = auth.uid());

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger rides_updated_at before update on rides for each row execute function set_updated_at();
create trigger customers_updated_at before update on driver_customers for each row execute function set_updated_at();
create trigger vehicle_updated_at before update on vehicle for each row execute function set_updated_at();

-- RPC: Close current shift
create or replace function driver_close_current_shift()
returns jsonb language plpgsql security definer as $$
declare
  r driver_shifts;
begin
  update driver_shifts
  set end_at = now(), status = 'closed', total_hours = extract(epoch from (now() - start_at))/3600
  where owner = auth.uid() and status = 'open'
  returning * into r;
  return to_jsonb(r);
end;
$$;

-- RPC: Driver KPIs for today
create or replace function driver_kpis_today()
returns jsonb language plpgsql security definer as $$
declare
  docs_req int := 5;
  docs_done int;
  rides_today int;
  earnings_today numeric;
  active boolean := true;
begin
  select count(*) into docs_done from driver_documents where owner = auth.uid() and completed is true;
  select count(*) into rides_today from rides where owner = auth.uid() and created_at::date = current_date and status = 'completed';
  select coalesce(sum(amount),0) into earnings_today from driver_sales where owner = auth.uid() and created_at::date = current_date;

  return jsonb_build_object(
    'docs_required', docs_req,
    'docs_completed', coalesce(docs_done,0),
    'rides_today', coalesce(rides_today,0),
    'earnings_today', coalesce(earnings_today,0),
    'active', active
  );
end;
$$;

-- RPC: Driver sales summary
create or replace function driver_sales_summary()
returns jsonb language sql security definer as $$
with t as (
  select
    sum(case when created_at::date = current_date then amount else 0 end) as today,
    sum(case when created_at >= date_trunc('week', current_date) then amount else 0 end) as week,
    sum(case when created_at >= date_trunc('month', current_date) then amount else 0 end) as month
  from driver_sales where owner = auth.uid()
)
select jsonb_build_object(
  'today', coalesce(t.today,0),
  'week', coalesce(t.week,0),
  'month', coalesce(t.month,0)
) from t;
$$;

-- RPC: Driver sales series
create or replace function driver_sales_series()
returns table(date date, amount numeric) language sql security definer as $$
select d::date as date, coalesce(sum(s.amount),0) as amount
from generate_series(current_date - interval '14 days', current_date, interval '1 day') d
left join driver_sales s on s.owner = auth.uid() and s.created_at::date = d::date
group by 1 order by 1;
$$;
