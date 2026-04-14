# Byzant — Project Intelligence File
# Claude Code must read this file in full before every session.

---

## THE VISION

Byzant is the first protocol-native marketplace built for AI trading
agents. It sits between retail traders and financial markets, giving
everyday investors access to the same institutional-grade data feeds,
analytical tools, and risk modules that hedge funds have always had —
delivered through modular, agent-consumable capabilities built on the
MCP (Model Context Protocol) standard.

The core insight that drives everything:
Everyone is racing to build AI tools for humans.
Byzant builds for agents.

Retail traders are the sponsors. Their AI agents are the operators.
The marketplace is the infrastructure layer connecting them to premium
capabilities they could not otherwise access or afford.

The emotionless, data-driven nature of AI agents is the structural
advantage. Retail traders lose money primarily due to emotional
decision-making — fear, greed, FOMO, revenge trading. Byzant gives
every retail trader a professional, unbiased co-pilot that never panics
and never gets greedy.

Tagline (LOCKED — never change): "You are the arbiter."

---

## THE PROBLEM WE ARE SOLVING

1. Retail traders are at a structural disadvantage
   Hedge funds have entire engineering teams building custom agent
   infrastructure with real-time premium data, sentiment feeds, risk
   engines, and dark pool monitors. The retail trader has none of this.

2. AI agents are fragmented and capability-limited
   Current AI trading agents are only as good as what was baked into
   them at build time. There is no dynamic protocol-native marketplace
   where an agent can discover and consume new capabilities on demand.
   Every integration is hardcoded. Every upgrade requires a developer.

3. Emotion is the #1 reason retail traders lose money
   An AI agent has no emotions, no ego, no greed, and no fear.
   This is a structural advantage that has never been properly packaged
   for retail investors. Byzant packages it.

---

## HOW IT WORKS

1. Trader connects their AI trading agent to Byzant via MCP
2. Agent discovers available capability modules in the marketplace
3. Agent identifies what it needs and surfaces the request to its human
4. Human reviews, approves, and pays — the capability is unlocked
5. Agent now operates with upgraded intelligence

The agent is never fully autonomous. It surfaces opportunities, trade
setups, and upgrade requests. The human approves or declines.
This human-in-the-loop model is a feature, not a limitation.

---

## TARGET CUSTOMER

Active retail traders who are already using or curious about AI agents.
Tech-forward, self-directed investors frustrated by emotional
decision-making and the gap between their tools and what institutions use.
They follow fintech Twitter/X, use TradingView, and are experimenting
with ChatGPT for market research. They want the emotionless second
opinion without losing control of their money.

---

## TECH STACK

- Framework: Next.js 14 with App Router + TypeScript
- Styling: Tailwind CSS + custom CSS variables
- Fonts: Sora (display) + DM Mono (monospace/data)
- Auth + DB: Supabase
- Hosting: Vercel (auto-deploys from GitHub on push)
- Payments: Stripe (planned Phase 2)
- Animation: Framer Motion (landing page)
- Domain: byzant.ai (planned) — currently live at b2acapital.ai during transition
- Repo: github.com/naserb2a/B2Acapital

---

## DESIGN SYSTEM (NON-NEGOTIABLE — NEVER DEVIATE)

### Colors
--db-bg:           #0A0A0A   (page background — deep black)
--db-bg2:          #0F0F0F   (card background)
--db-bg3:          #141414   (nested/hover elements)
--db-bg4:          #1A1A1A   (deepest nesting)
--db-blue:         #99E1D9   (primary accent — mint teal)
--db-blue-bright:  #B2EBE5   (hover/highlight mint)
--db-blue-dim:     rgba(153,225,217,0.10)
--db-blue-mid:     rgba(153,225,217,0.18)
--db-blue-glow:    rgba(153,225,217,0.06)
--db-border:       rgba(255,255,255,0.06)
--db-border-mid:   rgba(255,255,255,0.08)
--db-border-hi:    rgba(255,255,255,0.15)
--db-ink:          #F5F5F5   (primary text)
--db-ink-muted:    #666666   (secondary text)
--db-ink-faint:    #444444   (labels/disabled)
--db-green:        #3dd68c   (success/bullish)
--db-green-dim:    rgba(61,214,140,0.10)
--db-red:          #ff5a5a   (danger/bearish)
--db-red-dim:      rgba(255,90,90,0.10)
--db-amber:        #f0b429   (warning/neutral)
--db-amber-dim:    rgba(240,180,41,0.10)

