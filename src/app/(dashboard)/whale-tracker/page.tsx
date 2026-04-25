"use client";

import { useEffect, useMemo, useState } from "react";

const MONO = "inherit";
const SANS = "inherit";

type Flow = {
  recordId: string;
  ticker: string;
  type: "call" | "put";
  strike: number;
  expiration: string;
  daysToExpiry: number;
  volume: number;
  openInterest: number;
  volumeOIRatio: number;
  impliedVolatility: number;
  premium: number;
  underlyingPrice: number;
  sentiment: "bullish" | "bearish" | "neutral";
  tradeTime: string;
};

type Filter = "all" | "calls" | "puts" | "bullish" | "bearish";

const TH: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 10,
  fontWeight: 600,
  color: "var(--db-ink-faint)",
  fontFamily: MONO,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  borderBottom: "1px solid var(--db-border)",
  whiteSpace: "nowrap",
};

const TD_MONO: React.CSSProperties = {
  padding: "11px 14px",
  fontSize: 12,
  color: "var(--db-ink)",
  fontFamily: MONO,
  whiteSpace: "nowrap",
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "calls", label: "Calls" },
  { key: "puts", label: "Puts" },
  { key: "bullish", label: "Bullish" },
  { key: "bearish", label: "Bearish" },
];

function formatPremium(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  });
}

function SentimentBadge({ sentiment }: { sentiment: Flow["sentiment"] }) {
  const map: Record<Flow["sentiment"], { color: string; bg: string }> = {
    bullish: { color: "#99E1D9", bg: "rgba(153,225,217,0.10)" },
    bearish: { color: "#f87171", bg: "rgba(248,113,113,0.10)" },
    neutral: { color: "var(--db-ink-muted)", bg: "var(--db-bg4)" },
  };
  const s = map[sentiment] ?? map.neutral;
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: MONO,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        padding: "2px 8px",
        borderRadius: 999,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {sentiment}
    </span>
  );
}

function TypePill({ type }: { type: "call" | "put" }) {
  const isCall = type === "call";
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: MONO,
        fontWeight: 700,
        color: isCall ? "#99E1D9" : "#f87171",
        background: isCall ? "rgba(153,225,217,0.10)" : "rgba(248,113,113,0.10)",
        padding: "2px 7px",
        borderRadius: 4,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {type}
    </span>
  );
}

export default function WhaleTrackerPage() {
  const [rows, setRows] = useState<Flow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    fetch("/data/whale-data.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: unknown[]) => {
        if (cancelled) return;
        const flows = data
          .filter(
            (d): d is Flow =>
              typeof d === "object" &&
              d !== null &&
              (d as { type?: unknown }).type !== "run-summary" &&
              typeof (d as { ticker?: unknown }).ticker === "string"
          )
          .sort((a, b) => b.premium - a.premium);
        setRows(flows);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    switch (filter) {
      case "calls":
        return rows.filter((r) => r.type === "call");
      case "puts":
        return rows.filter((r) => r.type === "put");
      case "bullish":
        return rows.filter((r) => r.sentiment === "bullish");
      case "bearish":
        return rows.filter((r) => r.sentiment === "bearish");
      default:
        return rows;
    }
  }, [rows, filter]);

  const totalPremium = useMemo(
    () => filtered.reduce((acc, r) => acc + r.premium, 0),
    [filtered]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "var(--db-ink)",
              letterSpacing: "-0.02em",
              margin: "0 0 4px",
              fontFamily: SANS,
            }}
          >
            Whale Tracker
          </h1>
          <p
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "var(--db-ink-muted)",
              margin: 0,
              fontFamily: SANS,
            }}
          >
            {rows === null
              ? "Loading unusual options activity…"
              : `${filtered.length.toLocaleString()} flows · ${formatPremium(
                  totalPremium
                )} total premium · Sorted by conviction`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 10, color: "var(--db-ink-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--db-blue)",
              boxShadow: "0 0 8px var(--db-blue)",
            }}
          />
          Live · Barchart Unusual Activity
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid " + (active ? "var(--db-blue)" : "var(--db-border)"),
                background: active ? "var(--db-blue-dim)" : "var(--db-bg2)",
                color: active ? "var(--db-blue)" : "var(--db-ink-muted)",
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "var(--db-ink)";
                  e.currentTarget.style.borderColor = "var(--db-border-hi)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "var(--db-ink-muted)";
                  e.currentTarget.style.borderColor = "var(--db-border)";
                }
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--db-bg2)",
          border: "0.5px solid var(--db-border)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {error && (
          <div
            style={{
              padding: 20,
              fontFamily: SANS,
              fontSize: 13,
              color: "var(--db-red)",
            }}
          >
            Failed to load whale data: {error}
          </div>
        )}

        {!error && rows === null && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 11,
              color: "var(--db-ink-faint)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Loading…
          </div>
        )}

        {!error && rows !== null && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
              <thead>
                <tr style={{ background: "var(--db-bg3)" }}>
                  <th style={TH}>Ticker</th>
                  <th style={TH}>Type</th>
                  <th style={{ ...TH, textAlign: "right" }}>Strike</th>
                  <th style={TH}>Expiry</th>
                  <th style={{ ...TH, textAlign: "right" }}>DTE</th>
                  <th style={{ ...TH, textAlign: "right" }}>Premium</th>
                  <th style={{ ...TH, textAlign: "right" }}>OI</th>
                  <th style={TH}>Sentiment</th>
                  <th style={{ ...TH, textAlign: "right" }}>IV</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.recordId}
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid var(--db-border)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--db-blue-glow)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        ...TD_MONO,
                        fontWeight: 700,
                        color: "var(--db-blue)",
                        fontSize: 13,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {r.ticker}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <TypePill type={r.type} />
                    </td>
                    <td style={{ ...TD_MONO, textAlign: "right" }}>
                      ${r.strike.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </td>
                    <td
                      style={{
                        ...TD_MONO,
                        color: "var(--db-ink-muted)",
                      }}
                    >
                      {formatDate(r.expiration)}
                    </td>
                    <td
                      style={{
                        ...TD_MONO,
                        textAlign: "right",
                        color:
                          r.daysToExpiry <= 7
                            ? "var(--db-amber)"
                            : "var(--db-ink-muted)",
                      }}
                    >
                      {r.daysToExpiry}d
                    </td>
                    <td
                      style={{
                        ...TD_MONO,
                        textAlign: "right",
                        fontWeight: 600,
                        color: "var(--db-ink)",
                      }}
                    >
                      {formatPremium(r.premium)}
                    </td>
                    <td
                      style={{
                        ...TD_MONO,
                        textAlign: "right",
                        color: "var(--db-ink-muted)",
                      }}
                    >
                      {formatNumber(r.openInterest)}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <SentimentBadge sentiment={r.sentiment} />
                    </td>
                    <td
                      style={{
                        ...TD_MONO,
                        textAlign: "right",
                        color: "var(--db-ink-muted)",
                      }}
                    >
                      {(r.impliedVolatility * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: 32,
                        textAlign: "center",
                        fontFamily: SANS,
                        fontSize: 13,
                        color: "var(--db-ink-muted)",
                      }}
                    >
                      No flows match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
