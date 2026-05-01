"use client";
import { useState } from "react";
import { useTheme } from "@/components/dashboard/ThemeProvider";

const CARD: React.CSSProperties = {
  background: "var(--db-bg2)",
  border: "0.5px solid var(--db-border)",
  borderRadius: 6,
  padding: 20,
  marginBottom: 16,
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "var(--db-ink)",
  marginBottom: 16,
};

const LABEL: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--db-ink-muted)",
  marginBottom: 6,
  display: "block",
};

const INPUT: React.CSSProperties = {
  width: "100%",
  background: "var(--db-bg3)",
  border: "0.5px solid var(--db-border)",
  borderRadius: 6,
  padding: "9px 12px",
  fontSize: 13,
  color: "var(--db-ink)",
  outline: "none",
  boxSizing: "border-box",
};

const SAVE_BTN: React.CSSProperties = {
  background: "#99E1D9",
  color: "#0a0a0a",
  border: "none",
  borderRadius: 6,
  padding: "9px 20px",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  marginTop: 16,
};

const DANGER_BTN: React.CSSProperties = {
  background: "transparent",
  color: "var(--db-red)",
  border: "0.5px solid rgba(255,90,90,0.3)",
  borderRadius: 6,
  padding: "9px 20px",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        flexShrink: 0,
        background: on ? "#99E1D9" : "var(--db-bg4)",
        border: `1px solid ${on ? "rgba(153,225,217,0.4)" : "var(--db-border-mid)"}`,
        cursor: "pointer",
        padding: 0,
        position: "relative",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 21 : 3,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: on ? "#0a0a0a" : "var(--db-ink-muted)",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );
}

function ToggleRow({
  label,
  desc,
  on,
  onChange,
}: {
  label: string;
  desc?: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "13px 0",
        borderBottom: "0.5px solid var(--db-border)",
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink)" }}>{label}</div>
        {desc && (
          <div style={{ fontSize: 12, color: "var(--db-ink-muted)", marginTop: 3 }}>{desc}</div>
        )}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function ThemeSegment({
  theme,
  setTheme,
}: {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}) {
  const options: { key: "dark" | "light"; label: string }[] = [
    { key: "dark", label: "Dark" },
    { key: "light", label: "Light" },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        padding: 3,
        background: "var(--db-bg3)",
        border: "0.5px solid var(--db-border)",
        borderRadius: 6,
        gap: 2,
      }}
    >
      {options.map((o) => {
        const active = theme === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setTheme(o.key)}
            style={{
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: active ? 500 : 400,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: active ? "rgba(153,225,217,0.12)" : "transparent",
              color: active ? "var(--db-accent-text)" : "var(--db-ink-muted)",
              transition: "background 0.12s, color 0.12s",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [approveModules, setApproveModules] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [activityDigest, setActivityDigest] = useState(false);

  const [maxPosition, setMaxPosition] = useState("");
  const [dailyLoss, setDailyLoss] = useState("");
  const [maxOpenPos, setMaxOpenPos] = useState("");

  const [compactView, setCompactView] = useState(false);
  const [showBarCharts, setShowBarCharts] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "var(--db-ink)",
            letterSpacing: "-0.02em",
            margin: "0 0 4px",
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink-muted)", margin: 0 }}>
          Manage your profile, agent preferences, and risk controls
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL}>Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nas"
                style={INPUT}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
            <div>
              <label style={LABEL}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nas@byzant.ai"
                style={INPUT}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
          </div>
          <button style={SAVE_BTN}>Save Changes</button>
        </div>

        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Appearance</div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "13px 0",
              borderBottom: "0.5px solid var(--db-border)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink)" }}>Theme</div>
              <div style={{ fontSize: 12, color: "var(--db-ink-muted)", marginTop: 3 }}>
                Choose between dark and light mode
              </div>
            </div>
            <ThemeSegment theme={theme} setTheme={setTheme} />
          </div>

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Agent Preferences</div>
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

        <div style={{ ...CARD, marginBottom: 0 }}>
          <div style={SECTION_TITLE}>Risk Limits</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL}>Max Position Size</label>
              <input
                value={maxPosition}
                onChange={(e) => setMaxPosition(e.target.value)}
                placeholder="$10,000"
                style={INPUT}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
            <div>
              <label style={LABEL}>Daily Loss Limit</label>
              <input
                value={dailyLoss}
                onChange={(e) => setDailyLoss(e.target.value)}
                placeholder="$500"
                style={INPUT}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
            <div>
              <label style={LABEL}>Max Open Positions</label>
              <input
                value={maxOpenPos}
                onChange={(e) => setMaxOpenPos(e.target.value)}
                placeholder="5"
                style={INPUT}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--db-border-hi)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--db-border)")}
              />
            </div>
          </div>
          <button style={SAVE_BTN}>Save Risk Settings</button>
        </div>
      </div>

      <div style={{ ...CARD, marginBottom: 0, border: "0.5px solid rgba(255,90,90,0.15)" }}>
        <div style={{ ...SECTION_TITLE, color: "var(--db-red)" }}>Danger Zone</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink)" }}>
                Reset all widget layouts
              </div>
              <div style={{ fontSize: 12, color: "var(--db-ink-muted)", marginTop: 3 }}>
                Restore the default dashboard widget arrangement
              </div>
            </div>
            <button style={{ ...DANGER_BTN, flexShrink: 0 }}>Reset</button>
          </div>
          <div
            style={{
              borderTop: "0.5px solid rgba(255,90,90,0.15)",
              paddingTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 400, color: "var(--db-ink)" }}>Sign out</div>
              <div style={{ fontSize: 12, color: "var(--db-ink-muted)", marginTop: 3 }}>
                End your current session
              </div>
            </div>
            <button style={{ ...DANGER_BTN, flexShrink: 0 }}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
