"use client";

import { useRef, useState } from "react";

/* ─── Tokens ──────────────────────────────────────────────────── */
const SYS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const TEAL = "#99E1D9";
const GREEN = "#4ade80";
const YELLOW = "#fbbf24";
const AMBER = "#f0b429";
const RED = "#f87171";
const SHELL = "#0a0a0a";
const SIDEBAR = "#111111";
const CONTENT = "#0d0d0d";
const SURFACE = "#161616";
const BORDER = "rgba(255,255,255,0.06)";
const BORDER_STRONG = "rgba(255,255,255,0.1)";
const INK = "#ffffff";
const MUTED = "#94a3b8";
const FAINT = "#666666";
const GRID_LINE = "rgba(255,255,255,0.04)";

const DEMO_HEIGHT = 720;
const TOPBAR_HEIGHT = 36;

/* ─── Smooth bezier path through points ───────────────────────── */
function smoothPath(points: [number, number][], tension = 0.18): string {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i === points.length - 2 ? points[i + 1] : points[i + 2];
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/* ─── Inline icons ────────────────────────────────────────────── */
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
function ArrowRightIcon({ size = 11, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}
function WavesIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <path d="M2 6c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M2 12c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M2 18c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2" />
    </svg>
  );
}
function LandmarkIcon({ size = 14, color = "currentColor" }: IconProps) {
  return (
    <svg {...baseSvg(size, color)}>
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <polyline points="3 11 12 4 21 11" />
      <line x1="6" y1="11" x2="6" y2="22" />
      <line x1="10" y1="11" x2="10" y2="22" />
      <line x1="14" y1="11" x2="14" y2="22" />
      <line x1="18" y1="11" x2="18" y2="22" />
    </svg>
  );
}

/* ─── Types ───────────────────────────────────────────────────── */
type ViewKey =
  | "approvals"
  | "dashboard"
  | "marketplace"
  | "analytics"
  | "log"
  | "whale"
  | "congress";
type AgentKey = "alpha" | "gamma" | "beta";
type ApprovalStatus = "pending" | "approved" | "declined";

type Agent = {
  key: AgentKey;
  label: string;
  header: string;
  description: string;
  metrics: [string, string][];
  spark: [number, number][];
  reasoning: { observation: string; pattern: string; action: string };
};

type ModuleCategory = "DATA FEEDS" | "RISK" | "EXECUTION" | "ANALYTICS";
type ModuleRow = {
  id: string;
  name: string;
  category: ModuleCategory;
  price: string;
  desc: string;
  usage?: number;
  installedByDefault: boolean;
};

type RangeKey = "1W" | "1M" | "3M" | "6M";
type ChartPoint = { x: number; y: number; value: number };

type LogEvent = {
  time: string;
  status: "Success" | "Pending" | "Declined";
  action: string;
  agent: string;
  ticker: string;
  details: string;
};

/* ─── Static data ─────────────────────────────────────────────── */
const NAV: { key: ViewKey; label: string; Icon: React.ComponentType<IconProps>; badge?: number }[] = [
  { key: "dashboard", label: "Dashboard", Icon: GridIcon },
  { key: "approvals", label: "Approvals", Icon: CheckIcon, badge: 3 },
  { key: "marketplace", label: "Marketplace", Icon: StoreIcon },
  { key: "whale", label: "Whale Tracker", Icon: WavesIcon },
  { key: "congress", label: "Congressional Tracker", Icon: LandmarkIcon },
  { key: "analytics", label: "Analytics", Icon: ChartIcon },
  { key: "log", label: "Agent Log", Icon: ListIcon },
];

const AGENTS: Agent[] = [
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
    spark: [
      [0, 26],
      [28, 22],
      [56, 18],
      [84, 14],
      [112, 10],
      [140, 4],
    ],
    reasoning: {
      observation:
        "Whale tracker flagged $1.84M call volume on NVDA Jul-17 $125 strike at 14:32 UTC. 44.18 vol-to-OI ratio.",
      pattern:
        "Aligns with bullish momentum breakout — last 3 setups returned avg +5.2% within 7 sessions.",
      action:
        "Long 50sh @ $118.40, $113.20 stop, $134 target. R/R 1:3.2 · sized to 4% portfolio.",
    },
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
    spark: [
      [0, 12],
      [28, 18],
      [56, 10],
      [84, 14],
      [112, 6],
      [140, 8],
    ],
    reasoning: {
      observation:
        "Dark pool prints exceeded 2.5σ on 4 of last 7 sessions. Current data feed misses ~38% of institutional flow.",
      pattern:
        "Module-augmented agents historically gained +11% edge on Russell-3000 names with high block activity.",
      action:
        "Activate Dark Pool Monitor for $29/mo. Integrates immediately into the signal pipeline.",
    },
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
    spark: [
      [0, 14],
      [28, 16],
      [56, 13],
      [84, 17],
      [112, 14],
      [140, 12],
    ],
    reasoning: {
      observation:
        "SPY range-bound 480–505 over the last 20 sessions. IV percentile 38th. Dividend cycle current.",
      pattern:
        "Covered calls at 0.30 delta with 14–21 DTE returned avg +1.2% per cycle in similar regimes.",
      action:
        "Sell 3 contracts @ $485 strike, Apr 18 expiry, $2.75 premium. Collateral $8,250.",
    },
  },
];

const DASHBOARD_STATS: { label: string; value: string; valueColor: string; sub: string }[] = [
  { label: "AGENT CONSENSUS", value: "Bullish", valueColor: TEAL, sub: "Composite score 0.87" },
  { label: "ACTIVE AGENTS", value: "3", valueColor: GREEN, sub: "All systems nominal" },
  { label: "PENDING APPROVALS", value: "3", valueColor: TEAL, sub: "Require your review" },
  { label: "MODULES ACTIVE", value: "7", valueColor: INK, sub: "Across all agents" },
];

