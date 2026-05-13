import { createServiceRoleClient } from "@/lib/supabase/service-role";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

type WhaleFlowParams = {
  ticker?: unknown;
  sentiment?: unknown;
  limit?: unknown;
};

type WhaleRawData = {
  impliedVolatility?: unknown;
  implied_volatility?: unknown;
  tradeTime?: unknown;
  trade_time?: unknown;
  timestamp?: unknown;
};

type WhaleTrackerRow = {
  ticker: string;
  contract_type: string;
  strike: number | null;
  expiry: string | null;
  volume: number | null;
  open_interest: number | null;
  premium: number | null;
  sentiment: string;
  fetched_at: string;
  raw_data: WhaleRawData | null;
};

export type WhaleFlowRecord = {
  ticker: string;
  contract_type: string;
  strike: number | null;
  expiry: string | null;
  volume: number | null;
  open_interest: number | null;
  premium: number | null;
  implied_volatility: number | null;
  sentiment: string;
  trade_time: string | null;
};

function parseLimit(value: unknown): number {
  if (value === undefined || value === null) {
    return DEFAULT_LIMIT;
  }

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error("limit must be an integer");
  }

  if (value < 1) {
    throw new Error("limit must be at least 1");
  }

  return Math.min(value, MAX_LIMIT);
}

function parseTicker(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("ticker must be a string");
  }

  return value.trim().toUpperCase();
}

function parseSentiment(value: unknown): "bullish" | "bearish" | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (value !== "bullish" && value !== "bearish") {
    throw new Error('sentiment must be "bullish" or "bearish"');
  }

  return value;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = Number(value.replace(/[$,%+,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getImpliedVolatility(rawData: WhaleRawData | null): number | null {
  if (!rawData) {
    return null;
  }

  return parseNumber(rawData.impliedVolatility ?? rawData.implied_volatility);
}

function getTradeTime(row: WhaleTrackerRow): string | null {
  const rawData = row.raw_data;
  if (!rawData) {
    return row.fetched_at ?? null;
  }

  return (
    parseString(rawData.tradeTime) ??
    parseString(rawData.trade_time) ??
    parseString(rawData.timestamp) ??
    row.fetched_at ??
    null
  );
}

export async function getWhaleFlow(
  params: WhaleFlowParams = {}
): Promise<WhaleFlowRecord[]> {
  const limit = parseLimit(params.limit);
  const ticker = parseTicker(params.ticker);
  const sentiment = parseSentiment(params.sentiment);

  const supabase = createServiceRoleClient();
  let query = supabase
    .from("whale_tracker")
    .select(
      "ticker,contract_type,strike,expiry,volume,open_interest,premium,sentiment,fetched_at,raw_data"
    )
    .order("premium", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (ticker) {
    query = query.eq("ticker", ticker);
  }

  if (sentiment) {
    query = query.eq("sentiment", sentiment);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to fetch whale flow records");
  }

  return ((data ?? []) as WhaleTrackerRow[]).map((row) => ({
    ticker: row.ticker,
    contract_type: row.contract_type,
    strike: row.strike,
    expiry: row.expiry,
    volume: row.volume,
    open_interest: row.open_interest,
    premium: row.premium,
    implied_volatility: getImpliedVolatility(row.raw_data),
    sentiment: row.sentiment,
    trade_time: getTradeTime(row),
  }));
}
