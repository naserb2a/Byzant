create extension if not exists "pgcrypto";

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  key_hash text not null unique,
  key_prefix text not null,
  name text not null default 'Default Key',
  created_at timestamp with time zone not null default now(),
  last_used_at timestamp with time zone,
  is_active boolean not null default true
);

create index if not exists api_keys_user_id_idx
  on public.api_keys (user_id);

create index if not exists api_keys_active_hash_idx
  on public.api_keys (key_hash)
  where is_active = true;

alter table public.api_keys enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'api_keys'
      and policyname = 'Users can read their own API keys'
  ) then
    create policy "Users can read their own API keys"
      on public.api_keys
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

notify pgrst, 'reload schema';
