"use client";

import { useState } from "react";

/* ─── Tokens ──────────────────────────────────────────────────── */
const SYS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const TEAL = "#99E1D9";
const GREEN = "#4ade80";
const RED = "#ef4444";
const SHELL = "#0a0a0a";
const SIDEBAR = "#111111";
const CONTENT = "#0d0d0d";
const SURFACE = "#161616";
const BORDER = "rgba(255,255,255,0.06)";
const BORDER_STRONG = "rgba(255,255,255,0.1)";
const INK = "#ffffff";
const MUTED = "#94a3b8";
const FAINT = "#666666";

/* ─── Inline icons (no external deps) ─────────────────────────── */
type IconProps = { size?: number; color?: string };
const baseSvg = (size: number, color: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

function GridIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function CheckIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8.5 12.5 11 15 16 10" />
    </svg>
  );
}
function StoreIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <path d="M3 9l1-5h16l1 5" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}
function ChartIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-7" />
    </svg>
  );
}
function ListIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}

/* ─── Types & data ────────────────────────────────────────────── */
type ViewKey = "dashboard" | "approvals" | "marketplace" | "analytics" | "log";
type AgentKey = "alpha" | "gamma" | "beta";
type ApprovalStatus = "pending" | "approved" | "declined";

const NAV: { key: ViewKey; label: string; Icon: React.ComponentType<IconProps> }[] = [
  { key: "dashboard", label: "Dashboard", Icon: GridIcon },
  { key: "approvals", label: "Approvals", Icon: CheckIcon },
  { key: "marketplace", label: "Marketplace", Icon: StoreIcon },
  { key: "analytics", label: "Analytics", Icon: ChartIcon },
  { key: "log", label: "Agent Log", Icon: ListIcon },
];

const AGENTS: {
  key: AgentKey;
  label: string;
  header: string;
  description: string;
  metrics: [string, string][];
}[] = [
  {
    key: "alpha",
    label: "Alpha-1",
    header: "Alpha-1 · NVDA · $118.40",
    description:
      "Agent requests to open a long position in NVDA. 50 shares · Est. $5,920",
    metrics: [
      ["ENTRY", "$118.40"],
      ["STOP LOSS", "$113.20"],
      ["R/R", "1:3.2"],
      ["CONFIDENCE", "82%"],
    ],
  },
  {
    key: "gamma",
    label: "Gamma-3",
    header: "Gamma-3 · MODULE · $29/mo",
    description:
      "Agent requests access to Dark Pool Monitor module. Required for institutional flow detection.",
    metrics: [
      ["MODULE", "Dark Pool"],
      ["COST", "$29 / mo"],
      ["IMPACT", "+11% edge"],
      ["PRIORITY", "High"],
    ],
  },
  {
    key: "beta",
    label: "Beta-2",
    header: "Beta-2 · SPY · $8,250",
    description:
      "Agent requests to open a covered call position in SPY. 3 contracts · Est. $8,250 collateral",
    metrics: [
      ["STRIKE", "$485"],
      ["EXPIRY", "Apr 18"],
      ["PREMIUM", "$2.75"],
      ["CONFIDENCE", "60%"],
    ],
  },
];

const DASHBOARD_AGENTS = [
  { id: "Alpha-1", signal: "Bullish +0.82", pos: "NVDA Long 50sh" },
  { id: "Beta-2", signal: "Neutral 0.41", pos: "SPY Covered Call" },
  { id: "Gamma-3", signal: "Bullish +0.94", pos: "XLK Long 30sh" },
];

type ModuleRow = {
  id: string;
  name: string;
  tier: "Pro" | "Basic";
  price: string;
  installedByDefault: boolean;
};

const MODULES: ModuleRow[] = [
  { id: "whale", name: "Whale Tracker", tier: "Pro", price: "$29/mo", installedByDefault: true },
  { id: "congress", name: "Congressional Tracker", tier: "Pro", price: "$29/mo", installedByDefault: true },
  { id: "risk", name: "Risk Agent", tier: "Pro", price: "$29/mo", installedByDefault: false },
  { id: "trailing", name: "Trailing Stop Bot", tier: "Basic", price: "$9/mo", installedByDefault: false },
  { id: "wheel", name: "Wheel Strategy Bot", tier: "Pro", price: "$29/mo", installedByDefault: false },
];

