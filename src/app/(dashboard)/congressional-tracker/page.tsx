"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MONO = "inherit";
const SANS = "inherit";

type Trade = {
  id: string;
  politician_name: string;
  party: string | null;
  ticker: string;
  trade_type: "buy" | "sell";
  amount_range: string | null;
  trade_date: string | null;
  disclosure_date: string | null;
};

type PartyFilter = "all" | "Democrat" | "Republican";

const PARTY_FILTERS: { key: PartyFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Democrat", label: "Democrat" },
  { key: "Republican", label: "Republican" },
];

const PAGE_SIZE = 50;

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

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  });
}

function PartyBadge({ party }: { party: string | null }) {
  const normalized = (party ?? "").trim().toLowerCase();
  const isDem = normalized.startsWith("d");
  const isRep = normalized.startsWith("r");
  const palette = isDem
    ? { color: "var(--db-blue)", bg: "var(--db-blue-dim)" }
    : isRep
      ? { color: "var(--db-red)", bg: "var(--db-red-dim)" }
      : { color: "var(--db-ink-muted)", bg: "var(--db-bg4)" };
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: MONO,
        fontWeight: 600,
        color: palette.color,
        background: palette.bg,
        padding: "2px 8px",
        borderRadius: 999,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {party ?? "—"}
    </span>
  );
}

