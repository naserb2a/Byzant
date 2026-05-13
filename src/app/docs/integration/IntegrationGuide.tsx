"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DocsShell, { DOCS_CONTENT_TOP_PAD } from "@/components/DocsShell";

const INTER = "var(--font-inter)";
const TERMINAL_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Courier New', monospace";

const INK = "#ffffff";
const MUTED = "#94a3b8";
const TEAL = "#99E1D9";

const RAW_BG = "#0A0A0A";
const RAW_HEADER_BG = "#080808";
const RAW_KEY = "#7dd3c0";
const RAW_FILENAME = "rgba(255,255,255,0.4)";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const CARD_BORDER_SOFT = "rgba(255,255,255,0.05)";
const CODE_BODY = "#e6edf3";
const KEY_HIGHLIGHT_BG = "rgba(153,225,217,0.10)";

const ENDPOINT = "https://byzant.ai/api/mcp";
const SECTION_SCROLL_MARGIN = DOCS_CONTENT_TOP_PAD;

const SNIPPETS = {
  claudeCode: {
    label: "terminal",
    description: "Add Byzant as an MCP server in your Claude Code session.",
    code: `claude mcp add --transport http byzant https://byzant.ai/api/mcp --header "Authorization: Bearer YOUR_API_KEY"`,
  },
  claudeDesktop: {
    label: "claude_desktop_config.json",
    description: "Add to your claude_desktop_config.json or MCP config file.",
    code: `{
  "mcpServers": {
    "byzant": {
      "type": "http",
      "url": "https://byzant.ai/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`,
  },
  custom: {
    label: "bash",
    description: "Call the MCP endpoint directly from any HTTP client.",
    code: `curl -X POST https://byzant.ai/api/mcp \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "get_whale_flow", "arguments": {"ticker": "NVDA", "limit": 10}}}'`,
  },
} as const;

type TabKey = keyof typeof SNIPPETS;

const TABS: { key: TabKey; label: string }[] = [
  { key: "claudeCode", label: "Claude Code" },
  { key: "claudeDesktop", label: "Claude Desktop" },
  { key: "custom", label: "Custom Agent" },
];

const TOC_ITEMS = [
  { id: "how-it-works", label: "How it works" },
  { id: "available-tools", label: "Available tools" },
  { id: "connect-your-agent", label: "Connect your agent" },
  { id: "your-api-key", label: "Your API key" },
  { id: "need-help", label: "Need help" },
];

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="5" width="9" height="9" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-5A1.5 1.5 0 0 0 3 3.5v5A1.5 1.5 0 0 0 4.5 10H6" />
    </svg>
  );
}