### ABSOLUTE COLOR RULES
- NO orange anywhere on the site. Not one instance. Ever.
- NO white backgrounds in the dashboard
- NO purple gradients
- NO hardcoded light colors in dashboard components
- If you see orange, replace it with #99E1D9 immediately
- Primary accent is #99E1D9 (mint teal) — not blue, not green

### Typography
- Sora: ALL headings, body text, nav items, buttons, descriptions
- DM Mono: ALL labels, badges, values, timestamps, table data,
  monospace data, ticker symbols, status pills, eyebrows
- Page titles: Sora 22-24px font-weight 500-600 letter-spacing -0.02em
- Stat values: Sora/DM Mono 26px font-weight 600
- Mono labels: DM Mono 10-11px uppercase letter-spacing 0.08-0.12em
- Body text: Sora 13-14px font-weight 400
- NEVER use system fonts, Inter, Roboto, or Arial as primary

### Card Styling
- Background: var(--db-bg2) = #0F0F0F (or #141414 for surface cards)
- Border: 1px solid var(--db-border) = rgba(255,255,255,0.06)
- Border-radius: 12-16px
- Hover: border-color shifts to var(--db-border-hi)
- All charts: inline SVG only, no external chart libraries

---

## PROJECT STRUCTURE

```
b2acapital/
├── app/
│   ├── page.tsx                    ← Landing page (DO NOT TOUCH)
│   ├── layout.tsx                  ← Root layout (DO NOT TOUCH)
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← Dashboard shell (sidebar + topbar)
│   │   ├── dashboard/page.tsx      ← Main dashboard
│   │   ├── approvals/page.tsx      ← Agent approval queue
│   │   ├── marketplace/page.tsx    ← Module marketplace
│   │   ├── analytics/page.tsx      ← Analytics & intelligence
│   │   ├── log/page.tsx            ← Agent activity log
│   │   ├── settings/page.tsx       ← User settings
│   │   └── roadmap/page.tsx        ← Founder only (hidden from nav)
│   └── auth/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── src/
│   ├── components/
│   │   ├── dashboard/              ← 13 dashboard components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── AgentCard.tsx
│   │   │   ├── ScoreRing.tsx
│   │   │   ├── ApprovalCard.tsx
│   │   │   ├── ModuleCard.tsx
│   │   │   ├── InsightBubble.tsx
│   │   │   ├── MiniBarChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── RoadmapCard.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   └── StatusPill.tsx
│   │   └── landing/                ← Landing page components
│   │       ├── AnimatedAgentCard.tsx
│   │       └── AgentSequence.tsx
└── CLAUDE.md                       ← This file
```

---

## CURRENT BUILD STATUS

### Phase 1 — COMPLETE
- Landing page live at b2acapital.ai (byzant.ai transition planned)
- Supabase auth (login + signup)
- Dashboard shell with sidebar + topbar
- All 6 dashboard screens built
- Framer Motion animations on landing page
- Widget system with Add Widget + button
- Settings page with toggles and risk limits

### Phase 2 — IN PROGRESS
- Module marketplace with installed/available states
- Human approval queue with toggle-based approval
- Agent reasoning panel with AI analysis bubbles
- Agent activity log with full audit trail
- Analytics with scenario modeling

### Phase 3 — PLANNED
- AI Research Brief (Pro tier) — see below
- Mobile approval flow (PWA)
- Third-party module submissions
- Partner data provider integrations
- Referral and growth loops
- Paid tier launch