function TypePill({ type }: { type: "buy" | "sell" }) {
  const isBuy = type === "buy";
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: MONO,
        fontWeight: 700,
        color: isBuy ? "var(--db-accent-text)" : "var(--db-red)",
        background: isBuy ? "rgba(153,225,217,0.10)" : "rgba(248,113,113,0.10)",
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

export default function CongressionalTrackerPage() {
  const router = useRouter();

  const [rows, setRows] = useState<Trade[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [partyFilter, setPartyFilter] = useState<PartyFilter>("all");
  const [tickerQuery, setTickerQuery] = useState("");
  const [politicianQuery, setPoliticianQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(
    async (nextOffset: number, append: boolean, signal: AbortSignal) => {
      const params = new URLSearchParams();
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(nextOffset));
      if (partyFilter !== "all") params.set("party", partyFilter);

      const res = await fetch(`/api/congressional?${params.toString()}`, {
        credentials: "same-origin",
        signal,
      });
      if (res.status === 401) {
        router.replace("/auth");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error || `HTTP ${res.status}`
        );
      }
      const json = (await res.json()) as {
        data: Trade[];
        pagination: { limit: number; offset: number; count: number | null };
      };
      if (signal.aborted) return;
      setTotalCount(json.pagination.count ?? null);
      setRows((prev) =>
        append && prev ? [...prev, ...json.data] : json.data
      );
      setOffset(nextOffset + json.data.length);
    },
    [partyFilter, router]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    setRows(null);
    setError(null);
    setOffset(0);
    setTotalCount(null);
    fetchPage(0, false, ctrl.signal).catch((e) => {
      if (ctrl.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Failed to load");
    });
    return () => ctrl.abort();
  }, [fetchPage]);

  const canLoadMore = useMemo(
    () =>
      rows !== null &&
      totalCount !== null &&
      rows.length < totalCount &&
      !loadingMore,
    [rows, totalCount, loadingMore]
  );

  const handleLoadMore = useCallback(() => {
    if (!canLoadMore) return;
    const ctrl = new AbortController();
    setLoadingMore(true);
    fetchPage(offset, true, ctrl.signal)
      .catch((e) => {
        if (ctrl.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => setLoadingMore(false));
  }, [canLoadMore, fetchPage, offset]);

  useEffect(() => {
    if (!canLoadMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { rootMargin: "200px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [canLoadMore, handleLoadMore]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const t = tickerQuery.trim().toUpperCase();
    const p = politicianQuery.trim().toLowerCase();
    return rows.filter((r) => {
      if (t && !r.ticker.toUpperCase().includes(t)) return false;
      if (p && !r.politician_name.toLowerCase().includes(p)) return false;
      return true;
    });
  }, [rows, tickerQuery, politicianQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
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
            Congressional Tracker
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
            Real-time congressional trade disclosures
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 10,
            color: "var(--db-ink-faint)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--db-blue)",
              boxShadow: "0 0 8px var(--db-blue)",
            }}
          />
          Live · Capitol Trades
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PARTY_FILTERS.map((f) => {
            const active = partyFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setPartyFilter(f.key)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border:
                    "1px solid " +
                    (active ? "var(--db-blue)" : "var(--db-border)"),
                  background: active ? "var(--db-blue-dim)" : "var(--db-bg2)",
                  color: active
                    ? "var(--db-accent-text)"
                    : "var(--db-ink-muted)",
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: active ? 600 : 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition:
                    "background 0.15s, color 0.15s, border-color 0.15s",
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

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="text"
            value={tickerQuery}
            onChange={(e) => setTickerQuery(e.target.value)}
            placeholder="Search ticker..."
            style={{
              background: "var(--db-bg2)",
              border: "1px solid var(--db-border)",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              color: "var(--db-ink)",
              fontFamily: MONO,
              outline: "none",
              width: 200,
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--db-blue)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--db-border)")
            }
          />
          <input
            type="text"
            value={politicianQuery}
            onChange={(e) => setPoliticianQuery(e.target.value)}
            placeholder="Search politician..."
            style={{
              background: "var(--db-bg2)",
              border: "1px solid var(--db-border)",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              color: "var(--db-ink)",
              fontFamily: SANS,
              outline: "none",
              width: 220,
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--db-blue)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--db-border)")
            }
          />
        </div>
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
            Failed to load congressional trades: {error}
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
            <table
              style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}
            >
              <thead>
                <tr style={{ background: "var(--db-bg3)" }}>
                  <th style={TH}>Politician</th>
                  <th style={TH}>Party</th>
                  <th style={TH}>Ticker</th>
                  <th style={TH}>Type</th>
                  <th style={{ ...TH, textAlign: "right" }}>Amount</th>
                  <th style={TH}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom:
                        i < filtered.length - 1
                          ? "1px solid var(--db-border)"
                          : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--db-blue-glow)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        ...TD_MONO,
                        fontWeight: 500,
                        color: "var(--db-ink)",
                      }}
                    >
                      {r.politician_name}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <PartyBadge party={r.party} />
                    </td>
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
                      <TypePill type={r.trade_type} />
                    </td>
                    <td
                      style={{
                        ...TD_MONO,
                        textAlign: "right",
                        color: "var(--db-ink)",
                      }}
                    >
                      {r.amount_range ?? "—"}
                    </td>
                    <td
                      style={{
                        ...TD_MONO,
                        color: "var(--db-ink-muted)",
                      }}
                    >
                      {formatDate(r.disclosure_date)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: 32,
                        textAlign: "center",
                        fontFamily: SANS,
                        fontSize: 13,
                        color: "var(--db-ink-muted)",
                      }}
                    >
                      No trades match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination sentinel + load-more */}
      {rows !== null && totalCount !== null && rows.length < totalCount && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            padding: "4px 0 24px",
          }}
        >
          <div ref={sentinelRef} style={{ width: 1, height: 1 }} aria-hidden />
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: "1px solid var(--db-border)",
              background: "var(--db-bg2)",
              color: loadingMore
                ? "var(--db-ink-faint)"
                : "var(--db-ink-muted)",
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: loadingMore ? "default" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!loadingMore) {
                e.currentTarget.style.color = "var(--db-ink)";
                e.currentTarget.style.borderColor = "var(--db-border-hi)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loadingMore) {
                e.currentTarget.style.color = "var(--db-ink-muted)";
                e.currentTarget.style.borderColor = "var(--db-border)";
              }
            }}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
