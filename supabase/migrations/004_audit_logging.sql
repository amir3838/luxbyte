-- Audit logging for account changes
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

-- Index for better performance
create index if not exists idx_account_audit_user_id on public.account_audit(user_id);
create index if not exists idx_account_audit_changed_at on public.account_audit(changed_at);
create index if not exists idx_account_audit_changed_by on public.account_audit(changed_by);

-- Enable RLS
alter table public.account_audit enable row level security;

-- Policy: Only admins can view audit logs
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

-- Function to log account changes
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

-- Drop existing trigger if exists
drop trigger if exists trg_log_account_change on public.profiles;

-- Create trigger
create trigger trg_log_account_change
  after update on public.profiles
  for each row
  execute function log_account_change();

-- Notifications table for user notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policy: Users can only see their own notifications
create policy if not exists "users can view own notifications"
on public.notifications for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
create policy if not exists "users can update own notifications"
on public.notifications for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policy: System can insert notifications
create policy if not exists "system can insert notifications"
on public.notifications for insert
to authenticated
with check (true);

-- Index for better performance
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_created_at on public.notifications(created_at);
create index if not exists idx_notifications_read on public.notifications(read);
