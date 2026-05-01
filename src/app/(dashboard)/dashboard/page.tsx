"use client";
import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/StatCard";
import AgentCard from "@/components/dashboard/AgentCard";
import LineChart from "@/components/dashboard/LineChart";
import InsightBubble from "@/components/dashboard/InsightBubble";

const MONO = "inherit";
const SANS = "inherit";

const TABS = ["All Agents", "Monitoring", "Paused"];

type AgentStatusValue = "active" | "paused" | "pending";
type AgentRow = {
  id: string;
  name: string;
  category: string;
  score: number;
  signal: string;
  position: string;
  rr: string;
  status: AgentStatusValue;
  statusLabel?: string;
  bars: number[];
  accentColor: string;
};

const INITIAL_AGENTS: AgentRow[] = [
  {
    id: "ALPHA-1", name: "Alpha-1", category: "Equities Momentum", score: 82,
    signal: "Bullish +0.82", position: "NVDA Long · 50sh", rr: "1 : 3.2",
    status: "active",
    bars: [30, 42, 38, 55, 48, 62, 57, 71, 66, 78, 73, 82],
    accentColor: "var(--db-blue)",
  },
  {
    id: "BETA-2", name: "Beta-2", category: "Options Volatility", score: 60,
    signal: "Neutral ±0.41", position: "SPY Covered Call", rr: "1 : 1.8",
    status: "active",
    bars: [55, 60, 52, 58, 63, 57, 61, 59, 64, 60, 58, 60],
    accentColor: "var(--db-amber)",
  },
  {
    id: "GAMMA-3", name: "Gamma-3", category: "Macro Sector Rotation", score: 91,
    signal: "Bullish +0.94", position: "XLK Long · 30sh", rr: "1 : 4.1",
    status: "active",
    bars: [60, 68, 72, 78, 75, 82, 80, 86, 84, 89, 87, 91],
    accentColor: "var(--db-green)",
  },
];

type ModelKey = "claude" | "gpt-4" | "gemini" | "grok" | "openclaw" | "other";
const MODEL_OPTIONS: { key: ModelKey; name: string; desc: string }[] = [
  { key: "claude",   name: "Claude (Anthropic)", desc: "Native MCP support. Fully compatible with all Byzant modules." },
  { key: "gpt-4",    name: "GPT-4 (OpenAI)",     desc: "Fully compatible via MCP-enabled agent frameworks." },
  { key: "gemini",   name: "Gemini (Google)",    desc: "Fully compatible via MCP-enabled agent frameworks." },
  { key: "grok",     name: "Grok (xAI)",         desc: "Fully compatible via MCP-enabled agent frameworks." },
  { key: "openclaw", name: "OpenClaw",           desc: "Open-source autonomous trading agent. Native MCP support." },
  { key: "other",    name: "Other / Custom",     desc: "Any MCP-compatible agent works with Byzant." },
];

const GREEK_IDS = ["DELTA", "EPSILON", "ZETA", "ETA", "THETA", "IOTA", "KAPPA", "LAMBDA", "MU", "NU"];

const TEAL = "#99E1D9";

const PORTFOLIO_PTS = [
  8200, 8500, 8100, 8800, 9100, 8900, 9400, 9700, 9500, 10200, 9800, 10600, 10400, 11000,
];

const INSIGHTS = [
  { label: "Momentum Signal", text: "Alpha-1 detected sustained institutional buying in NVDA. Volume 2.4× average over 3 sessions.", accent: "blue" as const },
  { label: "Risk Alert", text: "Beta-2 options position approaching theta decay threshold. Consider rolling expiry.", accent: "amber" as const },
  { label: "Opportunity", text: "Gamma-3 flagged rotation from XLF into XLK. Sector momentum score 94/100.", accent: "green" as const },
];

