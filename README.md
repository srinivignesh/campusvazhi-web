# CampusVazhi Web

Next.js 14 (App Router) frontend for [campusvazhi.com](https://campusvazhi.com).

## Stack

- Next.js 14 (App Router, RSC, TypeScript)
- Supabase (Postgres + service-role writes via API route)
- Deployed on Vercel
- DNS on Cloudflare (proxy off)
- Domain: `campusvazhi.com` (`.in` 301-redirects to `.com` — handled separately)

## Local dev

```bash
cp .env.local.example .env.local
# fill in Supabase URL, anon key, service role key

npm install
npm run dev
```

## Env vars (Vercel)

| Name | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Prod + Preview + Dev | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Prod + Preview + Dev | Safe to ship to the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Prod + Preview (NOT Dev) | **Server-only.** Bypasses RLS. |

## Database

Migration lives in `supabase/migrations/0001_leads.sql`. Run it once against the Supabase project either via the SQL editor or the Supabase CLI.

The `leads` table has RLS enabled with **no policies** — writes only happen via the service-role key inside `/app/api/leads/route.ts`.

## Lead capture flow

1. User hits homepage → enters phone number in compact form.
2. Client-side validates Indian mobile format, expands to full form.
3. User enters name, current status (enum), optional college.
4. `POST /api/leads` → server validates, normalizes phone to E.164, inserts into `leads`.
5. Dedupe on phone via unique index (23505 → treated as success).
6. Honeypot field `website` silently drops bots.
7. In-memory rate limit: 5 POSTs per IP per minute.

## Roadmap

- [x] Phase C: holding page + DNS + Vercel deploy
- [x] Phase A: Next.js scaffold + Supabase lead capture
- [ ] Phase B: full homepage with all 6 verticals
- [ ] TANCET resource hub (`/tancet`)
- [ ] College directory (`/colleges`) — programmatic SEO
- [ ] Parent-facing landing (`/parents`)
