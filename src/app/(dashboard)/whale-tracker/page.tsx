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
type ViewMode = "table" | "raw";

const TERMINAL_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Courier New', monospace";

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
    bullish: { color: "var(--db-accent-text)", bg: "rgba(153,225,217,0.10)" },
    bearish: { color: "var(--db-red)", bg: "rgba(248,113,113,0.10)" },
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
        color: isCall ? "var(--db-accent-text)" : "var(--db-red)",
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

function TableIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <rect x="1.5" y="1.5" width="11" height="11" rx="1" />
      <line x1="1.5" y1="5.5" x2="12.5" y2="5.5" />
      <line x1="1.5" y1="9" x2="12.5" y2="9" />
      <line x1="5.5" y1="5.5" x2="5.5" y2="12.5" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="2.5,3.5 6,7 2.5,10.5" />
      <line x1="7.5" y1="10.5" x2="11.5" y2="10.5" />
    </svg>
  );
}

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  const options: { key: ViewMode; label: string; Icon: React.ComponentType }[] = [
    { key: "table", label: "Table", Icon: TableIcon },
    { key: "raw", label: "Raw Feed", Icon: TerminalIcon },
  ];
  return (
    <div
      role="group"
      aria-label="View mode"
      style={{
        display: "flex",
        background: "var(--db-bg2)",
        border: "1px solid var(--db-border)",
        borderRadius: 999,
        padding: 2,
        gap: 2,
      }}
    >
      {options.map(({ key, label, Icon }) => {
        const active = mode === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              border: "none",
              background: active ? "var(--db-blue-dim)" : "transparent",
              color: active ? "var(--db-accent-text)" : "var(--db-ink-muted)",
              fontFamily: MONO,
              fontSize: 10,
              fontWeight: active ? 600 : 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = "var(--db-ink)";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = "var(--db-ink-muted)";
            }}
          >
            <Icon />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Raw Feed renderer (matches landing-page WhaleJSON palette) ── */
const RAW_BG = "#0A0A0A";
const RAW_HEADER_BG = "#080808";
const RAW_KEY = "#7dd3c0";
const RAW_STRING = "#e6c07b";
const RAW_NUMBER = "#c5d4e8";
const RAW_BRACE = "#888888";
const RAW_PUNCT = "#666666";
const RAW_COMMENT = "#666666";
const RAW_LIVE = "#3dd68c";
const RAW_GUTTER = "rgba(255,255,255,0.22)";
const RAW_GUTTER_BORDER = "rgba(255,255,255,0.05)";
const RAW_FILENAME = "rgba(255,255,255,0.4)";

const RAW_KEYFRAMES = `
  @keyframes whale-raw-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.55; transform: scale(0.82); }
  }
`;

type RawLine = { lineNo: number; node: React.ReactNode };

function buildRawLines(rows: Flow[], comment: string): RawLine[] {
  const lines: RawLine[] = [];
  let n = 0;
  const push = (node: React.ReactNode) => {
    n += 1;
    lines.push({ lineNo: n, node });
  };

  push(<span style={{ color: RAW_COMMENT }}>{comment}</span>);
  push(<span style={{ color: RAW_BRACE }}>[</span>);

  rows.forEach((r, idx) => {
    const isLast = idx === rows.length - 1;
    push(
      <span style={{ paddingLeft: 16, color: RAW_BRACE }}>{"{"}</span>
    );

    const fields: [string, string | number, "string" | "number"][] = [
      ["recordId", `"${r.recordId}"`, "string"],
      ["ticker", `"${r.ticker}"`, "string"],
      ["type", `"${r.type}"`, "string"],
      ["strike", r.strike, "number"],
      ["expiration", `"${r.expiration}"`, "string"],
      ["daysToExpiry", r.daysToExpiry, "number"],
      ["volume", r.volume, "number"],
      ["openInterest", r.openInterest, "number"],
      ["volumeOIRatio", r.volumeOIRatio, "number"],
      ["impliedVolatility", r.impliedVolatility, "number"],
      ["premium", r.premium, "number"],
      ["underlyingPrice", r.underlyingPrice, "number"],
      ["sentiment", `"${r.sentiment}"`, "string"],
      ["tradeTime", `"${r.tradeTime}"`, "string"],
    ];

    fields.forEach(([k, v, kind], fi) => {
      const isLastField = fi === fields.length - 1;
      push(
        <span style={{ paddingLeft: 32 }}>
          <span style={{ color: RAW_KEY }}>&quot;{k}&quot;</span>
          <span style={{ color: RAW_PUNCT }}>: </span>
          <span style={{ color: kind === "string" ? RAW_STRING : RAW_NUMBER }}>
            {v}
          </span>
          {!isLastField && <span style={{ color: RAW_PUNCT }}>,</span>}
        </span>
      );
    });

    push(
      <span style={{ paddingLeft: 16, color: RAW_BRACE }}>
        {isLast ? "}" : "},"}
      </span>
    );
  });

  push(<span style={{ color: RAW_BRACE }}>]</span>);
  return lines;
}

function RawFeedView({
  rows,
  loadedAt,
}: {
  rows: Flow[];
  loadedAt: string;
}) {
  const comment = `// Byzant MCP Feed · whale_tracker · ${rows.length.toLocaleString()} records · Last updated ${loadedAt}`;
  const lines = useMemo(() => buildRawLines(rows, comment), [rows, comment]);

  return (
    <div
      style={{
        background: RAW_BG,
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
      }}
    >
      <style>{RAW_KEYFRAMES}</style>

      {/* Header bar: filename left, live badge right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: RAW_HEADER_BG,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            fontFamily: TERMINAL_MONO,
            fontSize: 11,
            color: RAW_FILENAME,
            letterSpacing: "0.04em",
          }}
        >
          whale_tracker.json
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: TERMINAL_MONO,
            fontSize: 11,
            color: RAW_FILENAME,
            letterSpacing: "0.04em",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: RAW_LIVE,
              boxShadow: "0 0 10px rgba(61,214,140,0.55)",
              animation: "whale-raw-pulse 1.4s ease-in-out infinite",
            }}
          />
          Live · Updating daily during market hours
        </span>
      </div>

      {/* Terminal body */}
      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "auto",
          background: RAW_BG,
        }}
      >
        <div
          style={{
            fontFamily: TERMINAL_MONO,
            fontSize: 13,
            lineHeight: 1.7,
            color: "#e6e6e6",
            padding: "20px 0",
          }}
        >
          {lines.map(({ lineNo, node }) => (
            <div
              key={lineNo}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                columnGap: 16,
                paddingRight: 24,
              }}
            >
              <span
                aria-hidden
                style={{
                  color: RAW_GUTTER,
                  textAlign: "right",
                  paddingRight: 10,
                  borderRight: `1px solid ${RAW_GUTTER_BORDER}`,
                  userSelect: "none",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {lineNo}
              </span>
              <span style={{ whiteSpace: "pre" }}>{node}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WhaleTrackerPage() {
  const [rows, setRows] = useState<Flow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [loadedAt, setLoadedAt] = useState<string | null>(null);

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
        setLoadedAt(new Date().toISOString().replace(/\.\d{3}Z$/, "Z"));
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

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
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
      </div>

      {viewMode === "table" ? (
        <>
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
                color: active ? "var(--db-accent-text)" : "var(--db-ink-muted)",
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
                        color: "var(--db-accent-text)",
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
        </>
      ) : (
        <>
          {/* Messaging line */}
          <div
            style={{
              fontFamily: SANS,
              fontSize: 11,
              color: "var(--db-ink-faint)",
              letterSpacing: "0.06em",
            }}
          >
            Agent-readable format · This is what your agent consumes via MCP
          </div>

          {error && (
            <div
              style={{
                padding: 20,
                fontFamily: SANS,
                fontSize: 13,
                color: "var(--db-red)",
                background: "var(--db-bg2)",
                border: "0.5px solid var(--db-border)",
                borderRadius: 6,
              }}
            >
              Failed to load whale data: {error}
            </div>
          )}

          {!error && (rows === null || loadedAt === null) && (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                fontFamily: TERMINAL_MONO,
                fontSize: 11,
                color: "var(--db-ink-faint)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "var(--db-bg2)",
                border: "0.5px solid var(--db-border)",
                borderRadius: 6,
              }}
            >
              Loading raw feed…
            </div>
          )}

          {!error && rows !== null && loadedAt !== null && (
            <RawFeedView rows={rows} loadedAt={loadedAt} />
          )}
        </>
      )}
    </div>
  );
}
