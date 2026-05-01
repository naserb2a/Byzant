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

## TWO USER TYPES ARCHITECTURE

Byzant serves two distinct user types who share the same infrastructure
but differ in how the agent is provisioned. Both types use the same
dashboard, approval queue, marketplace, analytics, and agent log. The
fork happens only at onboarding step 3.

### Type 1 — Hosted Agent User (Non-Technical)
- No existing agent — Byzant provisions one via Anthropic's Claude
  Managed Agents API
- User selects model during onboarding (Claude, GPT-4, Gemini, Grok,
  OpenClaw, Other)
- Byzant manages runtime, system prompt, and module connections
  entirely
- Zero technical setup required
- Target: retail traders who couldn't set up Claude+Alpaca themselves

### Type 2 — BYO Agent User (Technical)
- Has an existing agent built on any framework
- Connects to Byzant's marketplace modules via MCP protocol
- Byzant provides API key and MCP connection string at onboarding
- Same dashboard, approval flow, modules — different runtime
- Target: developers and technical traders buffing up their existing
  agent

---

## TARGET CUSTOMER

Active retail traders who are already using or curious about AI agents.
Tech-forward, self-directed investors frustrated by emotional
decision-making and the gap between their tools and what institutions use.
They follow fintech Twitter/X, use TradingView, and are experimenting
with ChatGPT for market research. They want the emotionless second
opinion without losing control of their money.

---

## UX PRINCIPLES — NON-NEGOTIABLE

Byzant involves real money and real trade execution. Every UX
decision must reflect that seriousness. These rules apply to
every screen, flow, and feature:

**Onboarding is first impression.**
Ask only what is absolutely necessary to get the user into the
product. The 3-step onboarding (disclaimer, broker, model) is
the maximum. Never add steps without strong justification.

**Never ask personal or financial questions at onboarding.**
Capital size, income, net worth, account balance — none of this
belongs in onboarding. Users are exploring before they trust.
Collect sensitive data only inside specific module settings where
the context makes it obvious why it's needed.

**Delay configuration to the point of need.**
Risk profiles, position sizing, strategy settings — these belong
inside the relevant module, not at first impression. A user
activating the Risk Agent expects to configure it. A user signing
up does not.

**Always ask: would a user trust this with their money?**
Before building any screen or feature, apply this test. If the
answer is uncertain, flag it before building — not after.

**Users exploring the product are not yet committed.**
Friction, personal questions, or premature configuration requests
will cost users before they've seen the value. Get them to the
dashboard first. Let the product speak.

---

## ONBOARDING FLOW (UPDATED)

- **Step 1** — Terms & Risk Disclaimer — mandatory checkbox
- **Step 2** — Connect broker — Alpaca only at launch, OAuth not yet
  wired, skip option available
- **Step 3** — Fork:
  - **(A) Hosted** — choose model for Byzant-hosted agent
    (Claude, GPT-4, Gemini, Grok, OpenClaw, Other)
  - **(B) BYO** — connect your own agent via MCP — shows API key +
    MCP connection string

The fork at step 3 is the single decision point that splits Type 1 and
Type 2 users. Everything downstream (dashboard, approvals, marketplace,
log, analytics) is identical for both.

---

## TECH STACK

- Framework: Next.js 14 with App Router + TypeScript
- Styling: Tailwind CSS + custom CSS variables
- Fonts: Sora (display) + DM Mono (monospace/data)
- Auth + DB: Supabase
- Hosting: Vercel (auto-deploys from GitHub on push)
- Payments: Stripe (planned Phase 2)
- Animation: Framer Motion (landing page)
- Domain: byzant.ai (planned) — currently live at byzant.ai during transition
- Repo: github.com/naserb2a/Byzant

---

## DESIGN SYSTEM (NON-NEGOTIABLE — NEVER DEVIATE)

