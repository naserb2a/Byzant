# AGENTS.md — Byzant Backend Agent Context

> This file is the permanent context document for Codex. Read it fully before every task. It is the backend equivalent of CLAUDE.md. Never deviate from the architecture, naming conventions, or rules defined here.

---

## 01 — WHAT IS BYZANT

Byzant is a protocol-native marketplace that sits between AI trading agents and financial markets. It gives retail traders access to institutional-grade data feeds, analytical tools, strategy bots, and risk modules — delivered through modular, agent-consumable capabilities built on the MCP (Model Context Protocol) standard.

**The core model:** Retail traders are the sponsors. Their AI agents are the operators. Byzant is the infrastructure layer connecting them to premium capabilities they could not otherwise access or afford.

**The tagline (locked):** "You are the arbiter." — The agent analyzes and surfaces decisions. The human approves or declines. Always.

**The legal position:** Byzant is a data and infrastructure marketplace only. It does not build or operate trading agents. It does not execute trades. It does not give financial advice. The user approves every trade — they are the arbiter. The liability chain is: data provider → Byzant module → user's agent → user approval → trade.

**Domain:** byzant.ai
**GitHub repo:** naserb2a/Byzant
**Vercel:** Auto-deploys from GitHub main branch
**Supabase project:** hilwxegefqmgwziiadjg.supabase.co

---

## 02 — TWO USER TYPES

Byzant serves two distinct user types. Both use the same dashboard, approval queue, marketplace, analytics, and agent log. The fork happens only at onboarding step 3.

### Type 1 — Hosted Agent (Non-Technical)
- No existing agent — Byzant provisions one on their behalf via Anthropic Claude Managed Agents API
- User selects their preferred model during onboarding (Claude, GPT-4, Gemini, Grok, OpenClaw, Other)
- Byzant manages the runtime, system prompt, and module connections entirely
- Zero technical setup required
- Target: retail traders who understand AI trading concepts but cannot set up the infrastructure themselves

### Type 2 — BYO Agent (Technical)
- Has an existing agent built on any framework (LangChain, custom, etc.)
- Connects to Byzant marketplace modules via MCP protocol
- Byzant provides an API key and MCP connection string at onboarding
- User points their existing agent at Byzant's MCP servers
- Target: developers and technical traders who want institutional-grade data infrastructure for their existing agent

---

## 03 — FULL TECH STACK

### Frontend (DO NOT TOUCH — Claude Code owns this)
- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Framer Motion (landing page animations only)
- Vercel — hosting, auto-deploy from GitHub
- Fonts: Inter (landing page headlines only), DM Mono (data labels only), system font (-apple-system) in dashboard

### Backend (Codex owns this)
- Next.js 14 API routes (in `app/api/`)
- Supabase — auth, database, real-time subscriptions
- Apify — scheduled web scraping and data pipeline
- Alpaca Markets API — broker connection, positions, orders
- Stripe — subscription billing (Phase 2)
- Redis — agent session state and caching (Phase 2)

### Agent Infrastructure
- MCP (Model Context Protocol) — agent-to-module communication standard
- Claude API (claude-sonnet-4-6) — trading agent intelligence layer
- Claude Managed Agents — hosted agent runtime for Type 1 users (Phase 3)

### Authentication
- Supabase Auth — Google OAuth + email/password
- First login redirects to /onboarding
- Subsequent logins redirect to /dashboard

---

## 04 — DATABASE SCHEMA (Supabase)

### Tables (existing or to be created)

**users**
- id (uuid, primary key, references auth.users)
- email (text)
- created_at (timestamp)
- user_type (text: 'hosted' | 'byo')
- selected_model (text: 'claude' | 'gpt4' | 'gemini' | 'grok' | 'openclaw' | 'other')
- broker_connected (boolean, default false)
- alpaca_access_token (text, encrypted)
- alpaca_refresh_token (text, encrypted)
- onboarding_complete (boolean, default false)

**whale_tracker**
- id (uuid, primary key)
- ticker (text)
- contract_type (text)
- strike (numeric)
- expiry (date)
- volume (integer)
- open_interest (integer)
- premium (numeric)
- sentiment (text: 'bullish' | 'bearish' | 'neutral')
- source (text)
- fetched_at (timestamp)
- raw_data (jsonb)

**congressional_trades**
- id (uuid, primary key)
- politician_name (text)
- party (text)
- state (text)
- ticker (text)
- trade_type (text: 'buy' | 'sell')
- amount_range (text)
- trade_date (date)
- disclosure_date (date)
- fetched_at (timestamp)
- raw_data (jsonb)

