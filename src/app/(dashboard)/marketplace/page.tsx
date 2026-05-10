"use client";
import { useState } from "react";

const MONO = "inherit";

type ModuleCategory = "Data Feeds" | "Analytics" | "Risk" | "Execution";
type ModuleTier = "Basic" | "Pro" | "Pro Add-on";

interface Module {
  id: string;
  name: string;
  category: ModuleCategory;
  tier: ModuleTier;
  desc: string;
  price: string;
  installed: boolean;
  usage?: number;
  iconPath: string;
  iconColor: string;
}

const MODULES: Module[] = [
  {
    id: "whale-tracker", name: "Whale Tracker", category: "Data Feeds", tier: "Pro",
    desc: "Unusual options flow, dark pool activity, and volume anomaly detection.",
    price: "$29/mo", installed: true, usage: 68,
    iconPath: "M2 12c2-3 5-5 9-5s8 2 11 5c-3 3-7 5-11 5s-7-2-9-5z M9 12a1 1 0 1 0 0-0.01",
    iconColor: "#99E1D9",
  },
  {
    id: "congressional-tracker", name: "Congressional Tracker", category: "Data Feeds", tier: "Pro",
    desc: "Real-time congressional trade disclosures. Monitor lawmaker filings as they post.",
    price: "$29/mo", installed: true, usage: 54,
    iconPath: "M3 21h18 M5 21V10l7-5 7 5v11 M9 21v-6h6v6",
    iconColor: "#B2EBE5",
  },
  {
    id: "risk-agent", name: "Risk Agent", category: "Risk", tier: "Pro",
    desc: "Always-on risk enforcement. Position sizing, loss limits, drawdown recovery, and rule override approval.",
    price: "$29/mo", installed: false,
    iconPath: "M12 3l9 7-9 7-9-7 9-7zM3 17l9 4 9-4",
    iconColor: "#f0b429",
  },
  {
    id: "trailing-stop-bot", name: "Trailing Stop Bot", category: "Execution", tier: "Basic",
    desc: "Automated trailing stop loss management. Set the rules once, the agent enforces them.",
    price: "$9/mo", installed: false,
    iconPath: "M3 17l6-6 4 4 8-9",
    iconColor: "#99E1D9",
  },
  {
    id: "wheel-strategy-bot", name: "Wheel Strategy Bot", category: "Execution", tier: "Pro",
    desc: "Automated wheel options strategy. Sell puts, collect premiums, sell covered calls.",
    price: "$29/mo", installed: false,
    iconPath: "M12 2a10 10 0 1 0 10 10 M12 2v10l7 7",
    iconColor: "#99E1D9",
  },
  {
    id: "ai-research-brief", name: "AI Research Brief", category: "Analytics", tier: "Pro Add-on",
    desc: "One-click investment memo. Ticker in, full research brief out. Powered by Claude.",
    price: "$19/mo", installed: false,
    iconPath: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h6",
    iconColor: "#B2EBE5",
  },
];

const TABS: Array<{ label: string; filter: ModuleCategory | null }> = [
  { label: "All", filter: null },
  { label: "Data Feeds", filter: "Data Feeds" },
  { label: "Analytics", filter: "Analytics" },
  { label: "Risk", filter: "Risk" },
  { label: "Execution", filter: "Execution" },
];

const CATEGORY_COLOR: Record<ModuleCategory, string> = {
  "Data Feeds": "var(--db-blue)",
  "Analytics": "var(--db-blue-bright)",
  "Risk": "var(--db-amber)",
  "Execution": "var(--db-blue)",
};

function IconBox({ path, color, size = 40 }: { path: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 6, flexShrink: 0,
      background: "var(--db-blue-dim)",
      border: "0.5px solid var(--db-border-mid)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none">
        <path d={path} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function TierBadge({ tier }: { tier: ModuleTier }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
      color: "var(--db-ink-muted)",
      padding: "2px 8px", borderRadius: 999, fontFamily: MONO,
      border: "0.5px solid var(--db-border-mid)",
      background: "var(--db-bg3)",
    }}>
      {tier}
    </span>
  );
}

function InstalledCard({ module: m }: { module: Module }) {
  const catColor = CATEGORY_COLOR[m.category];
  const [showConfigMsg, setShowConfigMsg] = useState(false);

  return (
    <div style={{
      background: "var(--db-bg2)",
      border: "0.5px solid var(--db-border)",
      borderRadius: 6, padding: 20,
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconBox path={m.iconPath} color={m.iconColor} size={40} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--db-ink)", marginBottom: 4 }}>
              {m.name}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
                color: catColor,
                padding: "2px 8px", borderRadius: 999, fontFamily: MONO,
                border: "0.5px solid var(--db-border-mid)",
                background: "var(--db-bg3)",
              }}>
                {m.category}
              </span>
              <TierBadge tier={m.tier} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "var(--db-accent-text)", fontFamily: MONO }}>{m.price}</span>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 999,
            background: "var(--db-green-dim)", border: "0.5px solid rgba(61,214,140,0.2)",
          }}>
            <span style={{ color: "var(--db-green)", fontSize: 10 }}>✓</span>
            <span style={{ fontSize: 10, color: "var(--db-green)", fontFamily: MONO, letterSpacing: "0.08em", fontWeight: 500 }}>INSTALLED</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--db-ink-muted)", lineHeight: 1.5, margin: 0 }}>
        {m.desc}
      </p>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: "var(--db-ink-faint)", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Usage this month
          </span>
          <span style={{ fontSize: 10, color: "var(--db-accent-text)", fontFamily: MONO }}>{m.usage}%</span>
        </div>
        <div style={{ height: 3, background: "var(--db-bg4)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${m.usage}%`, background: "var(--db-blue)", borderRadius: 2, transition: "width 0.6s ease" }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
        {showConfigMsg && (
          <span style={{ fontSize: 12, color: "var(--db-ink-muted)", fontFamily: MONO }}>
            Configuration coming soon
          </span>
        )}
        <button
          onClick={() => setShowConfigMsg(true)}
          style={{
            background: "none", border: "none", color: "var(--db-accent-text)", cursor: "pointer",
            fontSize: 12, padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--db-blue-bright)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--db-blue)")}
        >
          Configure →
        </button>
      </div>
    </div>
  );
}

