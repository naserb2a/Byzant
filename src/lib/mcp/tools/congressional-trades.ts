import { createServiceRoleClient } from "@/lib/supabase/service-role";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

type CongressionalTradesParams = {
  politician?: unknown;
  party?: unknown;
  ticker?: unknown;
  limit?: unknown;
};

type CongressionalTradeRow = {
  politician_name: string;
  party: string | null;
  ticker: string;
  trade_type: string;
  amount_range: string | null;
  disclosure_date: string | null;
};

export type CongressionalTradeRecord = {
  politician: string;
  party: string | null;
  ticker: string;
  transaction_type: string;
  amount: string | null;
  disclosure_date: string | null;
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

function parseOptionalString(value: unknown, name: string): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${name} must be a string`);
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseParty(value: unknown): "Democrat" | "Republican" | null {
  const party = parseOptionalString(value, "party");
  if (!party) {
    return null;
  }

  if (party !== "Democrat" && party !== "Republican") {
    throw new Error('party must be "Democrat" or "Republican"');
  }

  return party;
}

export async function getCongressionalTrades(
  params: CongressionalTradesParams = {}
): Promise<CongressionalTradeRecord[]> {
  const limit = parseLimit(params.limit);
  const politician = parseOptionalString(params.politician, "politician");
  const party = parseParty(params.party);
  const ticker = parseOptionalString(params.ticker, "ticker")?.toUpperCase();

  const supabase = createServiceRoleClient();
  let query = supabase
    .from("congressional_trades")
    .select(
      "politician_name,party,ticker,trade_type,amount_range,disclosure_date"
    )
    .order("disclosure_date", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (politician) {
    query = query.ilike("politician_name", `%${politician}%`);
  }

  if (party) {
    query = query.eq("party", party);
  }

  if (ticker) {
    query = query.eq("ticker", ticker);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to fetch congressional trade records");
  }

  return ((data ?? []) as CongressionalTradeRow[]).map((row) => ({
    politician: row.politician_name,
    party: row.party,
    ticker: row.ticker,
    transaction_type: row.trade_type,
    amount: row.amount_range,
    disclosure_date: row.disclosure_date,
  }));
}