**agent_approvals**
- id (uuid, primary key)
- user_id (uuid, references users)
- agent_name (text)
- ticker (text)
- action (text: 'buy' | 'sell')
- shares (integer)
- entry_price (numeric)
- stop_loss (numeric)
- risk_reward (text)
- confidence (numeric)
- signal_source (text)
- status (text: 'pending' | 'approved' | 'declined')
- created_at (timestamp)
- resolved_at (timestamp)

**agent_log**
- id (uuid, primary key)
- user_id (uuid, references users)
- agent_name (text)
- action (text)
- details (jsonb)
- status (text: 'success' | 'error' | 'pending')
- created_at (timestamp)

**module_subscriptions**
- id (uuid, primary key)
- user_id (uuid, references users)
- module_id (text)
- status (text: 'active' | 'cancelled')
- stripe_subscription_id (text)
- created_at (timestamp)
- cancelled_at (timestamp)

---

## 05 — API ROUTES (app/api/)

All API routes live in `app/api/`. Use Next.js 14 App Router route handlers (`route.ts`). Always validate request method, authenticate user via Supabase session, handle errors with proper status codes, and return JSON.

### Webhook Routes (Apify → Supabase pipeline)

**POST /api/webhooks/apify/whale-tracker**
- Receives Apify actor output for datara/unusual-options-activity
- Validates webhook secret header
- Parses and normalizes the data
- Upserts records into `whale_tracker` Supabase table
- Responds 200 on success, 500 on failure

**POST /api/webhooks/apify/congressional**
- Receives Apify actor output for housestockwatcher.com scraper
- Validates webhook secret header
- Parses and normalizes politician trade data
- Upserts records into `congressional_trades` Supabase table
- Responds 200 on success

### Broker Routes

**POST /api/broker/alpaca/connect**
- Initiates Alpaca OAuth flow
- Stores access token and refresh token encrypted in Supabase users table
- Updates broker_connected to true

**GET /api/broker/alpaca/positions**
- Fetches live positions from Alpaca API using stored user token
- Returns normalized position data to frontend

**GET /api/broker/alpaca/price?ticker=NVDA**
- Fetches live price for a given ticker from Alpaca Data API
- Used by the Approvals page to replace hardcoded $118.40 placeholder

### Approval Routes

**GET /api/approvals**
- Returns all pending approvals for authenticated user
- Ordered by created_at desc

**PATCH /api/approvals/[id]**
- Updates approval status to 'approved' or 'declined'
- Logs action to agent_log table
- If approved, triggers Alpaca order execution (Phase 2)

### Data Routes

**GET /api/whale-tracker**
- Returns whale tracker records from Supabase
- Supports pagination, filtering by sentiment and ticker
- Ordered by fetched_at desc

**GET /api/congressional**
- Returns congressional trade records from Supabase
- Supports filtering by politician, party, ticker
- Ordered by trade_date desc

---

## 06 — APIFY DATA PIPELINE

Apify is the primary data scraping layer. All actors run on a schedule and push data to Byzant via webhooks.

### Actor 1 — Whale Tracker
- **Actor:** datara/unusual-options-activity
- **Source:** Barchart unusual options activity
- **Schedule:** Every 60 minutes, weekdays 9:30am–4:00pm ET (market hours only)
- **Cost:** ~$1.50/run (~$10.50/day)
- **Webhook target:** POST /api/webhooks/apify/whale-tracker
- **Data stored in:** whale_tracker Supabase table
- **Static data:** 1001 records already loaded at public/data/whale-data.json (fallback)

### Actor 2 — Congressional Tracker
- **Source:** housestockwatcher.com
- **Schedule:** Once daily, 8:00am ET weekdays
- **Cost:** ~$0.10/day
- **Webhook target:** POST /api/webhooks/apify/congressional
- **Data stored in:** congressional_trades Supabase table
- **Status:** Actor not yet built — needs to be created

### Webhook Security
All Apify webhooks must include a secret header `x-apify-webhook-secret` that matches an environment variable `APIFY_WEBHOOK_SECRET`. Validate this on every incoming webhook request and reject with 401 if missing or incorrect.

---

## 07 — ENVIRONMENT VARIABLES

All environment variables are stored in `.env.local` for local development and in Vercel environment settings for production. Never hardcode secrets. Always use `process.env.VARIABLE_NAME`.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hilwxegefqmgwziiadjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Apify
APIFY_API_TOKEN=your_apify_token
APIFY_WEBHOOK_SECRET=your_webhook_secret

