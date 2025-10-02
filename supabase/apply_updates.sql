-- LUXBYTE Database Updates
-- Apply all production-ready enhancements

-- 1. Create account_type enum if not exists
do $$
begin
  if not exists (select 1 from pg_type where typname = 'account_type') then
    create type account_type as enum ('pharmacy','supermarket','restaurant','clinic','courier','driver','admin');
  end if;
end $$;

-- 2. Create profiles table if not exists
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account account_type not null,
  city text,
  created_at timestamptz default now()
);

-- 3. Enable RLS on profiles
alter table public.profiles enable row level security;

-- 4. Create RLS policies for profiles
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

-- 5. Create account_audit table
create table if not exists public.account_audit (
  id bigserial primary key,
  user_id uuid not null,
  old_account account_type,
  new_account account_type not null,
  changed_by text not null,
  changed_at timestamptz default now(),
  ip_address inet,
  request_id text
);

-- 6. Create indexes for account_audit
create index if not exists idx_account_audit_user_id on public.account_audit(user_id);
create index if not exists idx_account_audit_changed_at on public.account_audit(changed_at);
create index if not exists idx_account_audit_changed_by on public.account_audit(changed_by);

-- 7. Enable RLS on account_audit
alter table public.account_audit enable row level security;

-- 8. Create audit policy
create policy if not exists "admin can view audit logs"
on public.account_audit for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where user_id = auth.uid()
    and account = 'admin'
  )
);

-- 9. Create audit logging function
create or replace function log_account_change()
returns trigger as $$
begin
  if NEW.account is distinct from OLD.account then
    insert into public.account_audit (
      user_id,
      old_account,
      new_account,
      changed_by,
      ip_address,
      request_id
    ) values (
      NEW.user_id,
      OLD.account,
      NEW.account,
      coalesce(
        current_setting('request.jwt.claim.sub', true),
        current_setting('request.jwt.claim.email', true),
        'system'
      ),
      inet_client_addr(),
      current_setting('request.id', true)
    );
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- 10. Create audit trigger
drop trigger if exists trg_log_account_change on public.profiles;
create trigger trg_log_account_change
  after update on public.profiles
  for each row
  execute function log_account_change();

-- 11. Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  read boolean default false,
  created_at timestamptz default now()
);

-- 12. Enable RLS on notifications
alter table public.notifications enable row level security;

-- 13. Create notification policies
create policy if not exists "users can view own notifications"
on public.notifications for select
to authenticated
using (auth.uid() = user_id);

create policy if not exists "users can update own notifications"
on public.notifications for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "system can insert notifications"
on public.notifications for insert
to authenticated
with check (true);

-- 14. Create notification indexes
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_created_at on public.notifications(created_at);
create index if not exists idx_notifications_read on public.notifications(read);

-- 15. Create storage buckets if not exist
insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', false),
  ('images', 'images', true),
  ('uploads', 'uploads', false)
on conflict (id) do nothing;

-- 16. Create storage policies
create policy if not exists "authenticated users can upload files"
on storage.objects for insert
to authenticated
with check (bucket_id in ('documents', 'images', 'uploads'));

create policy if not exists "users can view own files"
on storage.objects for select
to authenticated
using (auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "users can update own files"
on storage.objects for update
to authenticated
using (auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "users can delete own files"
on storage.objects for delete
to authenticated
using (auth.uid()::text = (storage.foldername(name))[1]);

-- Success message
select 'LUXBYTE database updates applied successfully!' as status;

