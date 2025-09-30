-- enum لنوع الحساب
do $$
begin
  if not exists (select 1 from pg_type where typname = 'account_type') then
    create type account_type as enum ('pharmacy','supermarket','restaurant','clinic','courier','driver','admin');
  end if;
end $$;

-- جدول الملف الشخصي
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account account_type not null,
  city text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- سياسات RLS
do $$
begin
  if not exists (select 1 from pg_policies where policyname='insert own profile once' and tablename='profiles') then
    create policy "insert own profile once"
    on public.profiles for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname='select own profile' and tablename='profiles') then
    create policy "select own profile"
    on public.profiles for select
    to authenticated
    using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname='update own profile (no account change)' and tablename='profiles') then
    create policy "update own profile (no account change)"
    on public.profiles for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id and old.account = new.account);
  end if;
end $$;
