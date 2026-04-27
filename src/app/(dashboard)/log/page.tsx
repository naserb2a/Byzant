"use client";
import { useEffect, useMemo, useState } from "react";
import StatusPill from "@/components/dashboard/StatusPill";

const SYS = "inherit";

type LogStatus = "success" | "pending" | "declined";

interface LogRow {
  id: string;
  ts: string;
  status: LogStatus;
  type: string;
  agent: string;
  ticker: string;
  detail: string;
  sessionId: string;
  notes?: string;
}

const ROWS: LogRow[] = [
  { id: "evt-0042", ts: "2026-04-05 09:31:04", status: "success",  type: "Trade Executed",   agent: "Alpha-1", ticker: "NVDA",  detail: "Long 50sh @ $118.40 · Filled",          sessionId: "sess-2026-04-05-01", notes: "Routed via Alpaca · slippage 0.02%." },
  { id: "evt-0041", ts: "2026-04-05 09:30:18", status: "pending",  type: "Approval Request", agent: "Gamma-3", ticker: "XLK",   detail: "Long 30sh @ $214.60 · Awaiting",        sessionId: "sess-2026-04-05-01", notes: "Sector rotation thesis · risk score 64." },
  { id: "evt-0040", ts: "2026-04-05 09:28:55", status: "success",  type: "Module Activated", agent: "Beta-2",  ticker: "—",     detail: "Risk Management Suite v2.1",            sessionId: "sess-2026-04-05-01" },
  { id: "evt-0039", ts: "2026-04-05 09:22:40", status: "declined", type: "Trade Declined",   agent: "Beta-2",  ticker: "QQQ",   detail: "Put spread rejected by user",           sessionId: "sess-2026-04-05-01", notes: "User declined · low conviction signal." },
  { id: "evt-0038", ts: "2026-04-05 09:18:11", status: "success",  type: "Signal Generated", agent: "Alpha-1", ticker: "NVDA",  detail: "Bullish momentum · Score 82",           sessionId: "sess-2026-04-05-01" },
  { id: "evt-0037", ts: "2026-04-05 09:12:04", status: "success",  type: "Data Sync",        agent: "System",  ticker: "—",     detail: "Polygon.io · 1,240 instruments",        sessionId: "sess-2026-04-05-01" },
  { id: "evt-0036", ts: "2026-04-05 09:09:33", status: "pending",  type: "Approval Request", agent: "Alpha-1", ticker: "NVDA",  detail: "50sh long position · $5,920",           sessionId: "sess-2026-04-05-01" },
  { id: "evt-0035", ts: "2026-04-05 09:05:17", status: "success",  type: "Agent Started",    agent: "Gamma-3", ticker: "—",     detail: "Macro Sector Rotation v3.0",            sessionId: "sess-2026-04-05-01" },
  { id: "evt-0034", ts: "2026-04-05 09:00:00", status: "success",  type: "Session Opened",   agent: "System",  ticker: "—",     detail: "Market open · All agents nominal",      sessionId: "sess-2026-04-05-01" },
  { id: "evt-0033", ts: "2026-04-04 15:58:42", status: "success",  type: "Trade Executed",   agent: "Beta-2",  ticker: "SPY",   detail: "Covered call sold · 3 contracts",       sessionId: "sess-2026-04-04-02", notes: "Premium captured: $825." },
  { id: "evt-0032", ts: "2026-04-04 14:41:05", status: "success",  type: "Signal Generated", agent: "Gamma-3", ticker: "XLF",   detail: "Mean reversion · Score 71",             sessionId: "sess-2026-04-04-02" },
  { id: "evt-0031", ts: "2026-04-04 13:22:18", status: "declined", type: "Trade Declined",   agent: "Alpha-1", ticker: "TSLA",  detail: "Long entry rejected by risk module",    sessionId: "sess-2026-04-04-02", notes: "Stop distance > 5% · violates policy." },
  { id: "evt-0030", ts: "2026-04-04 12:08:54", status: "success",  type: "Module Activated", agent: "System",  ticker: "—",     detail: "News & Sentiment Feed v1.4",            sessionId: "sess-2026-04-04-02" },
  { id: "evt-0029", ts: "2026-04-04 11:33:12", status: "pending",  type: "Approval Request", agent: "Gamma-3", ticker: "EEM",   detail: "Long 100sh @ $42.10 · Awaiting",        sessionId: "sess-2026-04-04-02" },
  { id: "evt-0028", ts: "2026-04-04 10:52:30", status: "success",  type: "Trade Executed",   agent: "Alpha-1", ticker: "AMD",   detail: "Long 80sh @ $172.20 · Filled",          sessionId: "sess-2026-04-04-02" },
  { id: "evt-0027", ts: "2026-04-04 10:04:11", status: "success",  type: "Data Sync",        agent: "System",  ticker: "—",     detail: "Cboe Options · 412k contracts",         sessionId: "sess-2026-04-04-02" },
  { id: "evt-0026", ts: "2026-04-04 09:30:02", status: "success",  type: "Agent Started",    agent: "Alpha-1", ticker: "—",     detail: "Momentum Engine v4.2",                  sessionId: "sess-2026-04-04-02" },
  { id: "evt-0025", ts: "2026-04-04 09:00:00", status: "success",  type: "Session Opened",   agent: "System",  ticker: "—",     detail: "Market open · 3 agents online",         sessionId: "sess-2026-04-04-02" },
  { id: "evt-0024", ts: "2026-04-03 15:55:48", status: "success",  type: "Trade Executed",   agent: "Beta-2",  ticker: "IWM",   detail: "Iron condor closed · +$340",            sessionId: "sess-2026-04-03-03" },
  { id: "evt-0023", ts: "2026-04-03 14:18:22", status: "pending",  type: "Approval Request", agent: "Alpha-1", ticker: "META",  detail: "Long 25sh @ $508.40 · Awaiting",        sessionId: "sess-2026-04-03-03" },
  { id: "evt-0022", ts: "2026-04-03 13:02:09", status: "success",  type: "Signal Generated", agent: "Gamma-3", ticker: "XLE",   detail: "Breakout setup · Score 76",             sessionId: "sess-2026-04-03-03" },
  { id: "evt-0021", ts: "2026-04-03 11:47:31", status: "declined", type: "Trade Declined",   agent: "Alpha-1", ticker: "AAPL",  detail: "Position size cap exceeded",            sessionId: "sess-2026-04-03-03", notes: "Existing AAPL exposure already at 8.2% of NAV." },
  { id: "evt-0020", ts: "2026-04-03 10:14:55", status: "success",  type: "Module Activated", agent: "Alpha-1", ticker: "—",     detail: "Technical Analysis Engine v2.3",        sessionId: "sess-2026-04-03-03" },
  { id: "evt-0019", ts: "2026-04-03 09:30:00", status: "success",  type: "Session Opened",   agent: "System",  ticker: "—",     detail: "Market open · All agents nominal",      sessionId: "sess-2026-04-03-03" },
  { id: "evt-0018", ts: "2026-04-02 15:42:18", status: "success",  type: "Trade Executed",   agent: "Alpha-1", ticker: "MSFT",  detail: "Long 40sh @ $416.20 · Filled",          sessionId: "sess-2026-04-02-04" },
  { id: "evt-0017", ts: "2026-04-02 14:08:33", status: "success",  type: "Data Sync",        agent: "System",  ticker: "—",     detail: "Refinitiv News · 2,884 articles",       sessionId: "sess-2026-04-02-04" },
];

