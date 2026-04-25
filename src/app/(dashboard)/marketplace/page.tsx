"use client";
import { useState } from "react";

const MONO = "inherit";

type ModuleCategory = "Data Feeds" | "Analytics" | "Risk" | "Execution" | "Memory";

interface Module {
  id: string;
  name: string;
  category: ModuleCategory;
  desc: string;
  price: string;
  installed: boolean;
  usage?: number;
  iconPath: string;
  iconColor: string;
}

const MODULES: Module[] = [
  {
    id: "rtmd", name: "Real-Time Market Data", category: "Data Feeds",
    desc: "Sub-millisecond quotes, level 2 order book, and options flow direct to your agent.",
    price: "$9/mo", installed: true, usage: 72,
    iconPath: "M2 12l4-4 3 3 5-6 4 4", iconColor: "#99E1D9",
  },
  {
    id: "tae", name: "Technical Analysis Engine", category: "Analytics",
    desc: "200+ indicators, pattern recognition, and signal generation built for agent consumption.",
    price: "$29/mo", installed: true, usage: 58,
    iconPath: "M3 16l4-5 4 3 4-6 4 3", iconColor: "#B2EBE5",
  },
  {
    id: "rms", name: "Risk Management Suite", category: "Risk",
    desc: "Dynamic position sizing, drawdown controls, and real-time portfolio risk scoring.",
    price: "$29/mo", installed: true, usage: 45,
    iconPath: "M12 3l9 7-9 7-9-7 9-7zM3 17l9 4 9-4", iconColor: "#f0b429",
  },
  {
    id: "ael", name: "Alpaca Execution Layer", category: "Execution",
    desc: "TWAP, VWAP, and iceberg order strategies with slippage optimization and fill reporting.",
    price: "$9/mo", installed: true, usage: 31,
    iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", iconColor: "#99E1D9",
  },
  {
    id: "dpm", name: "Dark Pool Monitor", category: "Analytics",
    desc: "Institutional block trades, dark pool prints, and unusual activity alerts.",
    price: "$29/mo", installed: false,
    iconPath: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6", iconColor: "#B2EBE5",
  },
  {
    id: "nsf", name: "News & Sentiment Feed", category: "Data Feeds",
    desc: "Real-time news parsing, sentiment scoring, and earnings signal detection.",
    price: "$9/mo", installed: false,
    iconPath: "M4 6h16M4 10h16M4 14h10", iconColor: "#99E1D9",
  },
  {
    id: "be", name: "Backtesting Engine", category: "Analytics",
    desc: "Historical strategy validation with walk-forward testing and Monte Carlo simulation.",
    price: "$99/mo", installed: false,
    iconPath: "M3 3h18v18H3zM9 3v18M3 9h6M3 15h6", iconColor: "#B2EBE5",
  },
  {
    id: "ofs", name: "Options Flow Scanner", category: "Analytics",
    desc: "Unusual options activity, sweep detection, and institutional positioning signals.",
    price: "$29/mo", installed: false,
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2", iconColor: "#B2EBE5",
  },
  {
    id: "amc", name: "Agent Memory & Context", category: "Memory",
    desc: "Persistent memory layer for your agents — learn from past trades, adapt over time.",
    price: "$29/mo", installed: false,
    iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z", iconColor: "#94a3b8",
  },
];

const TABS: Array<{ label: string; filter: ModuleCategory | null }> = [
  { label: "All", filter: null },
  { label: "Data Feeds", filter: "Data Feeds" },
  { label: "Analytics", filter: "Analytics" },
  { label: "Risk", filter: "Risk" },
  { label: "Execution", filter: "Execution" },
  { label: "Memory", filter: "Memory" },
];

const CATEGORY_COLOR: Record<ModuleCategory, string> = {
  "Data Feeds": "var(--db-blue)",
  "Analytics": "var(--db-blue-bright)",
  "Risk": "var(--db-amber)",
  "Execution": "var(--db-blue)",
  "Memory": "var(--db-ink-muted)",
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

function InstalledCard({ module: m }: { module: Module }) {
  const catColor = CATEGORY_COLOR[m.category];
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
            <span style={{
              fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
              color: catColor,
              padding: "2px 8px", borderRadius: 999, fontFamily: MONO,
              border: "0.5px solid var(--db-border-mid)",
              background: "var(--db-bg3)",
            }}>
              {m.category}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "var(--db-blue)", fontFamily: MONO }}>{m.price}</span>
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
          <span style={{ fontSize: 10, color: "var(--db-blue)", fontFamily: MONO }}>{m.usage}%</span>
        </div>
        <div style={{ height: 3, background: "var(--db-bg4)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${m.usage}%`, background: "var(--db-blue)", borderRadius: 2, transition: "width 0.6s ease" }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{
          background: "none", border: "none", color: "var(--db-blue)", cursor: "pointer",
          fontSize: 12, padding: 0,
          transition: "color 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--db-blue-bright)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--db-blue)")}>
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

      <span style={{
        fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
        color: catColor,
        padding: "2px 8px", borderRadius: 999, fontFamily: MONO,
        border: "0.5px solid var(--db-border-mid)",
        background: "var(--db-bg3)",
        display: "inline-block", marginBottom: 10, alignSelf: "flex-start",
      }}>
        {m.category}
      </span>

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
            Submit Module
          </button>
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
