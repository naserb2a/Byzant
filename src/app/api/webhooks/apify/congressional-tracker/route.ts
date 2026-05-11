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
const APIFY_API_BASE_URL = "https://api.apify.com/v2";
const DATASET_ITEM_LIMIT = 5000;

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

function parseCapitolTradesDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  const now = new Date();

  if (lower.includes("today")) {
    return now.toISOString().slice(0, 10);
  }

  if (lower.includes("yesterday")) {
    const yesterday = new Date(now);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return yesterday.toISOString().slice(0, 10);
  }

  return parseDate(trimmed);
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

function parseJsonObject(value: unknown): Record<string, unknown> | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function getObjectValue(
  item: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> | null {
  for (const key of keys) {
    const value = parseJsonObject(item[key]);
    if (value) {
      return value;
    }
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

function findNestedString(
  item: Record<string, unknown>,
  keyName: string
): string | null {
  const directValue = item[keyName];
  if (typeof directValue === "string" && directValue.trim()) {
    return directValue.trim();
  }

  for (const value of Object.values(item)) {
    const nested = parseJsonObject(value);
    if (!nested) {
      continue;
    }

    const nestedValue = findNestedString(nested, keyName);
    if (nestedValue) {
      return nestedValue;
    }
  }

  return null;
}

function extractApifyRunMetadata(payload: unknown): {
  runId: string | null;
  datasetId: string | null;
} {
  const items = extractItems(payload);
  const metadata = items.find((item) => {
    const eventType = getStringValue(item, ["eventType", "event_type"]);
    return eventType?.includes("ACTOR.RUN") || item.resource || item.eventData;
  });

  if (!metadata) {
    return { runId: null, datasetId: null };
  }

  const resource = getObjectValue(metadata, ["resource"]) ?? metadata;
  const eventData = getObjectValue(metadata, ["eventData", "event_data"]);

  const datasetId =
    getStringValue(resource, ["defaultDatasetId", "default_dataset_id"]) ??
    (eventData
      ? getStringValue(eventData, ["defaultDatasetId", "default_dataset_id"])
      : null) ??
    findNestedString(metadata, "defaultDatasetId") ??
    findNestedString(metadata, "default_dataset_id");

  const runId =
    getStringValue(resource, ["id", "runId", "run_id", "actorRunId"]) ??
    (eventData
      ? getStringValue(eventData, ["id", "runId", "run_id", "actorRunId"])
      : null) ??
    findNestedString(metadata, "actorRunId") ??
    findNestedString(metadata, "runId") ??
    findNestedString(metadata, "run_id");

  return { runId, datasetId };
}

async function fetchApifyJson(path: string): Promise<unknown> {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    throw new Error("Apify API token is not configured");
  }

  const response = await fetch(`${APIFY_API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      payload !== null &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "object" &&
      payload.error !== null &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
        ? payload.error.message
        : `Apify API request failed with ${response.status}`;

    throw new Error(message);
  }

  return payload;
}

function unwrapApifyData(payload: unknown): unknown {
  if (payload !== null && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data;
  }

  return payload;
}

async function getDatasetIdForRun(runId: string): Promise<string> {
  const runPayload = await fetchApifyJson(
    `/actor-runs/${encodeURIComponent(runId)}`
  );
  const run = unwrapApifyData(runPayload);

  if (run === null || typeof run !== "object" || Array.isArray(run)) {
    throw new Error("Apify run metadata response was not an object");
  }

  const datasetId = getStringValue(run as Record<string, unknown>, [
    "defaultDatasetId",
    "default_dataset_id",
  ]);

  if (!datasetId) {
    throw new Error("Apify run does not include a default dataset ID");
  }

  return datasetId;
}

async function fetchDatasetItems(datasetId: string): Promise<Record<string, unknown>[]> {
  const datasetPayload = await fetchApifyJson(
    `/datasets/${encodeURIComponent(
      datasetId
    )}/items?clean=true&limit=${DATASET_ITEM_LIMIT}`
  );
  const items = unwrapApifyData(datasetPayload);

  return extractItems(items);
}

async function resolveWebhookItems(
  payload: unknown
): Promise<Record<string, unknown>[]> {
  const directItems = extractItems(payload);
  const directRecords = directItems.filter(
    (item) =>
      getStringValue(item, [
        "politician_name",
        "politicianName",
        "politician",
        "representative",
        "name",
        "member",
      ]) &&
      getStringValue(item, [
        "traded_issuer_ticker",
        "ticker",
        "symbol",
        "asset_ticker",
        "assetTicker",
      ])
  );

  if (directRecords.length > 0) {
    return directItems;
  }

  const { runId, datasetId: payloadDatasetId } = extractApifyRunMetadata(payload);
  const datasetId = payloadDatasetId ?? (runId ? await getDatasetIdForRun(runId) : null);

  if (!datasetId) {
    throw new Error("Apify webhook payload did not include a run or dataset ID");
  }

  return fetchDatasetItems(datasetId);
}

function cleanTicker(value: string | null): string | null {
  if (!value) {
    return null;
  }

  if (/^(n\/a|na|none|null)$/i.test(value.trim())) {
    return null;
  }

  const withoutExchangeSuffix = value.replace(/:US$/i, "");
  const firstSymbol = withoutExchangeSuffix.split(/[,\s/]+/)[0]?.trim();

  return firstSymbol ? firstSymbol.toUpperCase() : null;
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

function normalizeParty(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("democrat")) {
    return "Democrat";
  }
  if (normalized.includes("republican")) {
    return "Republican";
  }
  if (normalized.includes("independent")) {
    return "Independent";
  }

  return value;
}

function extractState(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const match = value.match(/\b[A-Z]{2}\b$/);
  return match?.[0] ?? null;
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
  const ticker = cleanTicker(
    getStringValue(item, [
      "traded_issuer_ticker",
      "ticker",
      "symbol",
      "asset_ticker",
      "assetTicker",
    ])
  );
  const tradeType = normalizeTradeType(
    getStringValue(item, [
      "transaction_type",
      "transactionType",
      "trade_type",
      "tradeType",
      "type",
      "action",
    ])
  );

  if (!politicianName || !ticker || !tradeType) {
    return null;
  }

  const politicianFamily = getStringValue(item, [
    "politician_family",
    "party",
  ]);

  return {
    politician_name: politicianName,
    party: normalizeParty(politicianFamily),
    state:
      getStringValue(item, ["state", "politician_state"]) ??
      extractState(politicianFamily),
    ticker,
    trade_type: tradeType,
    amount_range: getStringValue(item, [
      "size",
      "amount",
      "amount_range",
      "amountRange",
      "value",
      "transaction_amount",
      "transactionAmount",
    ]),
    trade_date: parseCapitolTradesDate(
      item.traded ??
      item.trade_date ?? item.tradeDate ?? item.transactionDate ?? item.date
    ),
    disclosure_date: parseCapitolTradesDate(
      item.published ??
        item.disclosure_date ??
        item.disclosureDate ??
        item.filingDate
    ),
    fetched_at: parseTimestamp(
      item.fetched_at ?? item.fetchedAt ?? item.timestamp ?? item.scrapedAt
    ),
    raw_data: item,
  };
}

function getDedupeKey(record: CongressionalTradeRecord): string {
  return [
    record.politician_name,
    record.ticker,
    record.trade_type,
    record.amount_range ?? "",
    record.trade_date ?? "",
    record.disclosure_date ?? "",
  ].join("|");
}

function dedupeRecords(
  records: CongressionalTradeRecord[]
): CongressionalTradeRecord[] {
  const deduped = new Map<string, CongressionalTradeRecord>();

  for (const record of records) {
    deduped.set(getDedupeKey(record), record);
  }

  return Array.from(deduped.values());
}

export async function POST(request: Request) {
  const expectedSecret = process.env.APIFY_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get(WEBHOOK_SECRET_HEADER);

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const items = await resolveWebhookItems(payload);
    const records = dedupeRecords(
      items
      .map(normalizeCongressionalTrade)
      .filter(
        (record): record is CongressionalTradeRecord => record !== null
      )
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