const DASHBOARD_AGENTS: {
  id: string;
  signal: string;
  signalColor: string;
  pos: string;
  rr: string;
}[] = [
  { id: "Alpha-1", signal: "Bullish +0.82", signalColor: TEAL, pos: "NVDA Long 50sh", rr: "1:3.2" },
  { id: "Beta-2", signal: "Neutral 0.41", signalColor: YELLOW, pos: "SPY Covered Call", rr: "1:1.8" },
  { id: "Gamma-3", signal: "Bullish +0.94", signalColor: TEAL, pos: "XLK Long 30sh", rr: "1:4.1" },
];

/* portfolio chart 600x180 viewBox · y inverts so smaller y = higher value */
type DashboardChartPoint = { x: number; y: number; value: number; date: string };
const DASHBOARD_CHART_DATA: DashboardChartPoint[] = [
  { x: 0, y: 150, value: 9790, date: "Feb 5, 2026" },
  { x: 50, y: 142, value: 9870, date: "Feb 12, 2026" },
  { x: 100, y: 148, value: 9810, date: "Feb 19, 2026" },
  { x: 150, y: 122, value: 10070, date: "Feb 26, 2026" },
  { x: 200, y: 132, value: 9970, date: "Mar 5, 2026" },
  { x: 250, y: 105, value: 10240, date: "Mar 12, 2026" },
  { x: 300, y: 115, value: 10140, date: "Mar 19, 2026" },
  { x: 350, y: 88, value: 10410, date: "Mar 26, 2026" },
  { x: 400, y: 78, value: 10500, date: "Apr 2, 2026" },
  { x: 450, y: 92, value: 10370, date: "Apr 9, 2026" },
  { x: 500, y: 64, value: 10640, date: "Apr 16, 2026" },
  { x: 550, y: 42, value: 10860, date: "Apr 23, 2026" },
  { x: 600, y: 28, value: 11000, date: "May 5, 2026" },
];

const MODULES: ModuleRow[] = [
  {
    id: "whale",
    name: "Whale Tracker",
    category: "DATA FEEDS",
    price: "$29/mo",
    desc: "Real-time options flow and dark pool activity.",
    usage: 72,
    installedByDefault: true,
  },
  {
    id: "congress",
    name: "Congressional Tracker",
    category: "DATA FEEDS",
    price: "$29/mo",
    desc: "Live disclosures from US lawmakers, parsed.",
    usage: 45,
    installedByDefault: true,
  },
  {
    id: "risk",
    name: "Risk Agent",
    category: "RISK",
    price: "$29/mo",
    desc: "Always-on risk enforcement.",
    installedByDefault: false,
  },
  {
    id: "trailing",
    name: "Trailing Stop Bot",
    category: "EXECUTION",
    price: "$9/mo",
    desc: "Automated stop loss management.",
    installedByDefault: false,
  },
  {
    id: "wheel",
    name: "Wheel Strategy Bot",
    category: "EXECUTION",
    price: "$29/mo",
    desc: "Automated wheel options strategy.",
    installedByDefault: false,
  },
  {
    id: "research",
    name: "AI Research Brief",
    category: "ANALYTICS",
    price: "$19/mo",
    desc: "One-click investment memo.",
    installedByDefault: false,
  },
];

function categoryStyle(cat: ModuleCategory): { color: string; bg: string; border: string } {
  switch (cat) {
    case "DATA FEEDS":
      return {
        color: TEAL,
        bg: "rgba(153,225,217,0.1)",
        border: "rgba(153,225,217,0.25)",
      };
    case "RISK":
      return {
        color: AMBER,
        bg: "rgba(240,180,41,0.1)",
        border: "rgba(240,180,41,0.3)",
      };
    case "EXECUTION":
      return {
        color: "#cbd5e1",
        bg: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.16)",
      };
    case "ANALYTICS":
      return {
        color: TEAL,
        bg: "rgba(153,225,217,0.06)",
        border: "rgba(153,225,217,0.18)",
      };
  }
}

/* analytics chart datasets · 600x200 viewBox */
const ANALYTICS_DATA: Record<RangeKey, ChartPoint[]> = {
  "1W": [
    { x: 0, y: 150, value: 10980 },
    { x: 100, y: 142, value: 11050 },
    { x: 200, y: 132, value: 11150 },
    { x: 300, y: 110, value: 11400 },
    { x: 400, y: 95, value: 11580 },
    { x: 500, y: 80, value: 11700 },
    { x: 600, y: 56, value: 11840 },
  ],
  "1M": [
    { x: 0, y: 162, value: 10780 },
    { x: 50, y: 158, value: 10820 },
    { x: 100, y: 148, value: 10920 },
    { x: 150, y: 134, value: 11020 },
    { x: 200, y: 142, value: 10960 },
    { x: 250, y: 122, value: 11160 },
    { x: 300, y: 108, value: 11320 },
    { x: 350, y: 118, value: 11220 },
    { x: 400, y: 92, value: 11460 },
    { x: 450, y: 78, value: 11580 },
    { x: 500, y: 88, value: 11500 },
    { x: 550, y: 64, value: 11700 },
    { x: 600, y: 50, value: 11840 },
  ],
  "3M": [
    { x: 0, y: 178, value: 10080 },
    { x: 50, y: 162, value: 10260 },
    { x: 100, y: 168, value: 10180 },
    { x: 150, y: 142, value: 10520 },
    { x: 200, y: 152, value: 10380 },
    { x: 250, y: 124, value: 10720 },
    { x: 300, y: 132, value: 10620 },
    { x: 350, y: 108, value: 10920 },
    { x: 400, y: 116, value: 10840 },
    { x: 450, y: 92, value: 11140 },
    { x: 500, y: 76, value: 11400 },
    { x: 550, y: 60, value: 11620 },
    { x: 600, y: 50, value: 11840 },
  ],
  "6M": [
    { x: 0, y: 188, value: 9760 },
    { x: 50, y: 182, value: 9820 },
    { x: 100, y: 168, value: 10020 },
    { x: 150, y: 174, value: 9940 },
    { x: 200, y: 156, value: 10220 },
    { x: 250, y: 138, value: 10460 },
    { x: 300, y: 148, value: 10340 },
    { x: 350, y: 122, value: 10620 },
    { x: 400, y: 134, value: 10500 },
    { x: 450, y: 108, value: 10880 },
    { x: 500, y: 88, value: 11220 },
    { x: 550, y: 70, value: 11540 },
    { x: 600, y: 50, value: 11840 },
  ],
};