# Alpaca
ALPACA_CLIENT_ID=your_alpaca_client_id
ALPACA_CLIENT_SECRET=your_alpaca_client_secret
ALPACA_REDIRECT_URI=https://byzant.ai/api/broker/alpaca/callback
ALPACA_BASE_URL=https://api.alpaca.markets
ALPACA_DATA_URL=https://data.alpaca.markets

# Stripe (Phase 2)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 08 — MARKETPLACE MODULES & PRICING

Each module is a paid monthly subscription. Codex is responsible for the data pipeline and backend logic that powers each module. Claude Code handles the UI.

| Module | Price | Data Source | Margin | Notes |
|--------|-------|-------------|--------|-------|
| Trailing Stop Bot | $9/mo | Alpaca API | ~100% | Near pure profit |
| Risk Agent | $29/mo | Alpaca API | ~100% | Near pure profit |
| Wheel Strategy Bot | $29/mo | Alpaca API | ~100% | Near pure profit |
| Copy Trading Bot | $29/mo | Apify ~$3/mo | ~90% | Near pure profit |
| Congressional Tracker | $29/mo | Apify ~$3/mo | ~90% | Near pure profit |
| AI Research Brief | $19/mo | Claude API | 20–75% | Usage-dependent |
| Real-time Options Flow | $49/mo | $50/mo flat | ~0% at 1 user | Breaks even at 2 users, 95% margin at 20+ |
| Whale Tracker | $29/mo | Apify ~$315/mo | Negative <11 users | CRITICAL: upgrade to Unusual Whales API ($50/mo flat) at 10+ subscribers |
| Full Platform Bundle | $149/mo | All included | Negative <3 users | Breaks even at 3, 96% margin at 50+ |

**MARGIN WARNING — Whale Tracker:** Runs at a loss until 11 paying subscribers. Do not scale Whale Tracker data frequency or cost until subscriber count justifies it. Upgrade to Unusual Whales API immediately at 10 subscribers.

---

## 09 — PHASE ROADMAP

### Phase 1 — Foundation (Current)
**Goal:** Get to real users. Wire all existing UI to live data.

Remaining blockers in priority order:
1. Wire Alpaca OAuth in onboarding step 2 — BLOCKER before real users
2. Wire live Alpaca price feed to Approvals page — replaces $118.40 hardcoded placeholder
3. Build Apify webhook API route → Supabase pipeline for Whale Tracker (every 60min market hours)
4. Build Congressional Tracker Apify actor + webhook pipeline + dashboard page
5. Fix Marketplace page — replace placeholder modules with real planned modules
6. Add empty states to all dashboard pages — new users will have no data
7. Get lawyer to review all legal/disclaimer language before public launch

### Phase 2 — Marketplace Launch
**Goal:** Launch paid modules, wire billing, build strategy bots.

- Risk Agent module ($29/mo)
- Trailing Stop Bot ($9/mo)
- Wheel Strategy Bot ($29/mo)
- Copy Trading Bot ($29/mo)
- Stripe billing integration + module subscription gating
- AI Research Brief — Claude API + web search ($19/mo)
- Wire approval cards to live Alpaca price feed
- Wire TradingView chart to switch ticker on approval card click
- Interactive Brokers (IBKR) broker connection

### Phase 3 — Ecosystem Growth
**Goal:** Scale, automate, open the marketplace.

- Claude Managed Agents integration — replace custom scheduler with Anthropic runtime
- Mobile approval flow (PWA)
- Multi-strategy portfolio bots
- Risk Agent v2 — cross-portfolio correlation
- Submit Module button + third-party developer submission pipeline
- Dark pool monitor upgrade to Unusual Whales API ($50/mo flat)
- Referral and growth loops
- Advanced analytics dashboard

---

## 10 — BROKERAGE ARCHITECTURE

### Alpaca Markets (Phase 1 — Launch Broker)
- Full OAuth support — one-click connection
- Paper trading and live trading
- Free tier available
- Used for: trade execution after user approval, live position data, live price feeds
- OAuth callback: /api/broker/alpaca/callback
- Base URL: https://api.alpaca.markets
- Data URL: https://data.alpaca.markets
- Status: UI exists in onboarding, OAuth not yet wired

### Interactive Brokers (Phase 2)
- Use Client Portal API (REST — no TWS desktop app required)
- Target Type 2 technical users
- Status: Phase 2 — not yet started

