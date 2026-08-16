# Wedding Invitation

An animated online wedding invitation for Vu Trong Doan & Nhi Thi Khanh Dinh —
20 December 2026, Ho Chi Minh City, Vietnam.

Guests land on a sealed envelope, tap it open, read the letter, and RSVP.
The couple sees every reply at `/host`.

## Running it

Two modes. Local is the default choice for day-to-day work — it never touches
the real guest data.

```bash
npm install
# add HOST_PASSWORD to .env.local (see .env.example)

npm run dev:local    # local PGlite database — Neon is not touched
npm run dev          # the real Neon database, live replies
```

- Invitation: http://localhost:3000
- Host dashboard: http://localhost:3000/host

`dev:local` runs **real Postgres** — PGlite, compiled to WASM and persisted to
`.pglite/` (git-ignored). Same SQL, same `ON CONFLICT` behaviour, no server and
no network. It creates its own schema on first use, so there is no setup step,
and `npm run db:reset-local` wipes it.

While local mode is on, the host dashboard carries a "Local database" banner so
the two can never be confused. Local mode is strictly opt-in via `USE_LOCAL_DB=1`
— it deliberately does *not* engage when `DATABASE_URL` is missing, so a
misconfigured deployment fails instead of quietly writing replies to a throwaway
file.

To work against Neon, pull the real credentials and apply the schema once:

```bash
vercel env pull .env.local --yes
npm run db:migrate
```

## Stack

Next.js (App Router) + React + Tailwind, with Neon Postgres provisioned through
the Vercel Marketplace.

Replies live in one `rsvps` table. [db/schema.sql](db/schema.sql) is the single
source of truth — [scripts/migrate.mjs](scripts/migrate.mjs) applies it to Neon,
and the local database applies it automatically. Both are idempotent.

[lib/sql.ts](lib/sql.ts) chooses the driver and is the only file that knows
which database is in play; [lib/db.ts](lib/db.ts) holds the queries and works
against either. Nothing else in the app touches storage.

The upsert is keyed on `name_key` (the guest's name, lowercased and with
whitespace collapsed) under a unique index, so `INSERT … ON CONFLICT DO UPDATE`
is atomic across every serverless instance. This is the reason for a real
database rather than a JSON file: on Vercel the filesystem is ephemeral *and*
per-instance, so two guests replying at the same moment would hit different
instances and one reply would be silently lost.

## Editing the details

Names, date, location and dress code all live in [lib/wedding.ts](lib/wedding.ts).
Nothing is hard-coded in the components.

Names are modelled as `firstName` (what they go by), `displayName` (the large
form on the card) and `fullName` (the formal Vietnamese name, shown small
beneath). Because the guests are largely foreign, `displayName` is Westernised —
"Vu Doan", "Nhi Dinh" — while `fullName` keeps the Vietnamese order intact.

There is deliberately no `firstName` / `lastName` split anywhere. In Vietnamese
names the given name comes last, so that split mislabels both halves. Guests get
a single "Your full name" field for the same reason.

## How RSVP privacy works

Guests type their own name rather than picking from a pre-loaded list, which
raises the obvious question: does declining expose you? The design follows what
Zola, Joy, The Knot, Greenvelope and Paperless Post actually do.

**The decline option stays.** No platform hides it — headcount is the entire
point, and etiquette treats a reply as owed to the host either way.

**Privacy comes from the response being private, not from removing the button:**

- No guest list, count, or roster anywhere a guest can see. `/host` is the only
  place replies are visible, behind a password.
- **The form never reads anything back.** `POST /api/rsvp` returns exactly
  `{ok: true}` whether it created a reply or replaced one. Echoing an "updated"
  flag would let anyone type a name and learn that person had already replied —
  the leak that makes a decline list public with extra steps.
- No autocomplete, name lookup, or prefill of a previous answer.
- Both choices get equal visual weight. A greyed-out or shrunken decline button
  reads as disapproval.
- Declining skips the logistics questions entirely — being asked "how many of
  you?" after saying no is the awkward part.
- No "are you sure?" prompt on the decline path. A second-guess reads as the
  couple pushing back on the answer.
- No "why can't you come?" field. A guest owes an answer, not a reason.
- The wording pairs a plain accept with a softened decline, as printed reply
  cards have always done: *Joyfully accepts* / *Regretfully declines —
  celebrating from afar*.
- Both pages are `noindex`, so the invitation stays unlisted.

## Host dashboard

Password from `HOST_PASSWORD`; the session is an HMAC-signed, httpOnly cookie
valid for 12 hours. Shows totals (replies, parties joining, total heads,
declines), filters, each guest's note, CSV export, and per-reply removal.

## Deploying

```bash
vercel deploy --prod
```

`DATABASE_URL` is injected by the Neon Marketplace integration. `HOST_PASSWORD`
is not — set it once per environment:

```bash
vercel env add HOST_PASSWORD production
```

Run the migration against the production database before the first deploy.