const AGENT_OPTIONS = ["All", "Alpha-1", "Beta-2", "Gamma-3", "System"];
const TYPE_OPTIONS = ["All", "Trade Executed", "Approval Request", "Signal Generated", "Module Activated", "Data Sync", "Agent Started", "Session Opened", "Trade Declined"];
const STATUS_OPTIONS = ["All", "Success", "Pending", "Declined"];

const PAGE_SIZE = 10;

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 999,
        border: "0.5px solid",
        borderColor: active ? "rgba(153,225,217,0.45)" : "var(--db-border)",
        background: active ? "rgba(153,225,217,0.10)" : "transparent",
        color: active ? "var(--db-blue)" : "var(--db-ink-muted)",
        fontSize: 11,
        fontWeight: active ? 500 : 400,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        whiteSpace: "nowrap",
        fontFamily: SYS,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--db-border-hi)";
          e.currentTarget.style.color = "var(--db-ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--db-border)";
          e.currentTarget.style.color = "var(--db-ink-muted)";
        }
      }}
    >
      {label}
    </button>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span
        style={{
          fontSize: 10,
          color: "var(--db-ink-faint)",
          fontFamily: SYS,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginRight: 4,
        }}
      >
        {label}
      </span>
      {options.map((opt) => (
        <FilterPill key={opt} label={opt} active={value === opt} onClick={() => onChange(opt)} />
      ))}
    </div>
  );
}

