create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamp with time zone not null default now(),
  user_type text check (user_type in ('hosted', 'byo')),
  selected_model text,
  broker_connected boolean not null default false,
  alpaca_access_token text,
  alpaca_refresh_token text,
  onboarding_complete boolean not null default false
);

alter table public.users
  add column if not exists email text,
  add column if not exists created_at timestamp with time zone not null default now(),
  add column if not exists user_type text,
  add column if not exists selected_model text,
  add column if not exists broker_connected boolean not null default false,
  add column if not exists alpaca_access_token text,
  add column if not exists alpaca_refresh_token text,
  add column if not exists onboarding_complete boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_user_type_check'
      and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_user_type_check
      check (user_type in ('hosted', 'byo'));
  end if;
end $$;

alter table public.users enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'Users can read their own profile'
  ) then
    create policy "Users can read their own profile"
      on public.users
      for select
      to authenticated
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on public.users
      for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'Service role can manage users'
  ) then
    create policy "Service role can manage users"
      on public.users
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end $$;
