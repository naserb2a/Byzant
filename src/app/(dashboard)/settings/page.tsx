"use client";
import { useState } from "react";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

const CARD: React.CSSProperties = {
  background: "#0F0F0F",
  border: "0.5px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 24,
  marginBottom: 24,
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 15, fontWeight: 500, color: "#F5F5F5",
  fontFamily: SANS, marginBottom: 20,
};

const LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "var(--db-ink-muted)",
  fontFamily: MONO, marginBottom: 6, display: "block",
};

const INPUT: React.CSSProperties = {
  width: "100%", background: "var(--db-bg3)",
  border: "0.5px solid var(--db-border)",
  borderRadius: 8, padding: "9px 12px",
  fontSize: 13, color: "var(--db-ink)",
  fontFamily: SANS, outline: "none",
  boxSizing: "border-box",
};

const SAVE_BTN: React.CSSProperties = {
  background: "#99E1D9", color: "#fff", border: "none",
  borderRadius: 8, padding: "9px 20px",
  fontSize: 13, fontWeight: 500, cursor: "pointer",
  fontFamily: SANS, marginTop: 20,
};

const DANGER_BTN: React.CSSProperties = {
  background: "transparent", color: "#ff5a5a",
  border: "0.5px solid rgba(255,90,90,0.3)",
  borderRadius: 8, padding: "9px 20px",
  fontSize: 13, fontWeight: 500, cursor: "pointer",
  fontFamily: SANS,
};

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: on ? "#99E1D9" : "var(--db-bg4)",
        border: `1px solid ${on ? "rgba(153,225,217,0.4)" : "var(--db-border-mid)"}`,
        cursor: "pointer", padding: 0, position: "relative",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: on ? 21 : 3,
        width: 14, height: 14, borderRadius: "50%",
        background: on ? "#fff" : "var(--db-ink-muted)",
        transition: "left 0.2s",
        display: "block",
      }} />
    </button>
  );
}

function ToggleRow({ label, desc, on, onChange }: {
  label: string; desc?: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, padding: "13px 0",
      borderBottom: "0.5px solid var(--db-border)",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink)", fontFamily: SANS }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, marginTop: 3 }}>{desc}</div>}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  // Profile
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Agent Preferences
  const [approveAllTrades, setApproveAllTrades] = useState(true);
  const [approveModules, setApproveModules] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [activityDigest, setActivityDigest] = useState(false);

  // Risk Limits
  const [maxPosition, setMaxPosition] = useState("");
  const [dailyLoss, setDailyLoss] = useState("");
  const [maxOpenPos, setMaxOpenPos] = useState("");

  // Appearance
  const [compactView, setCompactView] = useState(false);
  const [showBarCharts, setShowBarCharts] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--db-ink)", letterSpacing: "-0.02em", margin: "0 0 4px", fontFamily: SANS }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: 0, fontFamily: SANS }}>
          Manage your profile, agent preferences, and risk controls
        </p>
      </div>

      {/* Top 2-col: Profile + Agent Preferences */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* 1. PROFILE */}
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL}>Full Name</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nas"
                style={INPUT}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
            <div>
              <label style={LABEL}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nas@byzant.ai"
                style={INPUT}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
          </div>
          <button style={SAVE_BTN}>Save Changes</button>
        </div>

        {/* 4. APPEARANCE — short card, pairs well with Profile */}
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Appearance</div>
          <div style={{ marginTop: -8 }}>
            <ToggleRow
              label="Compact view"
              desc="Reduce spacing and card sizes across the dashboard"
              on={compactView}
              onChange={setCompactView}
            />
            <ToggleRow
              label="Show mini bar charts on agent cards"
              desc="Display the activity sparkline at the bottom of each agent card"
              on={showBarCharts}
              onChange={setShowBarCharts}
            />
          </div>
        </div>
      </div>

      {/* Mid 2-col: Agent Preferences + Risk Limits */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* 2. AGENT PREFERENCES */}
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Agent Preferences</div>
          <div style={{ marginTop: -8 }}>
            <ToggleRow
              label="Require approval for all trades"
              desc="Agents must wait for your confirmation before executing any trade"
              on={approveAllTrades}
              onChange={setApproveAllTrades}
            />
            <ToggleRow
              label="Require approval for module installs"
              desc="Agents must request your approval before activating new modules"
              on={approveModules}
              onChange={setApproveModules}
            />
            <ToggleRow
              label="Email notifications for pending approvals"
              desc="Receive an email when an agent is waiting for your review"
              on={emailNotifs}
              onChange={setEmailNotifs}
            />
            <ToggleRow
              label="Agent activity digest — daily summary"
              desc="Get a daily email summarising all agent actions and outcomes"
              on={activityDigest}
              onChange={setActivityDigest}
            />
          </div>
        </div>

        {/* 3. RISK LIMITS */}
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Risk Limits</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL}>Max Position Size</label>
              <input
                value={maxPosition}
                onChange={e => setMaxPosition(e.target.value)}
                placeholder="$10,000"
                style={INPUT}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
            <div>
              <label style={LABEL}>Daily Loss Limit</label>
              <input
                value={dailyLoss}
                onChange={e => setDailyLoss(e.target.value)}
                placeholder="$500"
                style={INPUT}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
            <div>
              <label style={LABEL}>Max Open Positions</label>
              <input
                value={maxOpenPos}
                onChange={e => setMaxOpenPos(e.target.value)}
                placeholder="5"
                style={INPUT}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
          </div>
          <button style={SAVE_BTN}>Save Risk Settings</button>
        </div>
      </div>

      {/* 5. DANGER ZONE — full width */}
      <div style={{ ...CARD, marginBottom: 0, border: "0.5px solid rgba(255,90,90,0.15)" }}>
        <div style={{ ...SECTION_TITLE, color: "#ff5a5a" }}>Danger Zone</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink)", fontFamily: SANS }}>Reset all widget layouts</div>
              <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, marginTop: 3 }}>Restore the default dashboard widget arrangement</div>
            </div>
            <button style={{ ...DANGER_BTN, flexShrink: 0 }}>Reset</button>
          </div>
          <div style={{ borderTop: "0.5px solid rgba(255,90,90,0.15)", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink)", fontFamily: SANS }}>Sign out</div>
              <div style={{ fontSize: 11, color: "var(--db-ink-muted)", fontFamily: MONO, marginTop: 3 }}>End your current session</div>
            </div>
            <button style={{ ...DANGER_BTN, flexShrink: 0 }}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
