import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type TradeType = "buy" | "sell";

type CongressionalTradeRecord = {
  politician_name: string;
  party: string | null;
  state: string | null;
  ticker: string;
  trade_type: TradeType;
  amount_range: string | null;
  trade_date: string | null;
  disclosure_date: string | null;
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

function normalizeTradeType(value: string | null): TradeType | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();
  if (
    normalized.includes("buy") ||
    normalized.includes("purchase") ||
    normalized.includes("acquire")
  ) {
    return "buy";
  }
  if (
    normalized.includes("sell") ||
    normalized.includes("sale") ||
    normalized.includes("disposed")
  ) {
    return "sell";
  }

  return null;
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

function normalizeCongressionalTrade(
  item: Record<string, unknown>
): CongressionalTradeRecord | null {
  const politicianName = getStringValue(item, [
    "politician_name",
    "politicianName",
    "politician",
    "representative",
    "name",
    "member",
  ]);
  const ticker = getStringValue(item, [
    "ticker",
    "symbol",
    "asset_ticker",
    "assetTicker",
  ])?.toUpperCase();
  const tradeType = normalizeTradeType(
    getStringValue(item, [
      "trade_type",
      "tradeType",
      "transaction_type",
      "transactionType",
      "type",
      "action",
    ])
  );

  if (!politicianName || !ticker || !tradeType) {
    return null;
  }

  return {
    politician_name: politicianName,
    party: getStringValue(item, ["party"]),
    state: getStringValue(item, ["state"]),
    ticker,
    trade_type: tradeType,
    amount_range: getStringValue(item, [
      "amount_range",
      "amountRange",
      "amount",
      "value",
      "transaction_amount",
      "transactionAmount",
    ]),
    trade_date: parseDate(
      item.trade_date ?? item.tradeDate ?? item.transactionDate ?? item.date
    ),
    disclosure_date: parseDate(
      item.disclosure_date ?? item.disclosureDate ?? item.filingDate
    ),
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
      .map(normalizeCongressionalTrade)
      .filter(
        (record): record is CongressionalTradeRecord => record !== null
      );

    if (records.length === 0) {
      return NextResponse.json(
        { error: "No valid congressional trade records found" },
        { status: 500 }
      );
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("congressional_trades")
      .upsert(records, {
        onConflict:
          "politician_name,ticker,trade_type,amount_range,trade_date,disclosure_date",
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
