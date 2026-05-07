create extension if not exists "pgcrypto";

create table if not exists public.congressional_trades (
  id uuid primary key default gen_random_uuid(),
  politician_name text not null,
  party text,
  state text,
  ticker text not null,
  trade_type text not null check (trade_type in ('buy', 'sell')),
  amount_range text,
  trade_date date,
  disclosure_date date,
  fetched_at timestamp with time zone not null default now(),
  raw_data jsonb not null
);

create unique index if not exists congressional_trades_dedupe_idx
  on public.congressional_trades (
    politician_name,
    ticker,
    trade_type,
    amount_range,
    trade_date,
    disclosure_date
  );

create index if not exists congressional_trades_trade_date_idx
  on public.congressional_trades (trade_date desc);

create index if not exists congressional_trades_ticker_idx
  on public.congressional_trades (ticker);

create index if not exists congressional_trades_party_idx
  on public.congressional_trades (party);

create index if not exists congressional_trades_politician_name_idx
  on public.congressional_trades (politician_name);

alter table public.congressional_trades enable row level security;

create policy "Authenticated users can read congressional trade records"
  on public.congressional_trades
  for select
  to authenticated
  using (true);
