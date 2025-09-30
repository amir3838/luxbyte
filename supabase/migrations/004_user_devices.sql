-- Create user_devices table for FCM tokens
create table if not exists public.user_devices (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  fcm_token text unique not null,
  platform text not null default 'web',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_devices enable row level security;

-- Create policy for users to manage their own devices
create policy "users manage their devices"
on public.user_devices
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Create index for better performance
create index if not exists idx_user_devices_user_id on public.user_devices(user_id);
create index if not exists idx_user_devices_fcm_token on public.user_devices(fcm_token);