---

## PHASE 3 KEY FEATURE: AI RESEARCH BRIEF

One-click investment research memo generator on the Approvals page.
When an agent surfaces a trade request, the user can generate a
structured research brief on that ticker before approving.

What the brief covers:
- Trade thesis (why the agent is bullish or bearish)
- Key risks (downside scenarios and red flags)
- Valuation context (vs peers and history)
- Recent news (relevant headlines and sentiment)
- Options flow (institutional positioning signals)

How it works:
- "Generate Research Brief" button on each ApprovalCard
- Next.js API route: /api/research-brief
- Claude API with web_search tool enabled
- Structured memo returned and displayed in a modal/panel
- User reviews brief, then approves or declines the trade

Monetization: Pro tier add-on ($29-49/mo)
Inspiration: Perplexity Computer — but purpose-built for trading

---

## BUSINESS MODEL

Module Subscriptions (per agent/month):
- Basic: $9/mo — data feeds, basic analytics
- Pro: $29/mo — advanced modules, dark pool, options flow
- Institutional: $99/mo — full suite, priority, backtesting

Pro Tier ($29-49/mo):
- AI Research Brief generator
- Unlimited approval history
- Priority agent processing
- Advanced analytics

Marketplace Commission: 15-20% on third-party modules
Usage-Based: Metered API calls for high-frequency data
Agent Seat Pricing: Per-agent fee for multi-strategy users

---

## DASHBOARD SIDEBAR NAV (CURRENT)

Visible to all users:
- Dashboard (/dashboard)
- Approvals (/approvals) — red badge showing pending count
- Marketplace (/marketplace)
- Analytics (/analytics)
- Agent Log (/log)
- Settings (/settings)

Hidden (founder only, route exists but not in nav):
- Roadmap (/roadmap)

---

## CODING RULES — ALWAYS FOLLOW

1. NEVER touch app/page.tsx (landing page) unless explicitly asked
2. NEVER touch app/layout.tsx (root layout) unless explicitly asked
3. NEVER use orange — any orange found must be replaced with #99E1D9
4. ALWAYS use Sora + DM Mono, never system fonts as primary
5. ALWAYS add "use client" to components using hooks or event handlers
6. ALWAYS run: rm -rf .next && npm run dev after major edits
7. NEVER break existing pages when adding new features
8. All new dashboard pages go inside app/(dashboard)/
9. All CSS variables for dashboard use --db- prefix
10. All charts are inline SVG — no recharts, chart.js, or D3
11. All data is currently hardcoded — no API calls unless explicitly asked
12. Widget visibility state is stored in localStorage
13. Never install new npm packages without being asked to

---

## COMMON FIXES

Webpack chunk error (Cannot find module './XXX.js'):
→ rm -rf .next && npm run dev

White/broken dashboard after edits:
→ Check that CSS variables are in globals.css under :root
→ Ensure dashboard layout wrapper has background: var(--db-bg)

"use client" errors:
→ Add "use client" to top of any file using useState, useEffect,
  usePathname, useRouter, or onClick handlers

404 on dashboard routes:
→ Confirm file exists at app/(dashboard)/[route]/page.tsx
→ Confirm app/(dashboard)/layout.tsx exists and is valid

---

## DEPLOYMENT

Every push to the main branch on GitHub auto-deploys to Vercel.
Production URL: b2acapital.ai (byzant.ai transition planned)
Dev server: localhost:3000 (run: npm run dev)
Always test locally before pushing.

---

## WHAT SUCCESS LOOKS LIKE

Byzant becomes the default infrastructure layer that retail traders
use to connect, manage, and upgrade their AI trading agents. The
marketplace grows through third-party module developers, data provider
partnerships, and network effects. Every retail trader who has ever
lost money due to emotional decision-making is a potential customer.

Target: 500 waitlist signups → Phase 2 launch → paid tier → scale.

---

Byzant — Confidential — byzant.ai (b2acapital.ai during transition)