function escapeCsv(value: string | number) {
  const v = String(value ?? "");
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function downloadCsv(rows: LogRow[]) {
  const headers = ["Timestamp", "Status", "Action Type", "Agent", "Ticker", "Details"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [r.ts, r.status, r.type, r.agent, r.ticker, r.detail].map(escapeCsv).join(",")
    ),
  ];
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `agent-log-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const TH: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 10,
  fontWeight: 600,
  color: "var(--db-ink-faint)",
  fontFamily: SYS,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  borderBottom: "1px solid var(--db-border)",
  whiteSpace: "nowrap",
};

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: "var(--db-ink-faint)",
          fontFamily: SYS,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "var(--db-ink)",
          fontFamily: SYS,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function LogPage() {
  const [agentFilter, setAgentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ROWS.filter((r) => {
      if (agentFilter !== "All" && r.agent !== agentFilter) return false;
      if (typeFilter !== "All" && r.type !== typeFilter) return false;
      if (statusFilter !== "All" && r.status !== (statusFilter.toLowerCase() as LogStatus)) return false;
      if (q) {
        const haystack = `${r.ticker} ${r.agent} ${r.detail} ${r.type}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [agentFilter, typeFilter, statusFilter, search]);

  useEffect(() => {
    setPage(1);
    setExpandedId(null);
  }, [agentFilter, typeFilter, statusFilter, search]);

  useEffect(() => {
    setExpandedId(null);
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "var(--db-ink)",
              letterSpacing: "-0.02em",
              margin: "0 0 4px",
              fontFamily: SYS,
            }}
          >
            Agent Activity Log
          </h1>
          <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: 0, fontFamily: SYS }}>
            {filtered.length} of {ROWS.length} events · Real-time feed
          </p>
        </div>
        <button
          onClick={() => downloadCsv(filtered)}
          style={{
            background: "rgba(153,225,217,0.10)",
            border: "0.5px solid rgba(153,225,217,0.45)",
            color: "var(--db-blue)",
            borderRadius: 6,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.15s, border-color 0.15s",
            fontFamily: SYS,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(153,225,217,0.16)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(153,225,217,0.10)";
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Search + filters */}
      <div
        style={{
          background: "var(--db-bg2)",
          border: "0.5px solid var(--db-border)",
          borderRadius: 6,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticker, agent, or details…"
          style={{
            width: "100%",
            background: "var(--db-bg3)",
            border: "0.5px solid var(--db-border)",
            borderRadius: 6,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--db-ink)",
            outline: "none",
            fontFamily: SYS,
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(153,225,217,0.45)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--db-border)")}
        />
        <FilterGroup label="Agent" options={AGENT_OPTIONS} value={agentFilter} onChange={setAgentFilter} />
        <FilterGroup label="Action" options={TYPE_OPTIONS} value={typeFilter} onChange={setTypeFilter} />
        <FilterGroup label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--db-bg3)" }}>
              <th style={TH}>Timestamp</th>
              <th style={TH}>Status</th>
              <th style={TH}>Action Type</th>
              <th style={TH}>Agent</th>
              <th style={TH}>Ticker</th>
              <th style={{ ...TH, width: "100%" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "32px 14px", textAlign: "center", fontSize: 13, color: "var(--db-ink-muted)", fontFamily: SYS }}>
                  No events match the current filters.
                </td>
              </tr>
            )}
            {visible.map((r, i) => {
              const expanded = expandedId === r.id;
              const isLast = i === visible.length - 1;
              return (
                <ExpandableRow
                  key={r.id}
                  row={r}
                  expanded={expanded}
                  isLast={isLast}
                  onToggle={() => setExpandedId(expanded ? null : r.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: SYS }}>
          {filtered.length === 0
            ? "0 results"
            : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PageButton disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
            ← Previous
          </PageButton>
          <div
            style={{
              fontSize: 11,
              color: "var(--db-ink-muted)",
              fontFamily: SYS,
              padding: "0 8px",
              whiteSpace: "nowrap",
            }}
          >
            Page <span style={{ color: "var(--db-ink)", fontWeight: 500 }}>{safePage}</span> of {pageCount}
          </div>
          <PageButton disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>
            Next →
          </PageButton>
        </div>
      </div>
    </div>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "transparent",
        border: "0.5px solid var(--db-border)",
        borderRadius: 6,
        padding: "6px 12px",
        fontSize: 11,
        color: disabled ? "var(--db-ink-faint)" : "var(--db-ink-muted)",
        cursor: disabled ? "default" : "pointer",
        transition: "border-color 0.15s, color 0.15s",
        fontFamily: SYS,
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(153,225,217,0.45)";
          e.currentTarget.style.color = "var(--db-blue)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "var(--db-border)";
          e.currentTarget.style.color = "var(--db-ink-muted)";
        }
      }}
    >
      {children}
    </button>
  );
}