function CopyButton({ value, id }: { value: string; id: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — silently no-op */
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy ${id}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "transparent",
        border: 0,
        padding: "4px 6px",
        margin: 0,
        cursor: "pointer",
        color: TEAL,
        fontFamily: INTER,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        opacity: 0.85,
        transition: "opacity 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
    >
      <CopyIcon />
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function highlightApiKey(code: string): React.ReactNode[] {
  const parts = code.split("YOUR_API_KEY");
  const nodes: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    nodes.push(<span key={`p-${i}`}>{part}</span>);
    if (i < parts.length - 1) {
      nodes.push(
        <span
          key={`k-${i}`}
          style={{
            color: TEAL,
            background: KEY_HIGHLIGHT_BG,
            padding: "0 4px",
            borderRadius: 4,
          }}
        >
          YOUR_API_KEY
        </span>
      );
    }
  });
  return nodes;
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div
      style={{
        background: RAW_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        marginTop: 14,
      }}
    >
      <div
        style={{
          background: RAW_HEADER_BG,
          padding: "10px 16px",
          borderBottom: `1px solid ${CARD_BORDER_SOFT}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          {label}
        </span>
        <CopyButton value={code} id={label} />
      </div>
      <pre
        style={{
          margin: 0,
          padding: "18px 20px",
          background: RAW_BG,
          fontFamily: TERMINAL_MONO,
          fontSize: 13,
          lineHeight: 1.7,
          color: CODE_BODY,
          whiteSpace: "pre",
          overflowX: "auto",
        }}
      >
        <code style={{ fontFamily: TERMINAL_MONO, background: "transparent" }}>
          {highlightApiKey(code)}
        </code>
      </pre>
    </div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontFamily: INTER,
        fontSize: 36,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: INK,
        margin: 0,
        lineHeight: 1.15,
        textAlign: "left",
      }}
    >
      {children}
    </h1>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      style={{
        fontFamily: INTER,
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: TEAL,
        margin: "56px 0 12px",
        scrollMarginTop: SECTION_SCROLL_MARGIN,
      }}
    >
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: INTER,
        fontSize: 15,
        fontWeight: 400,
        lineHeight: 1.65,
        color: INK,
        margin: "0 0 12px",
      }}
    >
      {children}
    </p>
  );
}

function MailLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      style={{ color: TEAL, textDecoration: "none" }}
    >
      {email}
    </a>
  );
}

type ToolSpec = {
  name: string;
  description: string;
  params: { name: string; meta: string; description: string }[];
};

const TOOLS: ToolSpec[] = [
  {
    name: "get_whale_flow",
    description: "Retrieve unusual options flow and whale activity.",
    params: [
      {
        name: "ticker",
        meta: "optional · string",
        description: "Filter by underlying ticker (e.g. NVDA).",
      },
      {
        name: "sentiment",
        meta: "optional · bullish | bearish",
        description: "Filter results by directional sentiment.",
      },
      {
        name: "limit",
        meta: "optional · number · default 50",
        description: "Max number of records to return.",
      },
    ],
  },
  {
    name: "get_congressional_trades",
    description: "Retrieve recent congressional stock trade disclosures.",
    params: [
      {
        name: "politician",
        meta: "optional · string",
        description: "Filter by politician name.",
      },
      {
        name: "party",
        meta: "optional · Democrat | Republican",
        description: "Filter by political party.",
      },
      {
        name: "ticker",
        meta: "optional · string",
        description: "Filter by traded ticker.",
      },
      {
        name: "limit",
        meta: "optional · number · default 50",
        description: "Max number of records to return.",
      },
    ],
  },
];

function ToolCard({ tool }: { tool: ToolSpec }) {
  return (
    <div
      style={{
        background: RAW_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 12,
        padding: 20,
        marginTop: 14,
      }}
    >
      <div
        style={{
          fontFamily: TERMINAL_MONO,
          fontSize: 14,
          color: RAW_KEY,
          letterSpacing: 0,
        }}
      >
        {tool.name}
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 14,
          fontWeight: 400,
          color: INK,
          margin: "6px 0 16px",
          lineHeight: 1.55,
        }}
      >
        {tool.description}
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 10,
          fontWeight: 500,
          color: MUTED,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Parameters
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tool.params.map((p) => (
          <li
            key={p.name}
            style={{
              padding: "8px 0",
              borderTop: `1px solid ${CARD_BORDER_SOFT}`,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: 8,
              fontFamily: INTER,
              fontSize: 14,
              fontWeight: 400,
              color: INK,
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                fontFamily: TERMINAL_MONO,
                fontSize: 13,
                color: RAW_KEY,
              }}
            >
              {p.name}
            </span>
            <span
              style={{
                fontFamily: TERMINAL_MONO,
                fontSize: 11,
                color: MUTED,
                letterSpacing: "0.04em",
              }}
            >
              {p.meta}
            </span>
            <span
              style={{
                flexBasis: "100%",
                color: MUTED,
                fontSize: 13,
                fontFamily: INTER,
                fontWeight: 400,
              }}
            >
              {p.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EndpointPill() {
  return (
    <div
      style={{
        background: RAW_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 10,
        padding: "12px 16px",
        marginTop: 24,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: INTER,
          fontSize: 11,
          fontWeight: 500,
          color: MUTED,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        MCP endpoint
      </span>
      <span
        style={{
          fontFamily: TERMINAL_MONO,
          fontSize: 13,
          color: TEAL,
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {ENDPOINT}
      </span>
      <CopyButton value={ENDPOINT} id="endpoint" />
    </div>
  );
}

function TabsStrip({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        background: RAW_BG,
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 999,
        padding: 2,
        marginTop: 8,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.key)}
            style={{
              background: isActive ? "rgba(153,225,217,0.10)" : "transparent",
              color: isActive ? TEAL : MUTED,
              border: 0,
              padding: "6px 14px",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: INTER,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = INK;
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = MUTED;
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function TableOfContents() {
  const [activeId, setActiveId] = useState<string>(TOC_ITEMS[0].id);
  const lastActiveRef = useRef<string>(TOC_ITEMS[0].id);

  useEffect(() => {
    const elements = TOC_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort(
            (a, b) =>
              (a.target as HTMLElement).getBoundingClientRect().top -
              (b.target as HTMLElement).getBoundingClientRect().top
          );
          const next = intersecting[0].target.id;
          if (next && next !== lastActiveRef.current) {
            lastActiveRef.current = next;
            setActiveId(next);
          }
        }
      },
      {
        rootMargin: `-${SECTION_SCROLL_MARGIN}px 0px -60% 0px`,
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    lastActiveRef.current = id;
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="On this page">
      <div
        style={{
          fontFamily: INTER,
          fontSize: 11,
          fontWeight: 500,
          color: MUTED,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        On this page
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {TOC_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} style={{ margin: 0 }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                style={{
                  display: "block",
                  padding: "6px 0 6px 14px",
                  borderLeft: `2px solid ${isActive ? TEAL : "transparent"}`,
                  color: isActive ? TEAL : MUTED,
                  fontFamily: INTER,
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  lineHeight: 1.5,
                  textDecoration: "none",
                  transition: "color 0.15s ease, border-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = INK;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = MUTED;
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function IntegrationGuide() {
  const [tab, setTab] = useState<TabKey>("claudeCode");
  const snippet = SNIPPETS[tab];

  return (
    <DocsShell toc={<TableOfContents />}>
      <H1>Integration Guide</H1>
      <p
        style={{
          fontFamily: INTER,
          fontSize: 15,
          fontWeight: 400,
          color: MUTED,
          lineHeight: 1.6,
          margin: "12px 0 0",
        }}
      >
        Connect your agent to Byzant&apos;s MCP marketplace in minutes.
      </p>

      <EndpointPill />

      <SectionHeading id="how-it-works">How it works</SectionHeading>
      <Paragraph>
        Byzant exposes institutional-grade data modules as MCP tools your agent
        can call directly — whale options flow, congressional trade disclosures,
        and more coming soon.
      </Paragraph>
      <Paragraph>
        Your agent retrieves the data, forms a thesis, and surfaces trade
        decisions for your approval. You are always the final arbiter. Byzant
        never executes a trade on its own.
      </Paragraph>

      <SectionHeading id="available-tools">Available tools</SectionHeading>
      {TOOLS.map((t) => (
        <ToolCard key={t.name} tool={t} />
      ))}

      <SectionHeading id="connect-your-agent">Connect your agent</SectionHeading>
      <TabsStrip active={tab} onChange={setTab} />
      <p
        style={{
          fontFamily: INTER,
          fontSize: 13,
          fontWeight: 400,
          color: MUTED,
          lineHeight: 1.6,
          margin: "16px 0 0",
        }}
      >
        {snippet.description}
      </p>
      <CodeBlock label={snippet.label} code={snippet.code} />

      <SectionHeading id="your-api-key">Your API key</SectionHeading>
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <p
          style={{
            fontFamily: INTER,
            fontSize: 14,
            fontWeight: 400,
            color: INK,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          Your API key was shown once during onboarding. If you need a new key,
          you can regenerate it from your{" "}
          <Link
            href="/dashboard/settings"
            style={{ color: TEAL, textDecoration: "none" }}
          >
            account settings
          </Link>
          .
        </p>
      </div>

      <SectionHeading id="need-help">Need help</SectionHeading>
      <Paragraph>
        Questions? Email us at <MailLink email="support@byzant.ai" />.
      </Paragraph>
    </DocsShell>
  );
}
