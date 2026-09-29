# The Unsent Archive

A shared diary of things people never said — built with Next.js (App Router)
and TypeScript. Entries are grouped by day like diary pages, organised into
8 "chapters" (collections), written on a single autosaving page, bookmarked
with Keep, and marked with "I felt this." Day and night (dark) themes follow
the OS setting, with a toggle in the top bar.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. That's it — no environment variables or
database are required to run it locally; see "Current data layer" below.

## Stack

- **Next.js 16** (App Router, Server Components, Route Handlers)
- **TypeScript**
- **Tailwind CSS v4** for utility classes, plus a hand-written design-token
  system in `src/app/globals.css` for the bespoke editorial pieces (the
  five story-card layouts, the hero, the write flow, the grain/vignette
  atmosphere) — these are intentionally *not* forced into Tailwind's
  utility syntax, because they're the visually distinctive parts of the
  design and are easier to read/maintain as real CSS.
- **@fontsource** (Fraunces, Newsreader, Fragment Mono, Caveat) — self-hosted font
  files bundled at build time, rather than a runtime Google Fonts request.

## Project structure

```
src/
  app/
    page.tsx                    Home (hero, collections, featured grid, seal)
    explore/page.tsx            All 8 collections
    explore/[collection]/page.tsx
    story/[id]/page.tsx         Reading view
    write/page.tsx              Wraps the client WriteFlow component
    keep/page.tsx                Personal saved-stories view (client)
    api/stories/route.ts        GET (list/search) + POST (publish)
    api/stories/[id]/route.ts   GET one
    api/stories/[id]/felt/route.ts   POST toggle felt count (rate-limited)
    globals.css                 Design tokens + all component styles
    layout.tsx                  Root layout: fonts, nav, overlays, footer
  components/                   Nav, StoryCard, WriteFlow, overlays, etc.
  lib/
    types.ts                    Story / Collection types
    data.ts                     Seed content (19 original stories, 8 collections)
    store.ts                    The in-memory "database" — see below
    localSetStore.ts            Client-side localStorage sync (Keep/Felt)
    events.ts                   Tiny event bus for triggering the singleton
                                 Search/Random overlays from anywhere
```

## Current data layer (read this before you rely on it)

`src/lib/store.ts` is an **in-memory** store — story data lives in server
memory, seeded from `src/lib/data.ts`. This was a deliberate choice to get
you a fully working, deployable prototype without needing database
credentials. Two things to know:

1. **It resets** whenever the server restarts, and on most serverless hosts
   (Vercel, etc.) each function instance gets its own memory — so writes
   from one request aren't guaranteed to be visible to another in
   production. Fine for local dev / a demo deploy; not durable.
2. It uses `globalThis` rather than a plain module-level variable,
   specifically because Next.js bundles every route (API routes, pages)
   independently — a plain `let stories = [...]` at module scope silently
   gets a *separate copy* per route bundle, even within one running
   process. This was found and fixed during testing (see the comment block
   in `store.ts` for the full explanation). If you refactor this file,
   keep that in mind.

**To go to production**, swap the inside of each function in `store.ts` for
calls to a real database (Postgres via Prisma, or the Supabase client are
both good fits for the brief's suggested stack). The function signatures
are already `async`, so nothing calling into `store.ts` needs to change.

Two client-only pieces of state are **not** in this store, by design:

- **Keep** (a person's saved stories) lives in `localStorage`
  (`src/lib/localSetStore.ts`), because it's private to that browser, not
  shared data.
- **"I felt this"** has both a local half (has *this browser* felt it —
  localStorage, so the button shows as toggled on return visits) and a
  shared half (the count itself, incremented via the `felt` API route and
  stored server-side).

## What's implemented vs. what's stubbed

Implemented and tested end-to-end (build, lint, and live HTTP requests
against every route and API endpoint, including error cases):

- All reading/browsing views, the write flow, search, keep, felt, and the
  random-discovery transition
- Server-side validation on story creation (title/body length, valid
  collection) — returns `400` with a message on failure
- Basic in-memory rate limiting on the felt-toggle endpoint (30/min per IP)
- Accessibility basics: skip link, semantic landmarks, visible focus
  states, `aria-pressed`/`aria-label` on icon-only controls,
  `prefers-reduced-motion` support, and text colors checked against WCAG AA
  contrast

Stubbed / not included, per the brief's "Technical Direction" and
"Content Moderation" sections — these need real infrastructure decisions
(which database, which auth provider, what moderation policy) that weren't
mine to make for you:

- **Persistent database** — see "Current data layer" above.
- **Authentication** — there's no login. "Use my name" on a published story
  is just a free-text field, not a verified identity.
- **Moderation** — no report/hide/admin-review flow, no content filtering
  or spam detection beyond the basic length validation and rate limit
  already in place.

## Story photos

Writers can optionally attach one photo when publishing. It is resized in
the browser, then re-encoded server-side with `sharp` (`src/lib/photos.ts`),
which rejects non-images and strips EXIF/GPS metadata, and stored in the
public `story-photos` Supabase Storage bucket. Stories without a photo show
none.

**Database setup:** see "Setting up Supabase" below — `supabase/schema.sql`
creates the photo columns and the bucket along with everything else.

## Setting up Supabase

1. Create a project at https://supabase.com/dashboard.
2. In its SQL editor, run `supabase/schema.sql` (tables, indexes, the
   `increment_felt` / `random_story` functions, RLS, and the photo bucket).
3. From Project Settings → API, put the project URL and the `service_role`
   key in `.env.local` as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Optional: to bring stories over from another project, add its values as
   `OLD_SUPABASE_URL` / `OLD_SUPABASE_SERVICE_ROLE_KEY` and run
   `node scripts/copy-stories.mjs` (dry run), then with `--write`.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — run a production build
- `npm run lint` — ESLint