const LOG_EVENTS: LogEvent[] = [
  {
    time: "09:31:04",
    status: "Success",
    action: "Trade Executed",
    agent: "Alpha-1",
    ticker: "NVDA",
    details: "Long 50sh @ $118.40 · Filled",
  },
  {
    time: "09:30:18",
    status: "Pending",
    action: "Approval Request",
    agent: "Gamma-3",
    ticker: "XLK",
    details: "Long 30sh @ $214.60 · Awaiting",
  },
  {
    time: "09:28:55",
    status: "Success",
    action: "Module Activated",
    agent: "Beta-2",
    ticker: "—",
    details: "Risk Management Suite v2.1",
  },
  {
    time: "09:22:40",
    status: "Declined",
    action: "Trade Declined",
    agent: "Beta-2",
    ticker: "QQQ",
    details: "Put spread rejected by user",
  },
  {
    time: "09:18:11",
    status: "Success",
    action: "Signal Generated",
    agent: "Alpha-1",
    ticker: "NVDA",
    details: "Bullish momentum · Score 82",
  },
  {
    time: "09:12:04",
    status: "Success",
    action: "Data Sync",
    agent: "System",
    ticker: "—",
    details: "Polygon.io · 1,240 instruments",
  },
  {
    time: "09:09:33",
    status: "Pending",
    action: "Approval Request",
    agent: "Alpha-1",
    ticker: "NVDA",
    details: "50sh long position · $5,920",
  },
  {
    time: "09:05:17",
    status: "Success",
    action: "Agent Started",
    agent: "Gamma-3",
    ticker: "—",
    details: "Macro Sector Rotation v3.0",
  },
];

/* ─── Whale Tracker mock data ─────────────────────────────────── */
type WhaleFlow = {
  ticker: string;
  type: "CALL" | "PUT";
  strike: string;
  expiry: string;
  dte: number;
  premium: string;
  openInterest: string;
  sentiment: "BULLISH" | "BEARISH";
  iv: string;
};

const WHALE_FLOWS: WhaleFlow[] = [
  { ticker: "NVDA", type: "CALL", strike: "$145", expiry: "May 16, '26", dte: 5, premium: "$24.8M", openInterest: "18,420", sentiment: "BULLISH", iv: "62.4%" },
  { ticker: "TSLA", type: "PUT", strike: "$180", expiry: "Jun 20, '26", dte: 40, premium: "$18.2M", openInterest: "9,840", sentiment: "BEARISH", iv: "71.2%" },
  { ticker: "SPY", type: "CALL", strike: "$560", expiry: "May 30, '26", dte: 19, premium: "$15.6M", openInterest: "42,180", sentiment: "BULLISH", iv: "14.8%" },
  { ticker: "AAPL", type: "CALL", strike: "$220", expiry: "Jul 18, '26", dte: 68, premium: "$12.4M", openInterest: "24,560", sentiment: "BULLISH", iv: "28.6%" },
  { ticker: "QQQ", type: "PUT", strike: "$480", expiry: "May 16, '26", dte: 5, premium: "$11.9M", openInterest: "31,240", sentiment: "BEARISH", iv: "22.4%" },
  { ticker: "AMD", type: "CALL", strike: "$185", expiry: "Jun 20, '26", dte: 40, premium: "$8.7M", openInterest: "14,820", sentiment: "BULLISH", iv: "48.2%" },
  { ticker: "META", type: "PUT", strike: "$580", expiry: "Jun 6, '26", dte: 26, premium: "$7.1M", openInterest: "8,640", sentiment: "BEARISH", iv: "38.9%" },
  { ticker: "MSFT", type: "CALL", strike: "$480", expiry: "Aug 15, '26", dte: 96, premium: "$6.4M", openInterest: "12,180", sentiment: "BULLISH", iv: "24.8%" },
  { ticker: "NVDA", type: "CALL", strike: "$160", expiry: "May 30, '26", dte: 19, premium: "$5.2M", openInterest: "21,840", sentiment: "BULLISH", iv: "64.8%" },
];

const WHALE_FILTERS = ["ALL", "CALLS", "PUTS", "BULLISH", "BEARISH"] as const;
type WhaleFilter = (typeof WHALE_FILTERS)[number];

/* ─── Congressional Tracker mock data ─────────────────────────── */
type CongressTrade = {
  politician: string;
  party: "Democrat" | "Republican";
  ticker: string;
  type: "BUY" | "SELL";
  amount: string;
  date: string;
};