const WIDGET_DEFS = [
  { id: "stat-overview",         name: "Stat Overview",          desc: "Key metrics: signal, agents, approvals, modules" },
  { id: "agent-cards",           name: "Agent Cards",             desc: "Live view of all active agents" },
  { id: "portfolio-performance", name: "Portfolio Performance",   desc: "Line chart of agent returns over time" },
  { id: "agent-insights",        name: "Agent Insights",          desc: "AI-generated signals and alerts" },
  { id: "market-heatmap",        name: "Market Heatmap",          desc: "Sector performance at a glance" },
  { id: "risk-monitor",          name: "Risk Monitor",            desc: "Real-time drawdown and exposure tracker" },
];

const LS_KEY = "db_widgets_v1";
const DEFAULT_VISIBLE = WIDGET_DEFS.map(w => w.id);

function loadVisible(): string[] {
  if (typeof window === "undefined") return DEFAULT_VISIBLE;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_VISIBLE;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_VISIBLE;
  } catch {
    return DEFAULT_VISIBLE;
  }
}

// Wrapper that shows a remove (×) button on hover
function Widget({ id, onRemove, children }: { id: string; onRemove: (id: string) => void; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <button
          onClick={() => onRemove(id)}
          style={{
            position: "absolute", top: 10, right: 10, zIndex: 10,
            width: 22, height: 22, borderRadius: 6,
            background: "var(--db-bg4)", border: "0.5px solid var(--db-border-mid)",
            color: "var(--db-ink-muted)", fontSize: 13, lineHeight: 1,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: SANS,
          }}
        >
          ×
        </button>
      )}
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE);

  // New Agent modal state
  const [customAgents, setCustomAgents] = useState<AgentRow[]>([]);
  const [newAgentOpen, setNewAgentOpen] = useState(false);
  const [newAgentStep, setNewAgentStep] = useState<1 | 2 | 3>(1);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentModel, setNewAgentModel] = useState<ModelKey | null>(null);

  function openNewAgent() {
    setNewAgentStep(1);
    setNewAgentName("");
    setNewAgentModel(null);
    setNewAgentOpen(true);
  }

  function closeNewAgent() {
    setNewAgentOpen(false);
  }

  function launchAgent() {
    if (!newAgentModel || newAgentName.trim().length === 0) return;
    const trimmed = newAgentName.trim();
    const idx = customAgents.length;
    const greekIdx = idx < GREEK_IDS.length ? GREEK_IDS[idx] : `AGENT`;
    const id = `${greekIdx}-${idx + 4}`;
    const modelName = MODEL_OPTIONS.find(m => m.key === newAgentModel)?.name ?? "Unknown";
    const next: AgentRow = {
      id,
      name: trimmed,
      category: modelName,
      score: 0,
      signal: "—",
      position: "—",
      rr: "—",
      status: "pending",
      statusLabel: "Configuring…",
      bars: Array(12).fill(0),
      accentColor: "var(--db-blue)",
    };
    setCustomAgents(prev => [...prev, next]);
    closeNewAgent();
  }

  // Load from localStorage on mount
  useEffect(() => {
    setVisible(loadVisible());
  }, []);

  function saveVisible(next: string[]) {
    setVisible(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  function removeWidget(id: string) {
    saveVisible(visible.filter(v => v !== id));
  }

  function toggleWidget(id: string) {
    if (visible.includes(id)) {
      saveVisible(visible.filter(v => v !== id));
    } else {
      // Re-add in canonical order
      saveVisible(WIDGET_DEFS.map(w => w.id).filter(wid => wid === id || visible.includes(wid)));
    }
  }

  const show = (id: string) => visible.includes(id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--db-ink)", letterSpacing: "-0.02em", margin: 0, fontFamily: SANS }}>
              Agent Dashboard
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: "var(--db-green)",
                display: "inline-block", animation: "db-pulse 2s infinite",
              }} />
              <span style={{ fontSize: 11, color: "var(--db-green)", fontFamily: MONO, letterSpacing: "0.06em" }}>LIVE</span>
            </div>
          </div>
          <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: "4px 0 0", fontFamily: SANS }}>3 agents active · Last updated just now</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            background: "transparent", color: "var(--db-ink-muted)",
            border: "1px solid var(--db-border)", borderRadius: 8,
            padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer",
            fontFamily: SANS, transition: "border-color 0.15s, color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--db-border-mid)"; e.currentTarget.style.color = "var(--db-ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--db-border)"; e.currentTarget.style.color = "var(--db-ink-muted)"; }}
          >
            Export Report
          </button>
          <button
            onClick={openNewAgent}
            style={{
              background: "var(--db-blue)", color: "#0a0a0a",
              border: "none", borderRadius: 8,
              padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: SANS, transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            + New Agent
          </button>
        </div>
      </div>

      {/* Stat cards */}
      {show("stat-overview") && (
        <Widget id="stat-overview" onRemove={removeWidget}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            <StatCard label="Agent Consensus" value="Bullish" sub="Composite score 0.87" accent="green" />
            <StatCard label="Active Agents" value="3" sub="All systems nominal" accent="blue" />
            <StatCard label="Pending Approvals" value="3" sub="Require your review" accent="amber" />
            <StatCard label="Modules Active" value="7" sub="Across all agents" accent="blue" />
          </div>
        </Widget>
      )}

      {/* Tabs + Add Widget button */}
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--db-border)" }}>
        <div style={{ display: "flex", gap: 0, flex: 1 }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 16px", fontSize: 13, fontWeight: activeTab === i ? 500 : 400,
                color: activeTab === i ? "var(--db-accent-text)" : "var(--db-ink-muted)",
                borderBottom: `2px solid ${activeTab === i ? "var(--db-blue)" : "transparent"}`,
                marginBottom: -1, transition: "color 0.15s",
                fontFamily: SANS,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: "#99E1D9", color: "#0a0a0a", border: "none",
            borderRadius: 8, padding: "8px 18px",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            fontFamily: SANS, marginBottom: -1,
          }}
        >
          Add Widget +
        </button>
      </div>

      {/* Agent cards */}
      {show("agent-cards") && (
        <Widget id="agent-cards" onRemove={removeWidget}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[...INITIAL_AGENTS, ...customAgents].map(a => <AgentCard key={a.id} {...a} />)}
          </div>
        </Widget>
      )}

      {/* Bottom 2-col */}
      {(show("portfolio-performance") || show("agent-insights")) && (
        <div style={{ display: "grid", gridTemplateColumns: show("portfolio-performance") && show("agent-insights") ? "1fr 380px" : "1fr", gap: 14 }}>
          {/* Portfolio chart */}
          {show("portfolio-performance") && (
            <Widget id="portfolio-performance" onRemove={removeWidget}>
              <div style={{
                background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
                borderRadius: 6, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>Portfolio Performance</div>
                    <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, marginTop: 2 }}>Last 14 sessions</div>
                  </div>
                  <div style={{
                    fontSize: 18, fontWeight: 700, color: "var(--db-green)",
                    fontFamily: MONO, letterSpacing: "-0.02em",
                  }}>+12.4%</div>
                </div>
                <LineChart points={PORTFOLIO_PTS} color="var(--db-blue)" height={260} />
              </div>
            </Widget>
          )}

          {/* Agent insights */}
          {show("agent-insights") && (
            <Widget id="agent-insights" onRemove={removeWidget}>
              <div style={{
                background: "var(--db-bg2)", border: "0.5px solid var(--db-border)",
                borderRadius: 6, padding: 20,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--db-ink)", marginBottom: 4, fontFamily: SANS }}>Agent Insights</div>
                {INSIGHTS.map(ins => (
                  <InsightBubble key={ins.label} label={ins.label} text={ins.text} accent={ins.accent} />
                ))}
              </div>
            </Widget>
          )}
        </div>
      )}

      {/* Add Widget Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--db-bg2)",
              border: "0.5px solid var(--db-border-hi)",
              borderRadius: 16, padding: 24, width: 480,
              display: "flex", flexDirection: "column", gap: 20,
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 18, fontWeight: 500, color: "var(--db-ink)", fontFamily: SANS }}>Add Widget</span>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 18, color: "var(--db-ink-muted)", lineHeight: 1,
                  fontFamily: SANS, padding: "2px 6px",
                }}
              >
                ×
              </button>
            </div>

            {/* Widget list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {WIDGET_DEFS.map(w => {
                const active = visible.includes(w.id);
                return (
                  <div
                    key={w.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px",
                      background: "var(--db-bg3)",
                      border: "0.5px solid var(--db-border)",
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 400, color: "var(--db-ink)", fontFamily: SANS }}>{w.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 400, color: "var(--db-ink-muted)", fontFamily: SANS, marginTop: 2 }}>{w.desc}</div>
                    </div>
                    <button
                      onClick={() => toggleWidget(w.id)}
                      style={{
                        flexShrink: 0, marginLeft: 16,
                        background: active ? "var(--db-green-dim)" : "#99E1D9",
                        color: active ? "var(--db-green)" : "#0a0a0a",
                        border: active ? "1px solid rgba(61,214,140,0.3)" : "none",
                        borderRadius: 7, padding: "6px 14px",
                        fontSize: 12, fontWeight: 500, cursor: "pointer",
                        fontFamily: SANS,
                      }}
                    >
                      {active ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* New Agent Modal */}
      {newAgentOpen && (
        <NewAgentModal
          step={newAgentStep}
          name={newAgentName}
          model={newAgentModel}
          onClose={closeNewAgent}
          onNameChange={setNewAgentName}
          onModelChange={setNewAgentModel}
          onStepChange={setNewAgentStep}
          onLaunch={launchAgent}
        />
      )}
    </div>
  );
}

function ProgressDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1, 2, 3].map(i => {
        const active = i === step;
        const done = i < step;
        return (
          <span
            key={i}
            style={{
              width: active ? 22 : 6,
              height: 6,
              borderRadius: 999,
              background: active ? TEAL : done ? "rgba(153,225,217,0.45)" : "var(--db-border)",
              transition: "width 0.2s ease, background 0.2s ease",
            }}
          />
        );
      })}
    </div>
  );
}

function NewAgentModal({
  step, name, model, onClose, onNameChange, onModelChange, onStepChange, onLaunch,
}: {
  step: 1 | 2 | 3;
  name: string;
  model: ModelKey | null;
  onClose: () => void;
  onNameChange: (v: string) => void;
  onModelChange: (k: ModelKey) => void;
  onStepChange: (s: 1 | 2 | 3) => void;
  onLaunch: () => void;
}) {
  const trimmed = name.trim();
  const canNext1 = trimmed.length > 0;
  const canNext2 = model !== null;

  const titles: Record<1 | 2 | 3, string> = {
    1: "Name your agent",
    2: "Which model powers this agent?",
    3: "Ready to launch?",
  };

  const selectedModel = MODEL_OPTIONS.find(m => m.key === model);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--db-bg2)",
          border: "0.5px solid var(--db-border-hi)",
          borderRadius: 16, padding: 24, width: 480,
          display: "flex", flexDirection: "column", gap: 20,
          fontFamily: SANS,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
            <span style={{
              fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--db-ink-muted)",
            }}>
              Step {step} of 3
            </span>
            <span style={{ fontSize: 16, fontWeight: 500, color: "var(--db-ink)", lineHeight: 1.3 }}>
              {titles[step]}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ProgressDots step={step} />
            <button
              onClick={onClose}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 18, color: "var(--db-ink-muted)", lineHeight: 1,
                fontFamily: SANS, padding: "2px 6px",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Step body */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              autoFocus
              value={name}
              onChange={e => onNameChange(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && canNext1) onStepChange(2); }}
              placeholder="e.g. Momentum Bot"
              maxLength={20}
              style={{
                background: "var(--db-bg3)",
                border: "1px solid var(--db-border)",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 14,
                color: "var(--db-ink)",
                outline: "none",
                fontFamily: SANS,
                transition: "border-color 0.15s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--db-border-mid)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
            />
            <div style={{
              display: "flex", justifyContent: "flex-end",
              fontSize: 11, color: "var(--db-ink-faint)", fontFamily: SANS,
            }}>
              {name.length}/20
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MODEL_OPTIONS.map(opt => {
              const selected = model === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onModelChange(opt.key)}
                  style={{
                    textAlign: "left",
                    background: selected ? "rgba(153,225,217,0.10)" : "var(--db-bg3)",
                    border: "1px solid " + (selected ? TEAL : "var(--db-border)"),
                    borderRadius: 8,
                    padding: "12px 14px",
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    fontFamily: SANS,
                  }}
                  onMouseEnter={e => {
                    if (!selected) e.currentTarget.style.borderColor = "var(--db-border-hi)";
                  }}
                  onMouseLeave={e => {
                    if (!selected) e.currentTarget.style.borderColor = "var(--db-border)";
                  }}
                >
                  <span style={{ flex: 1 }}>
                    <span style={{
                      display: "block", fontSize: 13, fontWeight: 500,
                      color: "var(--db-ink)", marginBottom: 2,
                    }}>
                      {opt.name}
                    </span>
                    <span style={{
                      fontSize: 12, color: "var(--db-ink-muted)",
                      lineHeight: 1.45, display: "block",
                    }}>
                      {opt.desc}
                    </span>
                  </span>
                  <span style={{
                    width: 16, height: 16, borderRadius: 999,
                    border: "1px solid " + (selected ? TEAL : "var(--db-border-hi)"),
                    flexShrink: 0, marginTop: 2,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {selected && (
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: TEAL }} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <div style={{
            background: "var(--db-bg3)",
            border: "0.5px solid var(--db-border)",
            borderRadius: 10,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(153,225,217,0.10)",
                border: "1px solid var(--db-border-mid)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" fill={TEAL} fillOpacity={0.8} />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" fill={TEAL} fillOpacity={0.4} />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" fill={TEAL} fillOpacity={0.4} />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" fill={TEAL} fillOpacity={0.65} />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--db-ink)" }}>
                  {trimmed || "Untitled agent"}
                </span>
                <span style={{ fontSize: 12, color: "var(--db-ink-muted)" }}>
                  {selectedModel?.name ?? "—"}
                </span>
              </div>
            </div>
            <span style={{ fontSize: 12, color: "var(--db-ink-muted)", lineHeight: 1.5 }}>
              The agent will be created and start configuring. You can adjust modules and risk settings once it&apos;s active.
            </span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          {step === 1 ? (
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          ) : (
            <SecondaryButton onClick={() => onStepChange((step - 1) as 1 | 2 | 3)}>← Back</SecondaryButton>
          )}
          {step === 1 && (
            <PrimaryButton disabled={!canNext1} onClick={() => onStepChange(2)}>Next →</PrimaryButton>
          )}
          {step === 2 && (
            <PrimaryButton disabled={!canNext2} onClick={() => onStepChange(3)}>Next →</PrimaryButton>
          )}
          {step === 3 && (
            <PrimaryButton onClick={onLaunch}>Launch Agent</PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({
  children, onClick, disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        background: TEAL,
        color: "#0a0a0a",
        border: "none",
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: SANS,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children, onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: "var(--db-ink-muted)",
        border: "1px solid var(--db-border)",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: SANS,
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--db-border-mid)";
        e.currentTarget.style.color = "var(--db-ink)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--db-border)";
        e.currentTarget.style.color = "var(--db-ink-muted)";
      }}
    >
      {children}
    </button>
  );
}