### Never Integrate
- Robinhood — no public API, unofficial libraries violate ToS
- Webull — invite-only developer API, not available
- TD Ameritrade / Schwab — API in transition post-merger, Phase 3 consideration

---

## 11 — ONBOARDING FLOW

The onboarding flow is 3 steps. First login triggers /onboarding. Subsequent logins go to /dashboard.

**Step 1 — Terms & Risk Disclaimer**
- Mandatory checkbox before proceeding
- Legal disclaimer text explaining Byzant is a data and infrastructure marketplace only
- No financial advice is given

**Step 2 — Connect Broker**
- Alpaca only at launch
- Two paths: Connect Alpaca (OAuth) or Skip (data-modules-only mode)
- "More brokerages coming soon" shown as placeholder
- OAuth UI exists, not yet wired to actual Alpaca OAuth

**Step 3 — Agent Type Fork**
- Option A: Byzant-hosted agent — user picks model (Claude, GPT-4, Gemini, Grok, OpenClaw, Other)
- Option B: Connect your own agent — user receives API key + MCP connection string

---

## 12 — SECURITY & AUTH RULES

- All API routes must authenticate the user via Supabase session before returning data
- Use `createRouteHandlerClient` from `@supabase/auth-helpers-nextjs` for server-side auth in API routes
- Never expose service role key to the client
- Alpaca tokens must be stored encrypted — never in plaintext
- All webhook routes must validate the webhook secret header before processing
- Rate limit all public-facing API routes
- Never log sensitive data (tokens, passwords, financial account details)

---

## 13 — CODE STYLE & CONVENTIONS

- Language: TypeScript throughout — no plain JavaScript files
- Framework: Next.js 14 App Router — use `app/api/` for all API routes
- Route handlers: Use `route.ts` files with exported GET, POST, PATCH, DELETE functions
- Error handling: Always wrap in try/catch, return proper HTTP status codes with JSON error messages
- Environment variables: Always use `process.env.VARIABLE_NAME`, never hardcode
- Database: Always use Supabase client, never raw SQL strings without parameterization
- Naming: camelCase for variables and functions, PascalCase for types and interfaces, snake_case for database column names
- Comments: Add comments for any non-obvious logic, especially around financial data handling
- Never commit secrets, tokens, or API keys to the repository

---

## 14 — WHAT CODEX OWNS vs WHAT CLAUDE CODE OWNS

### Codex owns (backend only):
- All files in `app/api/`
- Supabase schema, migrations, and database configuration
- Apify webhook pipeline and data normalization
- Alpaca OAuth flow and broker integration
- Stripe billing integration (Phase 2)
- Environment variable configuration
- Server-side authentication logic
- Data fetching and caching logic
- MCP server configuration (Phase 2)

### Claude Code owns (do not touch):
- All files in `app/(dashboard)/` — dashboard UI components
- All files in `app/(landing)/` or `app/page.tsx` — landing page
- All files in `components/` — UI components
- All files in `public/` — static assets
- All Tailwind CSS styling
- All Framer Motion animations
- `CLAUDE.md` — Claude Code's context file

### Shared (coordinate carefully):
- `app/layout.tsx` — root layout
- `lib/supabase/` — Supabase client configuration
- `types/` — TypeScript type definitions
- `middleware.ts` — auth middleware

---

## 15 — BRANCH STRUCTURE

- `main` — production branch, live at byzant.ai, auto-deploys to Vercel
- `landing-revamp` — active frontend branch, Linear-inspired landing page rebuild, NOT yet merged to main
- All backend work should be done on `main` or a dedicated feature branch, then merged via PR
- Never push directly to `main` without testing
- Always write a clear, descriptive commit message

---

## 16 — FIRST PRIORITY TASKS FOR CODEX

These are the immediate Phase 1 backend tasks in order of priority:

1. **Build POST /api/webhooks/apify/whale-tracker** — receive Apify webhook, validate secret, parse data, upsert to whale_tracker Supabase table
2. **Create whale_tracker table in Supabase** — schema as defined in Section 04
3. **Build POST /api/webhooks/apify/congressional** — same pattern as whale tracker
4. **Create congressional_trades table in Supabase** — schema as defined in Section 04
5. **Build Alpaca OAuth flow** — /api/broker/alpaca/connect + /api/broker/alpaca/callback, store tokens encrypted
6. **Build GET /api/broker/alpaca/price** — live price feed for Approvals page
7. **Build GET /api/broker/alpaca/positions** — live positions for dashboard

---

*Byzant — Confidential — Backend Agent Context — byzant.ai — "You are the arbiter."*
