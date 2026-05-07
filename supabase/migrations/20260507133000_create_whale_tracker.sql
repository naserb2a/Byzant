create extension if not exists "pgcrypto";

create table if not exists public.whale_tracker (
  id uuid primary key default gen_random_uuid(),
  ticker text not null,
  contract_type text not null,
  strike numeric,
  expiry date,
  volume integer,
  open_interest integer,
  premium numeric,
  sentiment text not null default 'neutral' check (sentiment in ('bullish', 'bearish', 'neutral')),
  source text,
  fetched_at timestamp with time zone not null default now(),
  raw_data jsonb not null
);

create unique index if not exists whale_tracker_dedupe_idx
  on public.whale_tracker (
    ticker,
    contract_type,
    strike,
    expiry,
    volume,
    open_interest,
    premium,
    source,
    fetched_at
  );

create index if not exists whale_tracker_fetched_at_idx
  on public.whale_tracker (fetched_at desc);

create index if not exists whale_tracker_ticker_idx
  on public.whale_tracker (ticker);

create index if not exists whale_tracker_sentiment_idx
  on public.whale_tracker (sentiment);

alter table public.whale_tracker enable row level security;

create policy "Authenticated users can read whale tracker records"
  on public.whale_tracker
  for select
  to authenticated
  using (true);