const CONGRESS_TRADES: CongressTrade[] = [
  { politician: "Nancy Pelosi", party: "Democrat", ticker: "NVDA", type: "BUY", amount: "$1,000,001 - $5,000,000", date: "May 6, '26" },
  { politician: "Dan Crenshaw", party: "Republican", ticker: "LMT", type: "BUY", amount: "$50,001 - $100,000", date: "May 5, '26" },
  { politician: "Alexandria Ocasio-Cortez", party: "Democrat", ticker: "TSLA", type: "SELL", amount: "$15,001 - $50,000", date: "May 4, '26" },
  { politician: "Mitch McConnell", party: "Republican", ticker: "XOM", type: "BUY", amount: "$250,001 - $500,000", date: "May 2, '26" },
  { politician: "Michael McCaul", party: "Republican", ticker: "RTX", type: "BUY", amount: "$100,001 - $250,000", date: "Apr 30, '26" },
  { politician: "Ted Cruz", party: "Republican", ticker: "META", type: "SELL", amount: "$50,001 - $100,000", date: "Apr 29, '26" },
  { politician: "Nancy Pelosi", party: "Democrat", ticker: "GOOGL", type: "BUY", amount: "$500,001 - $1,000,000", date: "Apr 27, '26" },
  { politician: "Alexandria Ocasio-Cortez", party: "Democrat", ticker: "AAPL", type: "BUY", amount: "$1,001 - $15,000", date: "Apr 24, '26" },
  { politician: "Dan Crenshaw", party: "Republican", ticker: "BA", type: "SELL", amount: "$15,001 - $50,000", date: "Apr 22, '26" },
];

const CONGRESS_FILTERS = ["ALL", "DEMOCRAT", "REPUBLICAN"] as const;
type CongressFilter = (typeof CONGRESS_FILTERS)[number];

/* ─── Component-scoped keyframes ──────────────────────────────── */
const SCOPED_STYLES = `
  @keyframes demo-fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes demo-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.55; transform: scale(0.85); }
  }
  @keyframes demo-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .bzd-row:hover { background: rgba(255,255,255,0.025) !important; }
`;

/* ─── Main component ──────────────────────────────────────────── */
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
  const [installing, setInstalling] = useState<Set<string>>(() => new Set());

  const handleInstall = (id: string) => {
    setInstalling((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setInstalling((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setInstalled((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }, 800);
  };

  const allApproved =
    approvals.alpha === "approved" &&
    approvals.gamma === "approved" &&
    approvals.beta === "approved";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: DEMO_HEIGHT,
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
      <style>{SCOPED_STYLES}</style>
      <TopBar />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <SidebarPanel view={view} onSelect={setView} />
        <div
          style={{
            flex: 1,
            background: CONTENT,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            key={view}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              animation: "demo-fade-in 200ms ease both",
            }}
          >
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
                installing={installing}
                onInstall={handleInstall}
              />
            )}
            {view === "whale" && <WhaleTrackerView />}
            {view === "congress" && <CongressionalTrackerView />}
            {view === "analytics" && <AnalyticsView />}
            {view === "log" && <AgentLogView />}
          </div>
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
        height: TOPBAR_HEIGHT,
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
          padding: "0 8px 16px",
          fontSize: 12,
          fontWeight: 600,
          color: INK,
          letterSpacing: 0,
        }}
      >
        Byzant
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {NAV.map(({ key, label, Icon, badge }) => {
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
              {badge !== undefined && (
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
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
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
    <div
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <BigStatCard label="PENDING" value="3" valueColor={TEAL} sub="Require your review" />
        <BigStatCard label="APPROVED TODAY" value="8" valueColor={GREEN} sub="Executed successfully" />
        <BigStatCard label="EST. POSITION VALUE" value="$14.2k" valueColor={INK} sub="Total if all approved" />
      </div>

      <AgentTabs active={agentTab} onSelect={setAgentTab} approvals={approvals} />

      {allApproved ? (
        <SuccessBanner />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.6fr) minmax(0, 0.4fr)",
            gap: 10,
            flex: 1,
            minHeight: 0,
          }}
        >
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
          <ReasoningPanel agent={active} />
        </div>
      )}
    </div>
  );
}