function ExpandableRow({
  row,
  expanded,
  isLast,
  onToggle,
}: {
  row: LogRow;
  expanded: boolean;
  isLast: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        style={{
          borderBottom: !expanded && !isLast ? "1px solid var(--db-border)" : "none",
          transition: "background 0.15s",
          cursor: "pointer",
          background: expanded ? "var(--db-blue-glow)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!expanded) e.currentTarget.style.background = "var(--db-blue-glow)";
        }}
        onMouseLeave={(e) => {
          if (!expanded) e.currentTarget.style.background = "transparent";
        }}
      >
        <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--db-ink-muted)", fontFamily: SYS, whiteSpace: "nowrap" }}>{row.ts}</td>
        <td style={{ padding: "11px 14px" }}>
          <StatusPill status={row.status} />
        </td>
        <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 400, color: "var(--db-ink)", fontFamily: SYS, whiteSpace: "nowrap" }}>{row.type}</td>
        <td style={{ padding: "11px 14px" }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: SYS,
              fontWeight: 600,
              color: row.agent === "System" ? "var(--db-ink-muted)" : "var(--db-blue)",
              background: row.agent === "System" ? "var(--db-bg4)" : "var(--db-blue-dim)",
              padding: "2px 7px",
              borderRadius: 999,
            }}
          >
            {row.agent}
          </span>
        </td>
        <td style={{ padding: "11px 14px", fontSize: 12, color: "var(--db-ink-muted)", fontFamily: SYS }}>{row.ticker}</td>
        <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", fontFamily: SYS }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{row.detail}</span>
            <span
              style={{
                fontSize: 12,
                color: "var(--db-ink-faint)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ▾
            </span>
          </div>
        </td>
      </tr>
      <tr style={{ borderBottom: !isLast ? "1px solid var(--db-border)" : "none" }}>
        <td colSpan={6} style={{ padding: 0, background: "var(--db-bg3)" }}>
          <div
            style={{
              maxHeight: expanded ? 260 : 0,
              opacity: expanded ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.25s ease, opacity 0.2s ease",
            }}
          >
            <div
              style={{
                padding: "16px 18px",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <DetailField label="Event ID" value={row.id} />
              <DetailField label="Timestamp" value={row.ts} />
              <DetailField label="Session" value={row.sessionId} />
              <DetailField label="Status" value={row.status.charAt(0).toUpperCase() + row.status.slice(1)} />
              <DetailField label="Action Type" value={row.type} />
              <DetailField label="Agent" value={row.agent} />
              <DetailField label="Ticker" value={row.ticker} />
              <div style={{ gridColumn: "span 2" }}>
                <DetailField label="Details" value={row.detail} />
              </div>
              {row.notes && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <DetailField label="Notes" value={row.notes} />
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