function AvailableCard({ module: m }: { module: Module }) {
  const catColor = CATEGORY_COLOR[m.category];
  return (
    <div
      style={{
        background: "var(--db-bg2)",
        border: "0.5px solid var(--db-border)",
        borderRadius: 6, padding: 20,
        display: "flex", flexDirection: "column", gap: 0,
        cursor: "default", transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--db-border-hi)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--db-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <IconBox path={m.iconPath} color={m.iconColor} size={38} />
        <span style={{ fontSize: 13, color: "var(--db-ink)", fontFamily: MONO, fontWeight: 500 }}>{m.price}</span>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
          color: catColor,
          padding: "2px 8px", borderRadius: 999, fontFamily: MONO,
          border: "0.5px solid var(--db-border-mid)",
          background: "var(--db-bg3)",
          display: "inline-block",
        }}>
          {m.category}
        </span>
        <TierBadge tier={m.tier} />
      </div>

      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--db-ink)", marginBottom: 8, lineHeight: 1.3 }}>
        {m.name}
      </div>

      <p style={{ fontSize: 13, color: "var(--db-ink-muted)", lineHeight: 1.5, margin: "0 0 16px", flex: 1 }}>
        {m.desc}
      </p>

      <button
        style={{
          width: "100%", background: "var(--db-blue)", color: "#0a0a0a",
          border: "none", borderRadius: 6, padding: "9px 0",
          fontSize: 13, fontWeight: 500, cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--db-blue-bright)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--db-blue)")}
      >
        Get Module
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "48px 0", gridColumn: "1 / -1" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 6, margin: "0 auto 16px",
        background: "var(--db-bg3)", border: "0.5px solid var(--db-border-mid)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <rect x={3} y={3} width={18} height={18} rx={3} stroke="var(--db-ink-muted)" strokeWidth={1.5} />
          <path d="M9 12h6M12 9v6" stroke="var(--db-ink-muted)" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ fontSize: 14, color: "var(--db-ink-muted)" }}>
        No modules in this category yet.
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: "var(--db-ink-muted)", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
      {children}
    </div>
  );
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState(0);
  const filter = TABS[activeTab].filter;

  const installed = MODULES.filter(m => m.installed && (filter === null || m.category === filter));
  const available = MODULES.filter(m => !m.installed && (filter === null || m.category === filter));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--db-ink)", letterSpacing: "-0.02em", margin: "0 0 4px" }}>
            Module Marketplace
          </h1>
          <p style={{ fontSize: 13, color: "var(--db-ink-muted)", margin: 0 }}>
            <span style={{ fontFamily: MONO }}>{MODULES.filter(m => m.installed).length}</span> installed ·{" "}
            <span style={{ fontFamily: MONO }}>{MODULES.filter(m => !m.installed).length}</span> available · Agent-ready
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            background: "transparent", color: "var(--db-ink-muted)",
            border: "0.5px solid var(--db-border)", borderRadius: 6,
            padding: "7px 14px", fontSize: 12, cursor: "pointer",
            transition: "border-color 0.15s, color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--db-border-hi)"; e.currentTarget.style.color = "var(--db-ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--db-border)"; e.currentTarget.style.color = "var(--db-ink-muted)"; }}>
            Filter
          </button>
        </div>
      </div>

      <div style={{
        display: "flex", gap: 6, alignItems: "center",
        marginBottom: 24, flexWrap: "wrap",
        borderBottom: "0.5px solid var(--db-border)",
        paddingBottom: 16,
      }}>
        {TABS.map((tab, i) => {
          const active = activeTab === i;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: active ? 500 : 400,
                background: active ? "var(--db-blue)" : "transparent",
                color: active ? "#0a0a0a" : "var(--db-ink-muted)",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--db-ink)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--db-ink-muted)"; }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {installed.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>Installed</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {installed.map(m => <InstalledCard key={m.id} module={m} />)}
          </div>
        </div>
      )}

      <div>
        <SectionLabel>Available</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {available.length > 0
            ? available.map(m => <AvailableCard key={m.id} module={m} />)
            : installed.length === 0 && <EmptyState />}
        </div>
        {available.length === 0 && installed.length > 0 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 13, color: "var(--db-ink-muted)" }}>
              All modules in this category are installed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
