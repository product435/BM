# BMI Jaipur 2026 — Technical Documentation

**System Audit — Read-only inspection**

A ground-truth inspection of the BM Investment event-registration platform: what's built, what's wired to Supabase, what's still static, and where the implementation diverges from what the code — or its own copy — claims about itself.

| | |
|---|---|
| **Repository** | `BM/` |
| **Frontend** | React 19 · Vite 7 |
| **Backend** | Supabase (Postgres · Auth · Edge Functions · Storage) |
| **Method** | Static code inspection, no execution |

Compiled from a static, read-only inspection of the repository as it exists on disk. No code was executed, modified, or deployed to produce this report. Claims marked **Not verified** require checking the live Supabase project or hosting dashboard directly.

## Table of Contents

**Foundations**
1. [Project Overview](#01--project-overview)
2. [Complete Technology Stack](#02--complete-technology-stack)
3. [Project Folder Structure](#03--project-folder-structure)
4. [Frontend Architecture](#04--frontend-architecture)
5. [Page-by-Page Breakdown](#05--page-by-page-breakdown)

**Data & Backend**
6. [Registration Flow](#06--registration-flow)
7. [Backend Architecture](#07--backend-architecture)
8. [Database](#08--database)
9. [Authentication & Authorization](#09--authentication--authorization)
10. [Data Flow — Major Features](#10--data-flow--major-features)

**Surfaces**
11. [Social Media & External Links](#11--social-media--external-links)
12. [Admin Panel](#12--admin-panel)
13. [API / Service Layer](#13--api--service-layer)
14. [Environment & Configuration](#14--environment--configuration)
15. [Responsive / UI System](#15--responsive--ui-system)

**Verdict**
16. [Static vs. Dynamic — Full Feature Table](#16--static-vs-dynamic--full-feature-table)
17. [Deployment](#17--deployment)
18. [Current Working Status](#18--current-working-status)
19. [Security Review](#19--security-review)
20. [Final Architecture Summary](#20--final-architecture-summary)
21. [Important File Index](#21--important-file-index)
22. [Final Project Status](#22--final-project-status)

---

## 01 — Project Overview

A marketing and registration site for BMI's Jaipur 2026 startup/investment event, paired with an internal admin console for editing site content and managing registrations.

| | |
|---|---|
| **Package name** | `bmi-event` |
| **Type** | Single-page marketing site + gated admin SPA, same build |
| **Status** | **Partially verified** — implementation is broad and mostly wired to Supabase, but several findings below (§18, §19) show gaps between what the code does and what it claims to do |

### User-facing features

- Fourteen-section landing page: hero, event intro, "why it matters," experience carousels, participation categories, funding model, how-it-works, guest carousel, FAQ, event-day highlights, venue, registration, final CTA, footer.
- A four-category registration form (Student / Visitor / Entrepreneur / Business Tycoon) with per-category fields, a dynamic fee display, and a UPI QR code for manual payment.
- A floating WhatsApp contact button and footer social links (Facebook, Instagram, YouTube, WhatsApp — X/Twitter has no live URL, see §11).

### Admin features

- Password-gated dashboard (`/admin`) with a registrations table, search/filter/status editing, CSV export, and a QR check-in scanner.
- Content editors for the hero, venue, guests, event-day experience, Q&A, "the event" intro, and the registration form builder itself (categories, fields, fees, UPI ID) — each with a live component preview.

> **Scope note** — A PRD exists at `docs/BMI_Jaipur_2026_PRD.md` describing a considerably larger system — four participation "tracks," pitch decks, PDF tickets, an automated payment gateway, and an application-review pipeline. The implemented app is narrower: four registration categories, a manual UPI QR, and no automated payment verification. Treat the PRD as aspirational, not as a description of current behavior.

---

## 02 — Complete Technology Stack

Every dependency in `Frontend/package.json`, cross-checked against actual imports rather than taken on the name alone.

### Core runtime

| Package | Version | Notes |
|---|---|---|
| React | 19.2.6 | UI runtime for the whole app. Entry: `src/main.jsx`. |
| Vite | ^7.3.6 | Dev server & build tool. Config: `vite.config.ts`. |
| vite-plugin-singlefile | 2.3.0 | Inlines the entire production build — JS and CSS — into one `dist/index.html`. No code-splitting, no separate chunks. |
| react-router-dom | ^7.18.3 | Client-side routing — 4 routes total (§4). Used in `App.jsx`, `ProtectedRoute.jsx`. |

### Backend / data

| Package | Version | Notes |
|---|---|---|
| @supabase/supabase-js | ^2.114.0 | Postgres client, Auth, Storage, Edge Function invocation. Initialized once in `src/lib/supabase.js`. |

### UI & interaction

| Package | Version | Notes |
|---|---|---|
| framer-motion | ^13.2.0 | Enter/exit animation, mainly inside the Admin components and the auth screens (`AdminLogin.jsx`, `UpdatePassword.jsx`). |
| lucide-react | ^1.40.0 | Icon set used across the Admin console and `ProtectedRoute.jsx`. |
| react-qr-code | ^2.2.0 | Renders the UPI-payment QR in `RegistrationForm.jsx` and the check-in pass in `TicketPass.jsx`. |
| html5-qrcode | ^2.3.8 | Camera-based QR scanning for check-in, in `AdminScanner.jsx` only. |

### Styling

| Package | Version | Notes |
|---|---|---|
| Plain CSS | — | The primary system — hand-authored BEM-ish classes in `styles/globals.css` (1,341 lines) and `styles/components.css` (3,630 lines), driven by a real CSS custom-property design-token palette. |
| Tailwind CSS | 4.1.17 | Present and wired (`@tailwindcss/vite`, imported in `globals.css` line 1), but used narrowly — only `ProtectedRoute.jsx`, `AdminLogin.jsx`, and `UpdatePassword.jsx` use its utility classes. The rest of the app doesn't touch it. |
| clsx / tailwind-merge | 2.1.1 / 3.4.0 | **Unused** — listed as dependencies; no import of either found in any component read during this audit. |

### Build-only / type support

| Package | Version | Notes |
|---|---|---|
| TypeScript | 5.9.3 | Configures `vite.config.ts` only. No `.ts`/`.tsx` application code exists — the app itself is plain JSX. |

> **Finding** — No test framework of any kind is present — no Vitest, Jest, Playwright, or Cypress dependency; no config file; no `*.test.*` files anywhere in the repository.

---

## 03 — Project Folder Structure

The repository root holds a thin dev-orchestration wrapper; the real application lives entirely under `Frontend/`.

| Path | Contains |
|---|---|
| `BM/package.json` | Root dev script — runs the frontend dev server and local Supabase together via `concurrently`. Note: references `--prefix frontend` (lowercase) against an actual folder named `Frontend` — works only on case-insensitive filesystems. |
| `BM/docs/` | Product spec (`BMI_Jaipur_2026_PRD.md`), a brochure PDF, and brand images — reference material, not consumed by the app at build or run time. |
| `BM/supabase/` | Supabase project config (`config.toml`), 10 tracked SQL migrations, one Edge Function (`functions/send-email`), and a seed file. |
| `Frontend/public/` | Static assets served as-is — favicon, `images/`, `videos/` (hero background video lives here). |
| `Frontend/src/main.jsx` | React entry point — mounts `<App />`, imports both global stylesheets. |
| `Frontend/src/App.jsx` | Route table, provider tree, and the landing-page composition (fetches 5 Supabase tables, renders all 14 sections in order). |
| `Frontend/src/components/` | 38 component files — 26 public-site components, 12 `Admin*` console components. No further subfolders (no `pages/` directory — routing is flat). |
| `Frontend/src/context/` | `SiteContext.jsx` (guests + FAQ data) and `AdminThemeContext.jsx` (dark/light admin theme, localStorage-persisted). |
| `Frontend/src/data/` | `eventData.js` — the single source of truth for static fallback copy, fees, categories, and constants; `guests.js` — fallback guest list. |
| `Frontend/src/lib/supabase.js` | The one Supabase client instance, imported by every component that talks to the database. |
| `Frontend/src/styles/` | `globals.css` (tokens, resets, hero, nav, footer) and `components.css` (every section's own styling) — no CSS Modules, no styled-components. |
| `Frontend/*.sql, *.mjs` | Loose, untracked SQL scripts and Node data scripts (`insert_registration_content.sql`, `insert_event_intro.sql`, `alter_registration_content.sql`, `insert_content.sql`, `generate_json.mjs`, `insert_mock_data.mjs`) — see §8 for why this matters. |

> **No hooks/, no services/ folder** — There is no dedicated `hooks/`, `services/`, or `utils/` directory. Data fetching is inlined directly inside each component via `useEffect` + `supabase.from(...)` calls — there is no shared service layer (see §13).

---

## 04 — Frontend Architecture

### Boot sequence

```
index.html
  ↓
src/main.jsx — createRoot, mounts <App /> in StrictMode
  ↓
App.jsx — SiteProvider → AdminThemeProvider → Router → AuthListener + Routes
```

### Routing

| Path | Element | Guard |
|---|---|---|
| `/` | LandingPage (inline in App.jsx) | None |
| `/admin/login` | AdminLogin.jsx | None |
| `/admin/update-password` | UpdatePassword.jsx | None (reached via Supabase recovery link) |
| `/admin` | AdminDashboard.jsx | ProtectedRoute.jsx — session + `profiles.role === 'admin'` (§9) |

### State management

No global store (no Redux/Zustand/Jotai). State is local component state (`useState`/`useEffect`) plus two React Contexts — `SiteContext` for guest/FAQ data and `AdminThemeContext` for the admin console's own color theme. Page-level content (hero, venue, Q&A, event-day experience) is fetched once in `App.jsx` and passed down as props, not re-fetched per component.

### Form handling & validation

Hand-rolled, no form library. `RegistrationForm.jsx` implements its own floating-label fields, per-field `validateField()` (required / email / phone-pattern / URL / city-pattern), and input sanitization on keystroke. Errors surface inline below each field; the first invalid field receives programmatic focus on submit.

### Responsive behavior

Breakpoint-driven plain CSS, primarily `@media (max-width: 640px)` and a secondary `1024px` tablet tier, applied per-component throughout `components.css`. Carousels switch from multi-item desktop grids to single-slide scroll-snap tracks on mobile; the registration category list collapses the form below the cards until a category is chosen (mobile only).

### Loading / error states

Data-fetching components render their static fallback content immediately and swap in Supabase data once it resolves — there is no visible loading spinner or skeleton state on the public site; a slow network shows static copy, not a loading indicator. Supabase errors are generally `console.error`-only and silently fall back to defaults, rather than surfacing to the user.

---

## 05 — Page-by-Page Breakdown

The public site is a single route (`/`) composed of 14 in-page sections, plus the separate admin surface. "Dynamic" below means the section fetches from Supabase and falls back to static content if that fetch is empty or fails.

| Section | Component | Data | Source table |
|---|---|---|---|
| Nav / Header | `Navbar.jsx` | Static | — |
| Hero | `Hero.jsx` | Dynamic (partial) | `hero_content` |
| 01 — The Event | `EventIntro.jsx` | Dynamic | `event_intro` (untracked) |
| 02 — Why It Matters | `WhyItMatters.jsx` | Static | — |
| 03 — The Experience | `EventExperience.jsx` | Static | — |
| 04 — Participation | `ParticipationCategories.jsx` | Static | — (not synced with form_config) |
| 05 — Funding | `FundingOpportunity.jsx` | Static | — |
| 06 — How It Works | `HowItWorks.jsx` | Static | — |
| 07 — The Guests | `Guests.jsx` | Dynamic | `guests`, `site_content` (2nd untracked) |
| 08 — Q&A | `QnASection.jsx` | Dynamic | `qa_session` |
| 09 — Event Day | `Highlights.jsx` | Dynamic | `event_experience` |
| 10 — The Venue | `JaipurSection.jsx` | Dynamic | `venue_content` |
| 11 — Registration | `Registration.jsx` + `RegistrationForm.jsx` | Dynamic | `registration_content`, `form_config`, `registrations` |
| Final CTA | `FinalCTA.jsx` | Static | — |
| Footer | `Footer.jsx` | Static | — |

> **Hero video is hardcoded** — `App.jsx` passes a fixed path — `/videos/apna_jaipur.mp4` — as the hero background regardless of whatever `hero_content.hero_image` holds in Supabase (an explicit code comment confirms this is deliberate). The admin's "Replace hero image" upload in `AdminHero.jsx` updates the database and its own live preview, but has no effect on what visitors actually see.

### Admin surface (single route: `/admin`)

`AdminDashboard.jsx` is a sidebar-switch shell, not separate routes — it swaps content panels client-side. See §12 for the full breakdown of every panel and its wiring status.

---

## 06 — Registration Flow

One shared component, `RegistrationForm.jsx`, renders all four categories from one field-config object and one submit handler.

```
1. Visitor opens the Registration section, taps a category card
   ↓
2. chooseCategory(id) swaps the field set + resets values/errors
   ↓
3. Category-specific fields render, sourced from form_config.form_fields (or the static fallback)
   ↓
4. On submit, validateField() runs for every field; first error gets focus
   ↓
5. submitRegistration() inserts into registrations, invokes the send-email Edge Function
   ↓
6. Success card renders; registration appears in Admin's live-updating table
```

### Field differences by category

| Field | Student | Visitor | Entrepreneur | Business Tycoon |
|---|---|---|---|---|
| Name field | Full Name | Full Name | Founder Name | Contact Person Name |
| Org field | College / Institution | — | Startup Name | Business Name |
| Email, Phone, City, Role | Common to all four | | | |
| Extra classifier | Idea / Interest (optional) | — | Industry / Category | — |
| Description (textarea) | Short Description | None — Visitor's is a single-line input, not a textarea | Startup Description | Business Description |
| Extra link | — | — | Website / LinkedIn (optional) | — |
| Fee | ₹0 | ₹500 | ₹1,000 | ₹2,000 |

### What gets written to `registrations`

`registration_id` (a random `REG-#####` string, 5 digits — not collision-checked before insert), `name` (whichever of fullName/founderName/contactPerson exists), `email`, `phone`, `city`, `track`, `status: 'Pending'`, `payment_status: 'Pending'`, and every remaining field packed into a `details` JSONB column.

> **Confirmed bug — track mislabeling** — The category-to-track mapping in `submitRegistration()` (`RegistrationForm.jsx` lines 19–22) only matches category ids `"student"`, `"startup"`, and `"school"` — but the real category ids used throughout the app are `student / visitor / entrepreneur / businessTycoon`. Neither `"startup"` nor `"school"` is ever an actual category, so those two branches are dead code, and any category that isn't `"student"` — including **Entrepreneur and Business Tycoon** — falls through to the default and is stored with `track = "Visitor"`. Verified directly against the source.

---

## 07 — Backend Architecture

Supabase is the entire backend — there is no separate Node/Express API server. The frontend talks to Postgres directly through the Supabase JS client, using the public anon key and table-level Row Level Security for access control.

| Layer | Implementation |
|---|---|
| Client | `src/lib/supabase.js` |
| Reads | `supabase.from('table').select('*')` |
| Writes | `supabase.from('table').insert([...]) / .update({...}).eq('id', 1)` |
| Server-side logic | One Edge Function only — `send-email` (Deno runtime, calls the Resend API) |
| File uploads | Supabase Storage, single public bucket `hero_media`, used by every Admin content editor |

### Error handling

Consistent pattern across content-fetching components: destructure `{ data, error }` from the Supabase call, and only act on `data` if `!error` — on any failure, the component silently keeps its static fallback. The registration submit path is the exception: it throws a user-facing error ("Registration failed. Please try again.") if the insert fails, though the email-send failure is caught separately and does *not* block the success state.

---

## 08 — Database

10 migrations are tracked under `supabase/migrations/`. At least four tables the app actually depends on are **not** represented in any tracked migration — they exist only as loose `.sql` files inside `Frontend/`, or were created directly through the Supabase dashboard.

### Tracked tables

| Table | Shape | RLS policies | Migration |
|---|---|---|---|
| `profiles` | id (→auth.users), role, full_name | SELECT own row only. **No INSERT policy** | `20260902_create_tables.sql` |
| `registrations` | registration_id, name, email, phone, city, track, status, payment_status, details JSONB, notes | Admin-only SELECT + UPDATE. **No INSERT policy** | `20260904_create_registrations.sql` |
| `hero_content` | Singleton row (id=1) | Public SELECT, authenticated UPDATE/INSERT | `2026090501_hero_content.sql` |
| `guests` | name, initials, role, description, image_url, sort_order | Public SELECT, authenticated ALL | `20260905130200_guests.sql` |
| `venue_content` | Singleton row (id=1) | Public SELECT, authenticated UPDATE/INSERT | `20260905131300_venue_content.sql` |
| `event_amount` | Singleton row (id=1) | Public SELECT, authenticated UPDATE/INSERT | `20260905132300_event_amount.sql` |
| `event_experience` | agenda, special_items, value_strip (JSONB) | Public SELECT, authenticated UPDATE/INSERT | `20260905143000_event_experience.sql` |
| `qa_session` | faqs JSONB | Public SELECT, authenticated UPDATE/INSERT | `20260905150500_qa_session.sql` |
| `form_config` | categories, form_fields (JSONB) | Public SELECT. UPDATE/INSERT gated on `auth.role()='authenticated'` — not admin-role-checked like the tables above | `20260908120000_form_config.sql` |

### Untracked / schema-drift tables

| Table / column | Where it's defined | Consumed by |
|---|---|---|
| `registration_content` | `Frontend/insert_registration_content.sql` (loose file) | `Registration.jsx` |
| `registration_content.fee_* / upi_id` | `Frontend/alter_registration_content.sql` (loose file) | `Registration.jsx`, `AdminEventRegistration.jsx` |
| `site_content` | `Frontend/insert_content.sql` (loose file) — **no CREATE TABLE found anywhere** | `SiteContext.jsx` |
| `event_intro` | `Frontend/insert_event_intro.sql` (loose file) | `EventIntro.jsx`, `AdminTheEvent.jsx` |
| `registrations.checked_in` | Not found in any file — inferred to exist only from dashboard-level changes | `AdminScanner.jsx` |

> **The migrations folder does not describe the live schema** — `supabase/migrations/` is missing at least four tables and one column the app actively reads and writes. Anyone provisioning a fresh Supabase project from these migrations alone would get a database the frontend cannot fully run against — the public Registration section, the Guests section, the Event Intro section, and the Admin check-in scanner would all break.

### Feature → table mapping

| Frontend feature | Component | Table | Operation |
|---|---|---|---|
| Hero content | `Hero.jsx` / `AdminHero.jsx` | `hero_content` | SELECT / UPSERT |
| Event intro | `EventIntro.jsx` / `AdminTheEvent.jsx` | `event_intro` | SELECT / UPSERT |
| Guest carousel | `Guests.jsx` / `AdminGuests.jsx` | `guests`, `site_content` | SELECT / full CRUD |
| Venue section | `JaipurSection.jsx` / `AdminVenue.jsx` | `venue_content` | SELECT / UPSERT |
| Event-day highlights | `Highlights.jsx` / `AdminEventExperience.jsx` | `event_experience` | SELECT / UPSERT |
| Q&A / FAQ | `QnASection.jsx` / `AdminQASession.jsx` | `qa_session` | SELECT / UPSERT |
| Registration copy + fees | `Registration.jsx` / `AdminEventRegistration.jsx` | `registration_content`, `form_config` | SELECT / UPSERT |
| Registration submit | `RegistrationForm.jsx` | `registrations` | INSERT |
| Admin registrations table | `AdminRegistrations.jsx` | `registrations` | SELECT / UPDATE / bulk INSERT (mock data) |
| QR check-in | `AdminScanner.jsx` | `registrations` | SELECT / UPDATE (checked_in) |

---

## 09 — Authentication & Authorization

Real Supabase Auth is in use for the admin console — this is genuine route protection, not a UI-only stub.

### Verified flow

```
ProtectedRoute mounts → supabase.auth.getSession()
  ↓
No session → redirect to /admin/login
  ↓
Session exists → query profiles for this user's role
  ↓
role ≠ 'admin' → render "Access Denied" (with working sign-out)
  ↓
role = 'admin' → render <AdminDashboard />, subscribe to onAuthStateChange for live logout
```

Sign-in: `AdminLogin.jsx` via `signInWithPassword`, plus a working "forgot password" flow (`resetPasswordForEmail`). Password recovery completes in `UpdatePassword.jsx` via `updateUser({password})`, reached when `App.jsx`'s `AuthListener` detects a `PASSWORD_RECOVERY` auth event. Sign-out is wired in `AdminDashboard.jsx`.

> **No path creates an admin profile** — The `profiles` table has no INSERT RLS policy and no signup trigger anywhere in the tracked migrations. Nothing in this codebase creates the `role = 'admin'` row that `ProtectedRoute` depends on — it must be set by hand in the Supabase dashboard for every admin user.

---

## 10 — Data Flow — Major Features

### Registration submit
```
RegistrationForm.jsx → validateField() ×N → submitRegistration() →
supabase.from('registrations').insert() → send-email Edge Fn → AdminDashboard (realtime)
```

### Content editing (any Admin* editor, e.g. Guests)
```
AdminGuests.jsx form → local state edit → .upsert() / .update() →
guests table → Guests.jsx (public site, next load)
```

### Admin auth
```
AdminLogin.jsx → signInWithPassword → Supabase Auth →
ProtectedRoute role check → AdminDashboard
```

### Registration notifications (bell)
```
Postgres INSERT on registrations → Realtime publication →
AdminDashboard subscription → Notification bell + 20s poll fallback
```

---

## 11 — Social Media & External Links

| Channel | URL / value | Defined in | Source |
|---|---|---|---|
| Facebook | facebook.com/profile.php?id=61593793123130 | `Footer.jsx` | Hardcoded |
| Instagram | instagram.com/bmin.vestment | `Footer.jsx` | Hardcoded |
| X / Twitter | `"#"` | `Footer.jsx` | **Placeholder — no real URL exists in the project** |
| YouTube | youtube.com/@BMIInvestment-h4z | `Footer.jsx` | Hardcoded |
| WhatsApp (footer) | wa.me/{WHATSAPP_NUMBER} | `eventData.js` | Shared constant |
| WhatsApp (floating button) | wa.me/{WHATSAPP_NUMBER} | `eventData.js` | Same constant, confirmed identical |

Both WhatsApp entry points build their link from the same two exported constants — `WHATSAPP_NUMBER` and `WHATSAPP_MESSAGE` — in `eventData.js`. There is no second, divergent number anywhere in the codebase.

---

## 12 — Admin Panel

Twelve panels total, switched client-side inside `AdminDashboard.jsx`. Each is assessed here strictly by what its code does, not by whether it looks complete.

| Panel | Table(s) | Status | Note |
|---|---|---|---|
| `AdminRegistrations.jsx` | `registrations` | Fully working | Fetch, search, filter, status/notes update, CSV export — all confirmed present. |
| `AdminScanner.jsx` | `registrations` | Fully working | QR check-in via camera, writes to the untracked `checked_in` column (§8). |
| `AdminHero.jsx` | `hero_content` | Working, but effect limited | Saves correctly; the public hero video is hardcoded elsewhere (§5) so image edits don't reach visitors. |
| `AdminGuests.jsx` | `guests` | Fully working | Full CRUD with live preview. |
| `AdminVenue.jsx` | `venue_content` | Fully working | — |
| `AdminEventExperience.jsx` | `event_experience` | Fully working | — |
| `AdminQASession.jsx` | `qa_session` | Fully working | — |
| `AdminTheEvent.jsx` | `event_intro` | Fully working | — |
| `AdminEventRegistration.jsx` | `form_config`, `registration_content` | Fully working | Category/fee/field form-builder; email/phone fields locked from deletion. |
| `AdminEventAmount.jsx` | `event_amount` | **Orphaned** | Code is functional, but the panel is not linked from the dashboard's own navigation — unreachable in the actual admin UI. |
| "Payments" / "Review" nav items | — | **No view** | Listed in the sidebar but have no dedicated panel — clicking falls back to the default overview. |

> **Production affordance worth a second look** — `AdminRegistrations.jsx` includes an "Add Mock Data" control that inserts fabricated registration rows directly into the live `registrations` table — this is exposed in the shipped admin UI, not gated behind a dev-only flag.

---

## 13 — API / Service Layer

There is no dedicated service module — every Supabase call is written inline inside the component that needs it. The closest thing to a shared "service function" is `submitRegistration()`, a module-level function in `RegistrationForm.jsx` rather than an imported utility.

| Function | File | Input | Output | Backend call |
|---|---|---|---|---|
| `submitRegistration(payload)` | `RegistrationForm.jsx` | Category + all field values | `{ ok: true }` or throws | `registrations.insert()`, `functions.invoke('send-email')` |
| `validateField(field, value)` | `RegistrationForm.jsx` | Field config + current value | Error string or null | None |
| `fetchDashboardStats()` | `AdminDashboard.jsx` | — | Aggregated counts | `registrations.select()` |
| `fetchConfig()` | `AdminEventRegistration.jsx` | — | categories + form_fields state | `form_config.select()` |
| `handleSave()` (per admin editor) | Each `Admin*.jsx` file | Edited local state | Success/error message | `.upsert() / .update()` on that table |

---

## 14 — Environment & Configuration

Exactly two environment variables are read anywhere in the frontend, both in `src/lib/supabase.js` and both, by Vite convention, exposed to the browser bundle:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No values are reproduced in this report. No service-role key or other secret was found anywhere in `Frontend/src`.

> **Two .env files, inconsistent values** — Both `BM/.env` and `BM/Frontend/.env` exist on disk with differently-shaped anon key values (one looks like a publishable-key format, the other a full JWT). Only `Frontend/.env` is actually read by the Vite build. `.gitignore` excludes `.env` files, but this audit did not check git history for whether either was committed previously — **Not verified**.

No `.env.example` file exists, despite a negation rule for one in `.gitignore` implying it was intended.

---

## 15 — Responsive / UI System

A genuine hand-built design-token system sits at the top of `globals.css`: a full color palette (`--ink-950…700`, `--ivory`, `--brass`, `--emerald`, `--rose`), a font-token layer aliasing every typeface role to one `--font-site` source of truth, and a `--gutter` token for consistent side padding.

- **Breakpoints in practice:** primarily `max-width: 640px` (mobile) and `max-width: 1024px` (tablet), applied per-section throughout `components.css` rather than from a shared mixin system.
- **Carousels:** a shared `Carousel.jsx` shell — multi-item scroll-snap track on desktop, single full-width slide with dot pagination on mobile.
- **Horizontal overflow:** handled per-component; several past fixes in this codebase's history addressed 12-column CSS Grid gap-collapse bugs and fixed-width buttons that didn't shrink at the narrowest phone widths — both patterns are now resolved at the points found, but the underlying grid pattern (large gap on a narrow container) recurs across multiple sections and was not exhaustively re-audited in this pass.
- **Admin theme:** a second, independent color system — `AdminThemeContext.jsx` defines its own JS object of hex values for dark/light, used via inline `style={...}` props rather than the CSS custom properties the public site uses. The two systems don't share tokens.

---

## 16 — Static vs. Dynamic — Full Feature Table

| Feature | Static / Dynamic | Data source | File | Status |
|---|---|---|---|---|
| Hero copy | Dynamic | `hero_content` | `Hero.jsx` | Working |
| Hero background video | Static | `public/videos/` | `App.jsx` | By design, contradicts Admin UI |
| Event intro | Dynamic | `event_intro` | `EventIntro.jsx` | Table untracked |
| "Why it matters" | Static | `eventData.js` | `WhyItMatters.jsx` | Working |
| Experience carousels | Static | `eventData.js` | `EventExperience.jsx` | Working |
| Participation categories | Static | `eventData.js` | `ParticipationCategories.jsx` | Diverges from form_config |
| Guests | Dynamic | `guests`, `site_content` | `Guests.jsx` | 2nd table untracked |
| FAQ | Dynamic | `qa_session` | `QnASection.jsx` | Working |
| Event-day agenda | Dynamic | `event_experience` | `Highlights.jsx` | Working |
| Venue | Dynamic | `venue_content` | `JaipurSection.jsx` | Working |
| Registration fees / categories | Dynamic | `form_config`, `registration_content` | `Registration.jsx` | Working |
| Registration submit | Dynamic | `registrations` | `RegistrationForm.jsx` | Insert works; track mislabeled for 2 of 4 categories |
| Payment | Static (manual) | — | `RegistrationForm.jsx` | UPI QR only, no gateway, no auto-verification |
| Social links | Static | `Footer.jsx` / `eventData.js` | — | X/Twitter has no real URL |
| Admin registrations table | Dynamic | `registrations` | `AdminRegistrations.jsx` | Working |
| Admin QR check-in | Dynamic | `registrations.checked_in` | `AdminScanner.jsx` | Column untracked in migrations |

---

## 17 — Deployment

| | |
|---|---|
| **Host** | Vercel (config file present) |
| **Config** | `Frontend/vercel.json` |
| **Rewrite rule** | `/(.*)  →  /index.html` |
| **Build command** | `vite build` (via package.json "build" script) |
| **Output** | `Frontend/dist/` |
| **Bundling** | `vite-plugin-singlefile` inlines the entire build into one HTML file — no code-splitting, no separate cacheable chunks |

**Not verified** — this audit did not inspect Vercel's dashboard, environment-variable configuration on the hosting side, or GitHub Actions/CI, since none of that is represented in the repository itself.

---

## 18 — Current Working Status

### Fully working
- Public site rendering, all 14 sections, desktop + mobile
- Registration form UI, validation, category switching
- Registration insert to Supabase + email dispatch
- Admin auth, session, role-gated route
- Admin registrations table (search, filter, status, notes, CSV)
- QR check-in scanning
- 7 of 9 Admin content editors, with live preview
- WhatsApp — footer and floating button, same number

### Implemented, not fully verified
- Registration `INSERT` under RLS — the migration shows no INSERT policy on `registrations` (§8, §19); whether this is compensated for elsewhere in the live project was not confirmed
- Outbound email delivery via Resend's sandbox sender domain, to arbitrary recipient addresses
- Deployment build/env on the actual Vercel project

### Static / not yet dynamic
- "Why it Matters," "The Experience," "How It Works," "Funding" sections
- Participation category cards (separate from the live registration category config)
- Social URLs (all four, including the WhatsApp constant)

### Confirmed bugs / gaps
- Entrepreneur and Business Tycoon registrations are stored with `track = "Visitor"`
- Hero background video ignores the Admin-uploaded image
- "Payments" and "Review" admin nav items have no view
- `AdminEventAmount.jsx` is unreachable from the dashboard nav
- X/Twitter footer link is a dead `"#"`
- Registration success screen shows stale copy claiming the form "isn't connected to a live backend yet" — it is
- Four live tables and one column are absent from tracked migrations

---

## 19 — Security Review

> **Missing RLS INSERT policies** — `registrations` and `profiles` both enable RLS but define no `INSERT` policy in their tracked migrations. Under default Postgres RLS behavior, an operation with no matching policy is denied — which would mean the public registration form's anon-key insert should fail as the schema is currently defined in the migrations. Given the schema-drift pattern already confirmed elsewhere (§8), it's plausible an additional policy exists on the live database that isn't captured in any file. **Not verified either way** — this needs a direct check against the live Supabase project, not the migration files alone.

> **form_config write policy is broader than the others** — Every other admin-editable table gates writes on `profiles.role = 'admin'`. `form_config` instead gates on `auth.role() = 'authenticated'` — any signed-in Supabase user, not specifically an admin, could write to it directly against the database, even though the Admin UI itself is still gated by `ProtectedRoute`.

- **Exposed keys:** only the public anon key and project URL are referenced in frontend code — **no service-role key found** in `Frontend/src`.
- **Hardcoded sensitive data:** none found — the WhatsApp number is a real business contact number, published by design, not a credential.
- **Admin protection:** real session + role check (§9), not a client-side-only gate that could be bypassed by hiding UI.
- **Input validation:** present client-side (email/phone/URL/city patterns) but not confirmed server-side — Postgres column types are mostly permissive `TEXT`/`JSONB`, so malformed data could still reach the database if RLS/insert succeeds.
- **XSS surface:** several components use `dangerouslySetInnerHTML` to render admin-authored title HTML (e.g. section headings with inline `<span>` markup) — this is only as safe as the admin's own trustworthiness, since that HTML is not sanitized before render.
- **External links:** social/WhatsApp links use `target="_blank"` with `rel="noopener noreferrer"` where checked in past work on this codebase.
- **Edge Function exposure:** `send-email` has `verify_jwt = false` and a wide-open CORS policy (`Access-Control-Allow-Origin: "*"`) — it is callable by anyone who knows the function URL, not just the site's own frontend.

---

## 20 — Final Architecture Summary

```
                Visitor / Admin (browser)
                          ↓
             React 19 + Vite SPA
     (single HTML bundle via vite-plugin-singlefile)
                          ↓
          Component-inline data calls
   (no shared service layer — each component owns its own fetch)
                          ↓
              Supabase JS client
            (src/lib/supabase.js — anon key)
                          ↓
   ┌───────────────┬────────────────┬─────────────────┬──────────────┐
   │ Supabase Auth  │ Postgres + RLS │ Edge Function    │ Storage      │
   │ profiles.role  │ 13 tables,     │ send-email       │ hero_media   │
   │ gate           │ 4 untracked    │ → Resend         │ bucket       │
   └───────────────┴────────────────┴─────────────────┴──────────────┘
                          ↓
              AdminDashboard.jsx
     (12 panels, sidebar-switched, live previews)
```

---

## 21 — Important File Index

| File | Purpose | Feature area | Layer |
|---|---|---|---|
| `src/main.jsx` | App entry, mounts React root | Bootstrap | Frontend |
| `src/App.jsx` | Routes, providers, landing-page composition | Bootstrap / Routing | Frontend |
| `src/lib/supabase.js` | Supabase client instance | Backend connection | Config |
| `src/data/eventData.js` | Static fallback content, fees, categories, constants | Content | Frontend |
| `src/components/RegistrationForm.jsx` | Registration UI + submit logic | Registration | Frontend |
| `src/components/Registration.jsx` | Registration section wrapper, fee/config fetch | Registration | Frontend |
| `src/components/ProtectedRoute.jsx` | Admin route guard | Auth | Frontend |
| `src/components/AdminDashboard.jsx` | Admin shell, stats, notifications | Admin | Frontend |
| `src/components/AdminRegistrations.jsx` | Registration management table | Admin | Frontend |
| `src/components/AdminEventRegistration.jsx` | Form-builder for categories/fields/fees | Admin / Registration | Frontend |
| `src/context/SiteContext.jsx` | Guests + FAQ shared state | Content | Frontend |
| `src/styles/globals.css` | Design tokens, resets, hero/nav/footer styling | Styling | Frontend |
| `src/styles/components.css` | Per-section component styling | Styling | Frontend |
| `vite.config.ts` | Build plugins, path alias | Build | Config |
| `vercel.json` | SPA rewrite rule for hosting | Deployment | Config |
| `supabase/migrations/*.sql` | 10 tracked schema migrations | Database | Backend |
| `supabase/functions/send-email/` | Email-dispatch Edge Function | Registration | Backend |
| `Frontend/insert_registration_content.sql` | Untracked table creation for registration_content | Database (drift) | Backend |
| `Frontend/insert_event_intro.sql` | Untracked table creation for event_intro | Database (drift) | Backend |
| `Frontend/insert_content.sql` | Seeds site_content — no CREATE TABLE found for it anywhere | Database (drift) | Backend |

---

## 22 — Final Project Status

A functioning, mostly-Supabase-backed event site with a genuinely capable admin console behind it — not a prototype, but not the fully-automated system the PRD describes either.

| | |
|---|---|
| **Frontend** | Working — all 14 public sections render, responsive across the breakpoints inspected, no test coverage exists |
| **Backend** | Working with gaps — Supabase is fully wired for reads; write-path RLS on `registrations` is unverified against the live project (§19) |
| **Database** | Drifted from source control — 4 tables and 1 column exist only outside the tracked migrations (§8) |
| **Admin** | Mostly working — 10 of 12 panels fully functional; 2 have no reachable view (§12, §18) |
| **Deployment** | Configured, not independently verified — Vercel rewrite present; live build/env not inspected (§17) |

### Main remaining tasks

1. Fix the category→track mapping so Entrepreneur and Business Tycoon registrations are labeled correctly, not stored as "Visitor."
2. Bring the 4 untracked tables and 1 untracked column into `supabase/migrations/` so the schema is reproducible from source control.
3. Verify — directly against the live Supabase project, not the migration files — whether public registration inserts are actually succeeding under current RLS, and add an explicit INSERT policy if not.
4. Either connect `AdminEventAmount.jsx` to the dashboard nav or remove it; same for the "Payments"/"Review" nav items.
5. Replace the stale "Preview build… not connected to a live backend" success copy in `RegistrationForm.jsx` with copy that reflects what actually happens on submit.
6. Resolve whether the hero background should genuinely be admin-editable, or remove that affordance from `AdminHero.jsx` to stop it implying an effect it doesn't have.