/* ─── Component ───────────────────────────────────────────────── */
export default function ByzantInteractiveDemo() {
  const [view, setView] = useState<ViewKey>("approvals");
  const [agentTab, setAgentTab] = useState<AgentKey>("alpha");
  const [approvals, setApprovals] = useState<Record<AgentKey, ApprovalStatus>>({
    alpha: "pending",
    gamma: "pending",
    beta: "pending",
  });
  const [installed, setInstalled] = useState<Set<string>>(
    () => new Set(MODULES.filter((m) => m.installedByDefault).map((m) => m.id))
  );

  const allApproved =
    approvals.alpha === "approved" &&
    approvals.gamma === "approved" &&
    approvals.beta === "approved";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: 580,
        background: SHELL,
        border: `1px solid ${BORDER_STRONG}`,
        borderRadius: 12,
        boxShadow:
          "0 40px 120px rgba(153,225,217,0.06), 0 4px 30px rgba(0,0,0,0.6)",
        fontFamily: SYS,
        color: INK,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <SidebarPanel view={view} onSelect={setView} />
        <div style={{ flex: 1, background: CONTENT, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {view === "approvals" && (
            <ApprovalsView
              agentTab={agentTab}
              setAgentTab={setAgentTab}
              approvals={approvals}
              setApprovals={setApprovals}
              allApproved={allApproved}
            />
          )}
          {view === "dashboard" && <DashboardView />}
          {view === "marketplace" && (
            <MarketplaceView
              installed={installed}
              onInstall={(id) =>
                setInstalled((prev) => {
                  const next = new Set(prev);
                  next.add(id);
                  return next;
                })
              }
            />
          )}
          {view === "analytics" && <Placeholder label="Analytics" />}
          {view === "log" && <Placeholder label="Agent Log" />}
        </div>
      </div>
    </div>
  );
}

/* ─── Top bar ─────────────────────────────────────────────────── */
function TopBar() {
  return (
    <div
      style={{
        height: 36,
        flexShrink: 0,
        background: SHELL,
        borderBottom: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a3a3a" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a3a3a" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3a3a3a" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 11,
          color: FAINT,
          letterSpacing: "0.04em",
          pointerEvents: "none",
        }}
      >
        Agent Dashboard · byzant.ai
      </div>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────── */
function SidebarPanel({
  view,
  onSelect,
}: {
  view: ViewKey;
  onSelect: (v: ViewKey) => void;
}) {
  return (
    <aside
      style={{
        width: 200,
        flexShrink: 0,
        background: SIDEBAR,
        borderRight: `1px solid ${BORDER}`,
        padding: "16px 10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "0 8px 14px",
          fontSize: 12,
          fontWeight: 600,
          color: INK,
          letterSpacing: 0,
        }}
      >
        Byzant
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV.map(({ key, label, Icon }) => {
          const active = view === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
              style={{
                appearance: "none",
                background: active ? "rgba(153,225,217,0.08)" : "transparent",
                border: "none",
                borderLeft: `2px solid ${active ? TEAL : "transparent"}`,
                color: active ? INK : MUTED,
                fontFamily: SYS,
                fontSize: 12,
                fontWeight: active ? 500 : 400,
                textAlign: "left",
                cursor: "pointer",
                padding: "0 10px 0 8px",
                height: 32,
                display: "flex",
                alignItems: "center",
                gap: 9,
                borderRadius: 4,
                transition: "background 120ms ease, color 120ms ease",
              }}
            >
              <Icon size={13} color={active ? TEAL : MUTED} />
              <span style={{ flex: 1 }}>{label}</span>
              {key === "approvals" && <PendingBadge />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function PendingBadge() {
  return (
    <span
      style={{
        minWidth: 16,
        height: 16,
        padding: "0 5px",
        borderRadius: 999,
        background: TEAL,
        color: "#000",
        fontSize: 9,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      3
    </span>
  );
}

/* ─── Approvals view ──────────────────────────────────────────── */
function ApprovalsView({
  agentTab,
  setAgentTab,
  approvals,
  setApprovals,
  allApproved,
}: {
  agentTab: AgentKey;
  setAgentTab: (k: AgentKey) => void;
  approvals: Record<AgentKey, ApprovalStatus>;
  setApprovals: React.Dispatch<React.SetStateAction<Record<AgentKey, ApprovalStatus>>>;
  allApproved: boolean;
}) {
  const active = AGENTS.find((a) => a.key === agentTab)!;
  const status = approvals[agentTab];

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: 0, flex: 1 }}>
      <StatsRow />
      <AgentTabs active={agentTab} onSelect={setAgentTab} approvals={approvals} />

      {allApproved ? (
        <div
          style={{
            background: "rgba(153,225,217,0.08)",
            border: `1px solid rgba(153,225,217,0.3)`,
            borderRadius: 10,
            padding: "20px 22px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(153,225,217,0.15)",
              border: `1px solid ${TEAL}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TEAL,
              flexShrink: 0,
            }}
          >
            <CheckIcon size={14} color={TEAL} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>
              All approvals complete · 3 trades queued
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
              Your agents will execute on the next market open.
            </div>
          </div>
        </div>
      ) : (
        <ApprovalCard
          key={active.key}
          agent={active}
          status={status}
          onApprove={() =>
            setApprovals((prev) => ({ ...prev, [active.key]: "approved" }))
          }
          onDecline={() =>
            setApprovals((prev) => ({ ...prev, [active.key]: "declined" }))
          }
        />
      )}
    </div>
  );
}

function StatsRow() {
  const stats: { label: string; value: string; sub: string; valueColor?: string }[] = [
    { label: "PENDING", value: "3", sub: "Require your review", valueColor: TEAL },
    { label: "APPROVED TODAY", value: "8", sub: "Executed successfully" },
    { label: "EST. POSITION VALUE", value: "$14.2k", sub: "Total if all approved" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.12em",
              color: FAINT,
              marginBottom: 4,
              fontWeight: 500,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: s.valueColor ?? INK,
              letterSpacing: "-0.01em",
              marginBottom: 2,
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: 10, color: MUTED }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

function AgentTabs({
  active,
  onSelect,
  approvals,
}: {
  active: AgentKey;
  onSelect: (k: AgentKey) => void;
  approvals: Record<AgentKey, ApprovalStatus>;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        borderBottom: `1px solid ${BORDER}`,
        paddingBottom: 0,
      }}
    >
      {AGENTS.map((a) => {
        const isActive = active === a.key;
        const status = approvals[a.key];
        const dotColor =
          status === "approved" ? GREEN : status === "declined" ? RED : null;
        return (
          <button
            key={a.key}
            onClick={() => onSelect(a.key)}
            style={{
              appearance: "none",
              background: "transparent",
              border: "none",
              padding: "8px 2px 10px",
              cursor: "pointer",
              color: isActive ? INK : MUTED,
              fontFamily: SYS,
              fontSize: 12,
              fontWeight: isActive ? 500 : 400,
              borderBottom: `2px solid ${isActive ? TEAL : "transparent"}`,
              marginBottom: -1,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "color 120ms ease, border-color 120ms ease",
            }}
          >
            {a.label}
            {dotColor && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: dotColor,
                  display: "inline-block",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ApprovalCard({
  agent,
  status,
  onApprove,
  onDecline,
}: {
  agent: typeof AGENTS[number];
  status: ApprovalStatus;
  onApprove: () => void;
  onDecline: () => void;
}) {
  const declined = status === "declined";
  const approved = status === "approved";
  const [pressing, setPressing] = useState(false);

  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 18,
        opacity: declined ? 0.4 : 1,
        transform: declined ? "translateY(4px)" : "translateY(0)",
        transition: "opacity 200ms ease, transform 200ms ease",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: INK, letterSpacing: "-0.005em" }}>
          {agent.header}
        </span>
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: TEAL,
          }}
        >
          Awaiting your approval
        </span>
      </div>

      <p
        style={{
          fontSize: 12.5,
          color: INK,
          margin: "0 0 14px",
          lineHeight: 1.55,
        }}
      >
        {agent.description}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {agent.metrics.map(([k, v]) => (
          <div
            key={k}
            style={{
              background: "#0a0a0a",
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontSize: 8,
                letterSpacing: "0.12em",
                color: FAINT,
                marginBottom: 3,
                fontWeight: 500,
              }}
            >
              {k}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: INK }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <button
          disabled={approved || declined}
          onClick={onApprove}
          onMouseDown={() => !approved && !declined && setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          style={{
            flex: 1,
            background: approved ? GREEN : TEAL,
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "9px 0",
            fontFamily: SYS,
            fontSize: 12,
            fontWeight: 600,
            cursor: approved || declined ? "default" : "pointer",
            transform: pressing && !approved && !declined ? "scale(0.97)" : "scale(1)",
            transition: "background 200ms ease, transform 120ms ease, opacity 200ms ease",
            opacity: declined ? 0.5 : 1,
          }}
        >
          {approved ? "Approved ✓" : "Approve"}
        </button>
        <button
          disabled={approved || declined}
          onClick={onDecline}
          onMouseEnter={(e) => {
            if (!approved && !declined) e.currentTarget.style.background = "#1c1c1c";
          }}
          onMouseLeave={(e) => {
            if (!approved && !declined) e.currentTarget.style.background = "#161616";
          }}
          style={{
            flex: 1,
            background: SURFACE,
            color: MUTED,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: "9px 0",
            fontFamily: SYS,
            fontSize: 12,
            fontWeight: 500,
            cursor: approved || declined ? "default" : "pointer",
            transition: "background 200ms ease",
          }}
        >
          {declined ? "Declined" : "Decline"}
        </button>
      </div>
    </div>
  );
}

/* ─── Dashboard view ──────────────────────────────────────────── */
function DashboardView() {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {DASHBOARD_AGENTS.map((a) => (
          <div
            key={a.id}
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>{a.id}</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: GREEN,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: GREEN,
                    boxShadow: `0 0 6px ${GREEN}`,
                  }}
                />
                Active
              </span>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>
              SIGNAL · <span style={{ color: INK }}>{a.signal}</span>
            </div>
            <div style={{ fontSize: 11, color: MUTED }}>
              POSITION · <span style={{ color: INK }}>{a.pos}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: 14,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.04em" }}>
            Portfolio Performance
          </span>
          <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>+12.4%</span>
        </div>
        <svg viewBox="0 0 600 100" width="100%" height="100%" preserveAspectRatio="none" style={{ flex: 1, minHeight: 120 }}>
          <defs>
            <linearGradient id="bzd-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(153,225,217,0.35)" />
              <stop offset="100%" stopColor="rgba(153,225,217,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 L60,72 L120,76 L180,60 L240,55 L300,48 L360,52 L420,40 L480,30 L540,22 L600,18 L600,100 L0,100 Z"
            fill="url(#bzd-grad)"
          />
          <path
            d="M0,80 L60,72 L120,76 L180,60 L240,55 L300,48 L360,52 L420,40 L480,30 L540,22 L600,18"
            fill="none"
            stroke={TEAL}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

/* ─── Marketplace view ────────────────────────────────────────── */
function MarketplaceView({
  installed,
  onInstall,
}: {
  installed: Set<string>;
  onInstall: (id: string) => void;
}) {
  const installedRows = MODULES.filter((m) => installed.has(m.id));
  const availableRows = MODULES.filter((m) => !installed.has(m.id));

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        overflow: "hidden",
        flex: 1,
      }}
    >
      <SectionLabel>Installed</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {installedRows.map((m) => (
          <ModuleCard key={m.id} mod={m} installed onInstall={onInstall} />
        ))}
      </div>

      <SectionLabel>Available</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {availableRows.map((m) => (
          <ModuleCard key={m.id} mod={m} installed={false} onInstall={onInstall} />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        letterSpacing: "0.14em",
        color: FAINT,
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function ModuleCard({
  mod,
  installed,
  onInstall,
}: {
  mod: ModuleRow;
  installed: boolean;
  onInstall: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        transition: "background 200ms ease, opacity 200ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{mod.name}</span>
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: MUTED,
            border: `1px solid ${BORDER_STRONG}`,
            padding: "2px 6px",
            borderRadius: 999,
          }}
        >
          {mod.tier}
        </span>
        <span style={{ fontSize: 11, color: MUTED }}>{mod.price}</span>
      </div>
      {installed ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10,
            color: TEAL,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <CheckIcon size={11} color={TEAL} />
          Installed
        </span>
      ) : (
        <button
          onClick={() => onInstall(mod.id)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(153,225,217,0.12)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          style={{
            appearance: "none",
            background: "transparent",
            color: TEAL,
            border: `1px solid ${TEAL}`,
            borderRadius: 999,
            padding: "5px 12px",
            fontFamily: SYS,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 200ms ease",
          }}
        >
          Get Module
        </button>
      )}
    </div>
  );
}

/* ─── Placeholder view ────────────────────────────────────────── */
function Placeholder({ label }: { label: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        color: MUTED,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{label}</div>
      <div style={{ fontSize: 12, color: FAINT }}>Coming soon</div>
    </div>
  );
}
