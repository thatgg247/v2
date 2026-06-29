# Series OS 2.0

> The operating system for founders — Investor Ready, Grant Ready, Enterprise Ready.

## Quick Start

### Prerequisites
- Node.js 20+
- Docker (for local PostgreSQL + Redis)
- npm 10+

### 1. Clone & Install
```bash
git clone https://github.com/your-org/seriesos-v2.git
cd seriesos-v2
npm install
```

### 2. Environment Variables
```bash
cp .env.example apps/web/.env.local
# Fill in all values — see .env.example for descriptions
```

### 3. Start Local Services
```bash
docker-compose up -d
# Starts PostgreSQL on :5432 and Redis on :6379
```

### 4. Set Up Database
```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed demo data
```

### 5. Start Development Server
```bash
npm run dev
# App runs at http://localhost:3000
# Login: admin@seriosos.com / Password123!
```

---

## Architecture

```
seriesos-v2/
├── apps/
│   └── web/                    # Next.js 15 App Router (TypeScript)
│       ├── app/
│       │   ├── (auth)/         # Login, signup, verify, reset
│       │   ├── (dashboard)/    # All authenticated routes
│       │   └── api/            # tRPC + webhook handlers
│       ├── components/         # React components
│       └── lib/
│           ├── auth.ts         # NextAuth.js v5 config
│           ├── trpc.ts         # tRPC server config
│           └── routers/        # 14 tRPC routers
└── packages/
    ├── db/                     # Prisma schema + Supabase client
    ├── lib/                    # Shared utilities (encryption, constants)
    ├── ai/                     # Claude AI service (server-side)
    ├── email/                  # SendGrid email service (server-side)
    ├── billing/                # Stripe billing service
    └── queue/                  # BullMQ job queue definitions
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| API | tRPC (end-to-end type safe) |
| Database | PostgreSQL via Supabase + Prisma |
| Auth | NextAuth.js v5 (email/password + Google OAuth + MFA) |
| AI | Anthropic Claude (server-side — Series OS owns the key) |
| Email | SendGrid (server-side — Series OS owns the key) |
| Jobs | BullMQ + Upstash Redis |
| Billing | Stripe |
| Deployment | Vercel + Supabase |

## Environment Variables

All required variables are in `.env.example`. Key ones:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random 32-byte secret (`openssl rand -base64 32`) |
| `ANTHROPIC_API_KEY` | Claude API key — Series OS owns this, never the user |
| `SENDGRID_API_KEY` | SendGrid key — Series OS owns this |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM (`openssl rand -hex 32`) |
| `REDIS_URL` | Redis URL (Upstash in prod, localhost in dev) |

## Database

The Prisma schema defines 22 tables across 6 domains:

- **Core**: organizations, users, companies, accounts, sessions
- **Readiness**: readiness_scores, readiness_portals, compliance_requirements
- **Data Room**: data_rooms, documents
- **Funding**: investors (global), grants (global), pipelines
- **Outreach**: ai_outputs, outreach_events, send_queue, suppression_lists
- **Platform**: subscriptions, usage_events, audit_logs, certifications, notifications

Run migrations: `npm run db:migrate`
View in browser: `npm run db:studio`

## Subscription Plans

| Plan | Price | Companies | Seats | AI Credits |
|------|-------|-----------|-------|-----------|
| Founder Starter | $29/mo | 1 | 1 | 100 |
| Founder Pro | $79/mo | 3 | 3 | 500 |
| Founder Scale | $149/mo | 5 | 5 | 2,000 |
| Advisor | $99/mo | 10 | 5 | 1,000 |
| Accelerator | $499/mo | 50 | 20 | 10,000 |
| Enterprise | Custom | Unlimited | Unlimited | Unlimited |

## Security

- All AI and email API keys are server-side only — users never manage them
- MFA support via TOTP (Google Authenticator compatible)
- AES-256-GCM encryption for sensitive fields (bank tokens, MFA secrets)
- Supabase Row-Level Security enforces tenant isolation at the database level
- Audit log on every data mutation
- Rate limiting on auth and AI routes via Upstash Redis
- Content Security Policy headers on all routes

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Platform Foundation | ✅ **This repo** | Auth, DB, billing, tRPC, CI/CD |
| 2 — Readiness Engine | 🔜 Next | Questionnaire, scoring, portal locks |
| 3 — Compliance Intelligence | 🔜 | Industry-specific compliance + AI advisor |
| 4 — Data Room | 🔜 | Secure vault, watermarks, access controls |
| 5 — Funding CRM | 🔜 | Investor/grant DB, AI matching |
| 6 — Outreach Engine | 🔜 | Email sequences + investor protection system |
| 7 — Marketplace | 🔜 | Provider listings, commissions |
| 8 — Certifications | 🔜 | Readiness badges |
| 9 — Enterprise | 🔜 | White-label, accelerator dashboards |
| 10 — Monetization | 🔜 | Full billing, usage metering, referrals |

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run pending migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
```

---

Built with ❤️ for founders, by founders.