### Colors — THE BYZANT 6
The three Byzant brand colors are: **Black, White, and Teal (#99E1D9)**.
That is the entire brand. Plus three supporting tones for muted text
and elevated surfaces.

```
Primary black:    #000000   (primary dark background)
Near black:       #0a0a0a   (card backgrounds)
Elevated:         #111111   (elevated surfaces / nested / hover)
Teal accent:      #99E1D9   (buttons, badges, highlights, active states)
White:            #ffffff   (text, light sections)
Text muted:       #94a3b8   (secondary text)
```

### CSS variable map (globals.css)
```
--db-bg:           #000000   (page background)
--db-bg2:          #0a0a0a   (card background)
--db-bg3:          #111111   (nested/hover elements)
--db-bg4:          #1a1a1a   (deepest nesting)
--db-blue:         #99E1D9   (primary accent — teal)
--db-blue-bright:  #B2EBE5   (hover/highlight teal)
--db-ink:          #ffffff   (primary text)
--db-ink-muted:    #94a3b8   (secondary text)
--db-green:        #3dd68c   (semantic — bullish)
--db-red:          #ff5a5a   (semantic — bearish)
--db-amber:        #f0b429   (semantic — warning)
```

### ABSOLUTE COLOR RULES — ZERO EXCEPTIONS
- **NO blue. NO navy. Anywhere.** Not `#080c12`, `#0d1420`, `#111b2e`,
  `#4d9fff`, `#3B82F6`, `#60a5fa`, `#0a0f1a`, `#64748b`, `#eef2ff`, or
  any other shade of blue or navy. The primary accent is teal `#99E1D9`.
- **NO orange. Anywhere.** Not one instance. Ever.
- **NO purple gradients.**
- **NO hardcoded light colors** in dashboard components.
- If you see blue, navy, or orange — replace it immediately:
  blue/navy → `#99E1D9` (accent) or `#000000` / `#0a0a0a` / `#111111`
  (background); orange → `#99E1D9`.
- Semantic green (`#3dd68c`), red (`#ff5a5a`), amber (`#f0b429`) stay
  for status indicators only — they are not brand colors.

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
byzant/
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
- Landing page live at byzant.ai (byzant.ai transition planned)
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

## CURRENT LIVE STATE

- **Landing page** — LIVE at byzant.ai
- **Auth flow** — LIVE — `/auth`, `/auth/email`, `/signup`,
  `/signup/email`, Supabase + Google OAuth
- **Onboarding** — LIVE — 3 steps, Type 1 / Type 2 fork update pending
- **Dashboard** — LIVE — 6 screens, light mode default, dark mode
  toggle in Settings
- **Approvals page** — TradingView chart embedded, ticker label
  dynamic, price shows `—` pending Alpaca wire
- **Marketplace** — placeholder modules, needs replacing with actual
  planned modules
- **Analytics** — interactive Coinbase-style chart with time range
  selector (1W / 1M / 3M / 6M / 1Y / All)
- **Agent Log** — filters, search, pagination, export CSV all built
- **Whale Tracker** — 1001 real records from Apify, Apify webhook
  pipeline not yet built
- **+ New Agent modal** — built and working

---

## DECISIONS LOG (LOCKED)

- Light mode is default for dashboard
- Approval is always mandatory — toggle permanently removed
- Submit Module button deferred to Phase 3 post-launch
- Export Report and + New Agent buttons stay but need functional flows
  before launch
- TradingView widget used for chart visuals only — live price comes
  from Alpaca in Phase 2
- Approval card chart must switch ticker when user clicks a different
  card (prompt ready, build at Alpaca phase)
- Live Alpaca price must replace $118.40 hardcoded placeholder at
  Alpaca phase
- Analytics and Agent Log kept separate — Analytics is scorecard,
  Agent Log is audit trail
- Scenario Modeling deferred to Phase 2
- Confidence score and New Forecast features deferred post-launch
- "AI-generated forecasts · Confidence-weighted" subtitle removed from
  Analytics
- Site-wide color system unified to Black + Near-black + Elevated +
  Teal + White + Text-muted (`#94a3b8`). No blue, no navy anywhere —
  zero exceptions. All previous navy tokens (`#080c12`, `#0d1420`,
  `#111b2e`, `#0d1117`, `#141a22`, `#1a212b`) and blue accents
  (`#4d9fff`, `#3B82F6`, `#60a5fa`, `#4f8ef7`, `#6eb8ff`) replaced.
  Slate text (`#64748b`, `#eef2ff`) replaced with neutral
  (`#666666`, `#ffffff`).

---

## PHASE 1 REMAINING BLOCKERS (PRIORITY ORDER)

1. Alpaca OAuth wire-up — BLOCKER before real users
2. Wire live Alpaca price feed to approval card price display
3. Wire approval card click to switch TradingView chart ticker
4. Update onboarding step 3 — Type 1 / Type 2 fork
5. Apify schedule + webhook → Supabase pipeline for Whale Tracker
6. Congressional Tracker — Apify actor + dashboard page
7. Fix Marketplace — replace placeholder modules with actual planned
   modules (Whale Tracker, Congressional Tracker, Risk Agent,
   Trailing Stop Bot, Wheel Strategy Bot, Copy Trading Bot)
8. Add empty states to all dashboard pages
9. Fix Configure → dead links on Marketplace installed modules
10. Get lawyer to review all legal/disclaimer language before public
    launch

---

## POST-LAUNCH BACKLOG

- Submit Module button + third-party developer submission pipeline
- Confidence score feature
- New Forecast feature
- Scenario Modeling panel on Analytics
- Mobile approval flow (PWA) — Phase 3

---

## BROKERAGE ROADMAP

- **Alpaca Markets** — Launch (Phase 1). Primary broker. Full OAuth,
  paper + live trading, free tier. Clean API. Target: all user types.
- **Interactive Brokers (IBKR)** — Phase 2. Secondary broker. Target:
  Type 2 technical users who already have IBKR accounts. Use IBKR
  Client Portal API (REST, no TWS desktop app required). More complex
  implementation than Alpaca but critical for serious traders. Do not
  use TWS API — requires local desktop app running, not viable for web
  product.
- **Robinhood** — Never. No public API. Unofficial libraries violate
  ToS. Legal risk not worth it.
- **Webull** — Phase 3 consideration. Invite-only developer API.
  Pursue as partnership conversation only after launch traction is
  established.
- **TD Ameritrade / Schwab** — Phase 3 consideration. API in transition
  post-merger. Monitor Schwab developer access rollout.

"More brokerages coming soon" placeholder stays in onboarding UI until
IBKR is built in Phase 2.

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
Production URL: byzant.ai (byzant.ai transition planned)
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

Byzant — Confidential — byzant.ai (byzant.ai during transition)
