import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type Sentiment = "bullish" | "bearish" | "neutral";

type WhaleTrackerRecord = {
  ticker: string;
  contract_type: string;
  strike: number | null;
  expiry: string | null;
  volume: number | null;
  open_interest: number | null;
  premium: number | null;
  sentiment: Sentiment;
  source: string;
  fetched_at: string;
  raw_data: Record<string, unknown>;
};

const WEBHOOK_SECRET_HEADER = "x-apify-webhook-secret";

function getStringValue(
  item: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return null;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[$,%+,]/g, "").trim();
  if (!normalized) {
    return null;
  }

  const lower = normalized.toLowerCase();
  const multiplier = lower.endsWith("m") ? 1_000_000 : lower.endsWith("k") ? 1_000 : 1;
  const numericText =
    multiplier === 1 ? normalized : normalized.slice(0, -1).trim();
  const parsed = Number(numericText);

  return Number.isFinite(parsed) ? parsed * multiplier : null;
}

function parseDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function parseTimestamp(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

function normalizeContractType(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("call")) {
    return "call";
  }
  if (normalized.includes("put")) {
    return "put";
  }

  return value;
}

function normalizeSentiment(value: string | null): Sentiment {
  if (!value) {
    return "neutral";
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("bull") || normalized.includes("call")) {
    return "bullish";
  }
  if (normalized.includes("bear") || normalized.includes("put")) {
    return "bearish";
  }

  return "neutral";
}

function extractItems(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object" && !Array.isArray(item)
    );
  }

  if (payload === null || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as Record<string, unknown>;
  const candidateKeys = ["items", "data", "results", "datasetItems"];

  for (const key of candidateKeys) {
    const value = objectPayload[key];
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object" && !Array.isArray(item)
      );
    }
  }

  return [objectPayload];
}

function normalizeWhaleRecord(
  item: Record<string, unknown>
): WhaleTrackerRecord | null {
  const ticker = getStringValue(item, [
    "ticker",
    "symbol",
    "underlying",
    "underlying_symbol",
  ])?.toUpperCase();
  const contractType = normalizeContractType(
    getStringValue(item, [
      "contract_type",
      "contractType",
      "option_type",
      "optionType",
      "type",
    ])
  );

  if (!ticker || !contractType) {
    return null;
  }

  const sentimentText = getStringValue(item, ["sentiment", "direction"]);

  return {
    ticker,
    contract_type: contractType,
    strike: parseNumber(item.strike ?? item.strike_price ?? item.strikePrice),
    expiry: parseDate(item.expiry ?? item.expiration ?? item.expirationDate),
    volume: parseNumber(item.volume),
    open_interest: parseNumber(
      item.open_interest ?? item.openInterest ?? item.oi
    ),
    premium: parseNumber(
      item.premium ?? item.totalPremium ?? item.total_premium ?? item.cost
    ),
    sentiment: normalizeSentiment(sentimentText ?? contractType),
    source: getStringValue(item, ["source"]) ?? "barchart",
    fetched_at: parseTimestamp(
      item.fetched_at ?? item.fetchedAt ?? item.timestamp ?? item.scrapedAt
    ),
    raw_data: item,
  };
}

export async function POST(request: Request) {
  const expectedSecret = process.env.APIFY_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get(WEBHOOK_SECRET_HEADER);

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const records = extractItems(payload)
      .map(normalizeWhaleRecord)
      .filter((record): record is WhaleTrackerRecord => record !== null);

    if (records.length === 0) {
      return NextResponse.json(
        { error: "No valid whale tracker records found" },
        { status: 500 }
      );
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("whale_tracker")
      .upsert(records, {
        onConflict:
          "ticker,contract_type,strike,expiry,volume,open_interest,premium,source,fetched_at",
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: records.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
