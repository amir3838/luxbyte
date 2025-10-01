# Cursor Prompt: Apply RLS + Storage policies safely

## Title
Apply RLS + Storage policies safely

## Scope (allowlist)
- `supabase/rls_policies_final.sql`
- `supabase/test_rls.sql`
- `SECURITY_SETUP.md`
- `README.md`

## Do not change
- versions
- frontend code
- auth flows
- build configs
- package.json
- vercel.json
- any .js files in js/ directory
- any .html files

## Tasks

1. **Update `supabase/rls_policies_final.sql`** with the following SQL for tables `documents`, `profiles`, `business_requests` and Storage `kyc_docs`:

```sql
-- Enable RLS
alter table {table_name} enable row level security;

-- Users can only read their own data
drop policy if exists sel_own on {table_name};
create policy sel_own on {table_name}
for select to authenticated
using (user_id = auth.uid());

-- Users can only insert their own data
drop policy if exists ins_own on {table_name};
create policy ins_own on {table_name}
for insert to authenticated
with check (user_id = auth.uid());

-- Users can only update their own data
drop policy if exists upd_own on {table_name};
create policy upd_own on {table_name}
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Users can only delete their own data
drop policy if exists del_own on {table_name};
create policy del_own on {table_name}
for delete to authenticated
using (user_id = auth.uid());
```

2. **Add Storage policies for `kyc_docs` bucket**:

```sql
-- Users can only upload to their own folder
create policy ins_user_folder on storage.objects
for insert to authenticated
with check (bucket_id = 'kyc_docs' and name like auth.uid()::text || '/%');

-- Users can only update their own files
create policy upd_user_folder on storage.objects
for update to authenticated
using (bucket_id = 'kyc_docs' and name like auth.uid()::text || '/%')
with check (bucket_id = 'kyc_docs' and name like auth.uid()::text || '/%');

-- Users can only delete their own files
create policy del_user_folder on storage.objects
for delete to authenticated
using (bucket_id = 'kyc_docs' and name like auth.uid()::text || '/%');

-- Users can only view their own files
create policy sel_user_folder on storage.objects
for select to authenticated
using (bucket_id = 'kyc_docs' and name like auth.uid()::text || '/%');
```

3. **Add admin function and policies**:

```sql
-- Admin function
create or replace function is_admin() returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and account = 'admin'
  );
$$;

-- Admin can access all data
create policy admin_full on {table_name}
for all to authenticated
using (is_admin()) with check (is_admin());
```

4. **Add "Security & RLS" section to `README.md`** with:
   - Steps to apply RLS policies
   - Testing instructions using "Run as" in Supabase
   - Security verification commands

5. **Create `supabase/test_rls.sql`** with:
   - Test queries for RLS verification
   - Manual testing instructions
   - Verification queries for policies

## Output
- Small patch with SQL files only
- Commands to run tests
- No changes to frontend code

## Important Notes
- Only modify files in allowlist
- Do not change any frontend code
- Focus on security policies only
- Include comprehensive testing instructions