function BigStatCard({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string;
  value: string;
  valueColor: string;
  sub: string;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          color: FAINT,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: valueColor,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: MUTED }}>{sub}</div>
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
    <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${BORDER}` }}>
      {AGENTS.map((a) => {
        const isActive = active === a.key;
        const status = approvals[a.key];
        const dot = status === "approved" ? GREEN : status === "declined" ? RED : null;
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
            {dot && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: dot,
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

function SuccessBanner() {
  return (
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
          width: 30,
          height: 30,
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
  );
}

function ApprovalCard({
  agent,
  status,
  onApprove,
  onDecline,
}: {
  agent: Agent;
  status: ApprovalStatus;
  onApprove: () => void;
  onDecline: () => void;
}) {
  const declined = status === "declined";
  const approved = status === "approved";
  const [pressing, setPressing] = useState(false);
  const sparkPath = smoothPath(agent.spark);

  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 16,
        opacity: declined ? 0.4 : 1,
        transform: declined ? "translateY(4px)" : "translateY(0)",
        transition: "opacity 200ms ease, transform 200ms ease",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
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

      <div
        style={{
          height: 32,
          marginBottom: 12,
          padding: "0 2px",
          borderBottom: `1px solid ${BORDER}`,
          paddingBottom: 8,
        }}
      >
        <svg
          viewBox="0 0 140 32"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="bzd-spark-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(153,225,217,0.4)" />
              <stop offset="100%" stopColor="rgba(153,225,217,0)" />
            </linearGradient>
          </defs>
          <path d={`${sparkPath} L140,32 L0,32 Z`} fill="url(#bzd-spark-grad)" />
          <path d={sparkPath} fill="none" stroke={TEAL} strokeWidth="1.2" />
        </svg>
      </div>

      <p style={{ fontSize: 12.5, color: INK, margin: "0 0 12px", lineHeight: 1.55 }}>
        {agent.description}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 6,
          marginBottom: 12,
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
                fontWeight: 600,
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
            if (!approved && !declined) e.currentTarget.style.background = SURFACE;
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

function ReasoningPanel({ agent }: { agent: Agent }) {
  return (
    <div
      key={agent.key}
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: "demo-fade-in 200ms ease both",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: MUTED,
          letterSpacing: "0.06em",
          fontWeight: 600,
          paddingBottom: 8,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        Agent Reasoning
      </div>
      <ReasonBlock label="OBSERVATION" body={agent.reasoning.observation} />
      <ReasonBlock label="PATTERN MATCH" body={agent.reasoning.pattern} />
      <ReasonBlock label="ACTION PROPOSED" body={agent.reasoning.action} />
    </div>
  );
}

function ReasonBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          color: TEAL,
          fontWeight: 600,
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <p style={{ fontSize: 12, color: INK, lineHeight: 1.55, margin: 0 }}>{body}</p>
    </div>
  );
}

/* ─── Dashboard view ──────────────────────────────────────────── */
function DashboardView() {
  return (
    <div
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
        {DASHBOARD_STATS.map((s) => (
          <BigStatCard key={s.label} {...s} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {DASHBOARD_AGENTS.map((a) => (
          <DashboardAgentCard key={a.id} {...a} />
        ))}
      </div>

      <PortfolioChart />
    </div>
  );
}

function DashboardAgentCard({
  id,
  signal,
  signalColor,
  pos,
  rr,
}: {
  id: string;
  signal: string;
  signalColor: string;
  pos: string;
  rr: string;
}) {
  return (
    <div
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
        <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>{id}</span>
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
              animation: "demo-pulse-dot 1.6s ease-in-out infinite",
            }}
          />
          Active
        </span>
      </div>
      <RowLine k="SIGNAL" v={signal} vColor={signalColor} />
      <RowLine k="POSITION" v={pos} />
      <RowLine k="R/R" v={rr} last />
    </div>
  );
}

function RowLine({
  k,
  v,
  vColor,
  last,
}: {
  k: string;
  v: string;
  vColor?: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 0",
        borderBottom: last ? "none" : `1px solid ${BORDER}`,
        fontSize: 11,
      }}
    >
      <span style={{ color: FAINT, letterSpacing: "0.06em", fontWeight: 600 }}>{k}</span>
      <span style={{ color: vColor ?? INK, fontWeight: vColor ? 600 : 400 }}>{v}</span>
    </div>
  );
}

function PortfolioChart() {
  const data = DASHBOARD_CHART_DATA;
  const points: [number, number][] = data.map((p) => [p.x, p.y]);
  const linePath = smoothPath(points);
  const fillPath = `${linePath} L600,180 L0,180 Z`;
  const VIEW_W = 600;
  const VIEW_H = 180;
  const yTicks = [
    { y: 25, label: "$11,000" },
    { y: 70, label: "$10,350" },
    { y: 115, label: "$9,600" },
    { y: 160, label: "$8,850" },
  ];

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorLineRef = useRef<SVGLineElement>(null);
  const cursorDotRef = useRef<SVGCircleElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const mouseXRef = useRef<number>(VIEW_W);
  const mouseYRef = useRef<number>(data[data.length - 1].y);
  const hoverIdxRef = useRef<number | null>(null);

  const first = data[0];
  const last = data[data.length - 1];
  const active = hoverIdx === null ? last : data[hoverIdx];
  const delta = active.value - first.value;
  const deltaPct = (delta / first.value) * 100;

  function pathYAtX(x: number): number {
    const path = linePathRef.current;
    if (!path) return 0;
    let lo = 0;
    let hi = path.getTotalLength();
    let pt = path.getPointAtLength(hi);
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      pt = path.getPointAtLength(mid);
      if (pt.x < x) lo = mid;
      else hi = mid;
    }
    return pt.y;
  }

  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const x = Math.max(0, Math.min(VIEW_W, ratio * VIEW_W));
    const y = pathYAtX(x);
    mouseXRef.current = x;
    mouseYRef.current = y;

    const lineEl = cursorLineRef.current;
    const dotEl = cursorDotRef.current;
    if (lineEl) {
      lineEl.setAttribute("x1", String(x));
      lineEl.setAttribute("x2", String(x));
      lineEl.style.display = "";
    }
    if (dotEl) {
      dotEl.setAttribute("cx", String(x));
      dotEl.setAttribute("cy", String(y));
      dotEl.style.display = "";
    }

    let nearest = 0;
    let bestDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const d = Math.abs(data[i].x - x);
      if (d < bestDist) {
        bestDist = d;
        nearest = i;
      }
    }
    if (nearest !== hoverIdxRef.current) {
      hoverIdxRef.current = nearest;
      setHoverIdx(nearest);
    }
  }

  function onMouseLeave() {
    if (cursorLineRef.current) cursorLineRef.current.style.display = "none";
    if (cursorDotRef.current) cursorDotRef.current.style.display = "none";
    hoverIdxRef.current = null;
    setHoverIdx(null);
  }

  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "14px 14px 12px 64px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.14em",
              color: FAINT,
              fontWeight: 600,
              marginBottom: 5,
            }}
          >
            PORTFOLIO PERFORMANCE
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: INK,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ${active.value.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 10,
              color: MUTED,
              marginBottom: 5,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {active.date}
          </div>
          <div
            style={{
              fontSize: 12,
              color: TEAL,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {delta >= 0 ? "+" : "−"}${Math.abs(delta).toLocaleString()} ·{" "}
            {delta >= 0 ? "+" : "−"}
            {Math.abs(deltaPct).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Y-axis labels */}
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 56,
          bottom: 12,
          width: 50,
          fontSize: 10,
          color: FAINT,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {yTicks.map((t) => (
          <div
            key={t.label}
            style={{
              position: "absolute",
              top: `${(t.y / 180) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            {t.label}
          </div>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        style={{ flex: 1, minHeight: 140, display: "block", cursor: "crosshair" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <defs>
          <linearGradient id="bzd-portfolio-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(153,225,217,0.32)" />
            <stop offset="100%" stopColor="rgba(153,225,217,0)" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <line
            key={t.y}
            x1="0"
            x2={VIEW_W}
            y1={t.y}
            y2={t.y}
            stroke={GRID_LINE}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={fillPath} fill="url(#bzd-portfolio-grad)" />
        <path
          ref={linePathRef}
          d={linePath}
          fill="none"
          stroke={TEAL}
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />

        <line
          ref={cursorLineRef}
          x1={mouseXRef.current}
          x2={mouseXRef.current}
          y1={0}
          y2={VIEW_H}
          stroke="rgba(153,225,217,0.6)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{ display: hoverIdx === null ? "none" : "" }}
          pointerEvents="none"
        />
        <circle
          ref={cursorDotRef}
          cx={mouseXRef.current}
          cy={mouseYRef.current}
          r={6}
          fill={TEAL}
          stroke={INK}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{ display: hoverIdx === null ? "none" : "" }}
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}

/* ─── Marketplace view ────────────────────────────────────────── */
function MarketplaceView({
  installed,
  installing,
  onInstall,
}: {
  installed: Set<string>;
  installing: Set<string>;
  onInstall: (id: string) => void;
}) {
  const installedRows = MODULES.filter((m) => installed.has(m.id));
  const availableRows = MODULES.filter((m) => !installed.has(m.id));

  return (
    <div
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
      }}
    >
      <SectionHeader label="Installed" count={installedRows.length} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {installedRows.map((m) => (
          <InstalledModuleCard key={m.id} mod={m} />
        ))}
      </div>

      <SectionHeader label="Available" count={availableRows.length} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {availableRows.map((m) => (
          <AvailableModuleCard
            key={m.id}
            mod={m}
            isInstalling={installing.has(m.id)}
            onInstall={onInstall}
          />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          color: FAINT,
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          minWidth: 18,
          height: 18,
          padding: "0 6px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          color: MUTED,
          fontSize: 10,
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        {count}
      </span>
    </div>
  );
}

function CategoryBadge({ cat }: { cat: ModuleCategory }) {
  const s = categoryStyle(cat);
  return (
    <span
      style={{
        fontSize: 9,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        padding: "2px 7px",
        borderRadius: 999,
        fontWeight: 600,
      }}
    >
      {cat}
    </span>
  );
}

function InstalledModuleCard({ mod }: { mod: ModuleRow }) {
  const usage = mod.usage ?? 0;
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "12px 14px",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 220px auto",
        alignItems: "center",
        gap: 16,
        transition: "background 200ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{mod.name}</span>
        <CategoryBadge cat={mod.category} />
        <span style={{ fontSize: 11, color: MUTED }}>{mod.price}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
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
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.12em",
              color: FAINT,
              fontWeight: 600,
            }}
          >
            USAGE THIS MONTH
          </span>
          <span style={{ fontSize: 10, color: TEAL, fontWeight: 600 }}>{usage}%</span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${usage}%`,
              height: "100%",
              background: TEAL,
              borderRadius: 999,
              transition: "width 240ms ease",
            }}
          />
        </div>
      </div>
      <button
        onMouseEnter={(e) => (e.currentTarget.style.color = INK)}
        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
        style={{
          appearance: "none",
          background: "transparent",
          border: "none",
          color: MUTED,
          fontFamily: SYS,
          fontSize: 11,
          fontWeight: 500,
          cursor: "pointer",
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          transition: "color 120ms ease",
        }}
      >
        Configure
        <ArrowRightIcon size={11} />
      </button>
    </div>
  );
}

function AvailableModuleCard({
  mod,
  isInstalling,
  onInstall,
}: {
  mod: ModuleRow;
  isInstalling: boolean;
  onInstall: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "background 200ms ease, border-color 200ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{mod.name}</span>
          <CategoryBadge cat={mod.category} />
        </div>
        <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{mod.price}</span>
      </div>
      <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.5 }}>{mod.desc}</p>
      <button
        disabled={isInstalling}
        onClick={() => onInstall(mod.id)}
        onMouseEnter={(e) => {
          if (!isInstalling) e.currentTarget.style.background = "rgba(153,225,217,0.12)";
        }}
        onMouseLeave={(e) => {
          if (!isInstalling) e.currentTarget.style.background = "transparent";
        }}
        style={{
          appearance: "none",
          background: "transparent",
          color: TEAL,
          border: `1px solid ${TEAL}`,
          borderRadius: 999,
          padding: "6px 14px",
          fontFamily: SYS,
          fontSize: 11,
          fontWeight: 600,
          cursor: isInstalling ? "default" : "pointer",
          transition: "background 200ms ease",
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          opacity: isInstalling ? 0.7 : 1,
        }}
      >
        {isInstalling && (
          <span
            style={{
              width: 10,
              height: 10,
              border: "1.5px solid rgba(153,225,217,0.35)",
              borderTopColor: TEAL,
              borderRadius: "50%",
              animation: "demo-spin 0.7s linear infinite",
              display: "inline-block",
            }}
          />
        )}
        {isInstalling ? "Installing…" : "Get Module"}
      </button>
    </div>
  );
}

/* ─── Analytics view ──────────────────────────────────────────── */
const ANALYTICS_STATS: { label: string; value: string; valueColor: string; sub: string }[] = [
  { label: "WIN RATE", value: "74%", valueColor: TEAL, sub: "Last 30 trades" },
  { label: "AVG R/R", value: "2.8x", valueColor: TEAL, sub: "Risk/reward ratio" },
  { label: "EMOTIONAL TRADES", value: "0", valueColor: GREEN, sub: "Zero bias detected" },
  { label: "TOTAL P&L", value: "+$1,840", valueColor: GREEN, sub: "Since inception" },
];

function AnalyticsView() {
  const [range, setRange] = useState<RangeKey>("1M");
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const data = ANALYTICS_DATA[range];
  const pts: [number, number][] = data.map((p) => [p.x, p.y]);
  const linePath = smoothPath(pts);
  const fillPath = `${linePath} L600,200 L0,200 Z`;
  const VIEW_W = 600;
  const VIEW_H = 200;

  const last = data[data.length - 1];
  const first = data[0];

  // Display value (interpolated when hovering)
  const display = hoverX === null ? last : interpolatePoint(hoverX, data);
  const hoverY = hoverX === null ? null : display.y;
  const delta = display.value - first.value;
  const deltaPct = (delta / first.value) * 100;

  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const x = Math.max(0, Math.min(VIEW_W, ratio * VIEW_W));
    setHoverX(x);
  }

  return (
    <div
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
        {ANALYTICS_STATS.map((s) => (
          <BigStatCard key={s.label} {...s} />
        ))}
      </div>

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          padding: 18,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: FAINT,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              PORTFOLIO VALUE
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: INK,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ${display.value.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 12,
                color: TEAL,
                fontWeight: 600,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {delta >= 0 ? "+" : "−"}${Math.abs(delta).toLocaleString()} ·{" "}
              {delta >= 0 ? "+" : "−"}{Math.abs(deltaPct).toFixed(2)}%
            </div>
          </div>

          <div style={{ display: "inline-flex", gap: 4, padding: 3, background: "rgba(255,255,255,0.04)", borderRadius: 999 }}>
            {(["1W", "1M", "3M", "6M"] as RangeKey[]).map((r) => {
              const active = r === range;
              return (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    appearance: "none",
                    background: active ? "rgba(153,225,217,0.14)" : "transparent",
                    color: active ? TEAL : MUTED,
                    border: "none",
                    borderRadius: 999,
                    padding: "5px 12px",
                    fontFamily: SYS,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 150ms ease, color 150ms ease",
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 140, position: "relative" }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            style={{ display: "block", cursor: "crosshair" }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setHoverX(null)}
          >
            <defs>
              <linearGradient id="bzd-analytics-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(153,225,217,0.36)" />
                <stop offset="100%" stopColor="rgba(153,225,217,0)" />
              </linearGradient>
            </defs>

            {[50, 100, 150].map((y) => (
              <line
                key={y}
                x1="0"
                x2={VIEW_W}
                y1={y}
                y2={y}
                stroke={GRID_LINE}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <path d={fillPath} fill="url(#bzd-analytics-grad)" />
            <path
              d={linePath}
              fill="none"
              stroke={TEAL}
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />

            {hoverX !== null && hoverY !== null && (
              <>
                <line
                  x1={hoverX}
                  x2={hoverX}
                  y1={0}
                  y2={VIEW_H}
                  stroke="rgba(153,225,217,0.45)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx={hoverX} cy={hoverY} r={4} fill={TEAL} />
                <circle
                  cx={hoverX}
                  cy={hoverY}
                  r={8}
                  fill="rgba(153,225,217,0.18)"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

function interpolatePoint(x: number, data: ChartPoint[]): { x: number; y: number; value: number } {
  if (x <= data[0].x) return data[0];
  if (x >= data[data.length - 1].x) return data[data.length - 1];
  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i];
    const b = data[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x);
      return {
        x,
        y: a.y + (b.y - a.y) * t,
        value: Math.round(a.value + (b.value - a.value) * t),
      };
    }
  }
  return data[data.length - 1];
}

/* ─── Agent Log view ──────────────────────────────────────────── */
/* ─── Shared pill (CALL/PUT, BUY/SELL, BULLISH/BEARISH, party) ─ */
function Pill({
  tone,
  children,
}: {
  tone: "teal" | "red";
  children: React.ReactNode;
}) {
  const palette =
    tone === "teal"
      ? { color: TEAL, bg: "rgba(153,225,217,0.10)" }
      : { color: RED, bg: "rgba(248,113,113,0.10)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 7px",
        borderRadius: 4,
        background: palette.bg,
        color: palette.color,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

/* ─── Live badge (used by Whale + Congress headers) ───────────── */
function LiveBadge({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 10,
        color: FAINT,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: TEAL,
          boxShadow: `0 0 8px ${TEAL}`,
          animation: "demo-pulse-dot 1.6s ease-in-out infinite",
        }}
      />
      {label}
    </div>
  );
}

/* ─── Filter pill row (decorative — visual toggle only) ───────── */
function FilterPills<T extends string>({
  options,
  active,
  onSelect,
}: {
  options: readonly T[];
  active: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = INK;
                e.currentTarget.style.borderColor = BORDER_STRONG;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = MUTED;
                e.currentTarget.style.borderColor = BORDER;
              }
            }}
            style={{
              appearance: "none",
              padding: "5px 12px",
              borderRadius: 999,
              border: `1px solid ${isActive ? "rgba(153,225,217,0.25)" : BORDER}`,
              background: isActive ? "rgba(153,225,217,0.1)" : SURFACE,
              color: isActive ? TEAL : MUTED,
              fontFamily: SYS,
              fontSize: 10,
              fontWeight: isActive ? 600 : 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 120ms ease, color 120ms ease, border-color 120ms ease",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Whale Tracker view ──────────────────────────────────────── */
function WhaleTrackerView() {
  const [filter, setFilter] = useState<WhaleFilter>("ALL");
  const cols = "60px 52px 64px 84px 44px 76px 70px 86px minmax(0, 56px)";

  return (
    <div
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: INK, letterSpacing: "-0.005em" }}>
            Whale Tracker
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>
            Unusual options flow &amp; dark pool activity
          </div>
        </div>
        <LiveBadge label="Live · Barchart Unusual Activity" />
      </div>

      <FilterPills options={WHALE_FILTERS} active={filter} onSelect={setFilter} />

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 10,
            padding: "10px 14px",
            borderBottom: `1px solid ${BORDER}`,
            background: "rgba(255,255,255,0.02)",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: FAINT,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          <span>Ticker</span>
          <span>Type</span>
          <span style={{ textAlign: "right" }}>Strike</span>
          <span>Expiry</span>
          <span style={{ textAlign: "right" }}>DTE</span>
          <span style={{ textAlign: "right" }}>Premium</span>
          <span style={{ textAlign: "right" }}>OI</span>
          <span>Sentiment</span>
          <span style={{ textAlign: "right" }}>IV</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {WHALE_FLOWS.map((r, i) => (
            <div
              key={i}
              className="bzd-row"
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: 10,
                padding: "11px 14px",
                borderBottom: i < WHALE_FLOWS.length - 1 ? `1px solid ${BORDER}` : "none",
                alignItems: "center",
                fontSize: 12,
                transition: "background 120ms ease",
              }}
            >
              <span style={{ color: TEAL, fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>
                {r.ticker}
              </span>
              <Pill tone={r.type === "CALL" ? "teal" : "red"}>{r.type}</Pill>
              <span style={{ textAlign: "right", color: INK, fontVariantNumeric: "tabular-nums" }}>
                {r.strike}
              </span>
              <span style={{ color: MUTED, fontSize: 11.5 }}>{r.expiry}</span>
              <span
                style={{
                  textAlign: "right",
                  color: r.dte <= 7 ? AMBER : MUTED,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.dte}d
              </span>
              <span
                style={{
                  textAlign: "right",
                  color: INK,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.premium}
              </span>
              <span
                style={{
                  textAlign: "right",
                  color: MUTED,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.openInterest}
              </span>
              <Pill tone={r.sentiment === "BULLISH" ? "teal" : "red"}>{r.sentiment}</Pill>
              <span
                style={{
                  textAlign: "right",
                  color: MUTED,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.iv}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Congressional Tracker view ──────────────────────────────── */
function CongressionalTrackerView() {
  const [filter, setFilter] = useState<CongressFilter>("ALL");
  const cols = "minmax(0, 1.4fr) 96px 64px 52px minmax(0, 1.4fr) 80px";

  return (
    <div
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: INK, letterSpacing: "-0.005em" }}>
            Congressional Tracker
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>
            Real-time congressional trade disclosures
          </div>
        </div>
        <LiveBadge label="Live · Capitol Trades" />
      </div>

      <FilterPills options={CONGRESS_FILTERS} active={filter} onSelect={setFilter} />

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 10,
            padding: "10px 14px",
            borderBottom: `1px solid ${BORDER}`,
            background: "rgba(255,255,255,0.02)",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: FAINT,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          <span>Politician</span>
          <span>Party</span>
          <span>Ticker</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Date</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {CONGRESS_TRADES.map((r, i) => (
            <div
              key={i}
              className="bzd-row"
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: 10,
                padding: "11px 14px",
                borderBottom: i < CONGRESS_TRADES.length - 1 ? `1px solid ${BORDER}` : "none",
                alignItems: "center",
                fontSize: 12,
                transition: "background 120ms ease",
              }}
            >
              <span
                style={{
                  color: INK,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.politician}
              </span>
              <Pill tone={r.party === "Democrat" ? "teal" : "red"}>{r.party}</Pill>
              <span style={{ color: TEAL, fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>
                {r.ticker}
              </span>
              <Pill tone={r.type === "BUY" ? "teal" : "red"}>{r.type}</Pill>
              <span
                style={{
                  color: MUTED,
                  fontSize: 11.5,
                  fontVariantNumeric: "tabular-nums",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.amount}
              </span>
              <span style={{ color: MUTED, fontSize: 11.5 }}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentLogView() {
  return (
    <div
      style={{
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: INK, letterSpacing: "-0.005em" }}>
          Agent Activity Log
        </div>
        <div
          style={{
            fontSize: 11,
            color: MUTED,
            marginTop: 3,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          26 events today
          <span style={{ color: FAINT }}>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: GREEN,
                boxShadow: `0 0 6px ${GREEN}`,
                animation: "demo-pulse-dot 1.6s ease-in-out infinite",
              }}
            />
            Real-time feed
          </span>
        </div>
      </div>

      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "92px 96px 140px 90px 70px minmax(0, 1fr)",
            gap: 12,
            padding: "10px 14px",
            borderBottom: `1px solid ${BORDER}`,
            background: "rgba(255,255,255,0.02)",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: FAINT,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          <span>Timestamp</span>
          <span>Status</span>
          <span>Action Type</span>
          <span>Agent</span>
          <span>Ticker</span>
          <span>Details</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {LOG_EVENTS.map((ev, i) => {
            const dotColor =
              ev.status === "Success" ? GREEN : ev.status === "Pending" ? YELLOW : RED;
            return (
              <div
                key={i}
                className="bzd-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px 96px 140px 90px 70px minmax(0, 1fr)",
                  gap: 12,
                  padding: "11px 14px",
                  borderBottom: i < LOG_EVENTS.length - 1 ? `1px solid ${BORDER}` : "none",
                  alignItems: "center",
                  fontSize: 12,
                  transition: "background 120ms ease",
                }}
              >
                <span
                  style={{
                    color: MUTED,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {ev.time}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: dotColor,
                      boxShadow: `0 0 6px ${dotColor}55`,
                    }}
                  />
                  <span style={{ color: dotColor, fontSize: 11, fontWeight: 600 }}>
                    {ev.status}
                  </span>
                </span>
                <span style={{ color: INK }}>{ev.action}</span>
                <span style={{ color: ev.agent === "System" ? MUTED : INK, fontWeight: 500 }}>
                  {ev.agent}
                </span>
                <span style={{ color: ev.ticker === "—" ? FAINT : TEAL, fontWeight: 600 }}>
                  {ev.ticker}
                </span>
                <span style={{ color: MUTED, fontSize: 11.5 }}>{ev.details}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
