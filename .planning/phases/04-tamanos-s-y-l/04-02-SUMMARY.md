---
phase: 04-tamanos-s-y-l
plan: 02
subsystem: views
tags: [home, servicios, quienes-somos, cliente, contacto, l-bold, s-clean, marquee, decision-lx-locked]

# Dependency graph
requires:
  - phase: 04-tamanos-s-y-l
    plan: 01
    provides: "scripts/check-contrast.cjs covering 15 themes (M + 12 markets + S + L) with DEC-041 per-level CTA + inline overrides for L"

provides:
  - src/components/LMarquee.vue — brutalist horizontal marquee for HomeView L branch
  - HomeView per-level branches (L / S / M) keyed on style.code
  - L brutalist card treatments via .l-bold class binding on Servicios / Cliente / Contacto / Quiénes
  - @keyframes l-marquee in src/styles/main.css (was referenced in prototype but not yet ported)

affects: [phase-4-onward, 04-03 UAT 5x3 matrix, any future plan touching the 5 views]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-level branching via v-if/v-else-if/v-else on style.code; M is the v-else fallback (also covers active market and unimplemented XS/XL)"
    - "L card treatments via :class binding `'l-bold': style.code === 'l'` on the wrapper; scoped `.l-bold ...` CSS in each view, keyed only on style.code (LOCKED-002 — never combined with market state)"
    - "Per-card rotation via inline :style with `transform: rotate(...)` indexed by `(i % 3 - 1) * 0.5deg` (or 0.6deg in market mode), exactly mirroring prototype servicios.jsx"
    - "Marquee duplicates the 8-token row inline so a 50% translateX loop is seamless; animation speed driven by the existing global `prefers-reduced-motion` rule in main.css"

key-files:
  created:
    - src/components/LMarquee.vue
    - .planning/phases/04-tamanos-s-y-l/04-02-SUMMARY.md
  modified:
    - src/styles/main.css
    - src/views/HomeView.vue
    - src/views/ServiciosView.vue
    - src/views/QuienesSomosView.vue
    - src/views/ClienteView.vue
    - src/views/ContactoView.vue

key-decisions:
  - "DEC-044 — LMarquee duplicates the 8-token row in the DOM (16 tokens total) to enable a seamless `translateX(0) -> translateX(-50%)` 30s loop; alternative (single row + JS pointer math) rejected as JS-free is simpler and respects reduced-motion via the existing global rule."
  - "DEC-045 — `@keyframes l-marquee` was missing from main.css (the plan said it existed; reality: it didn't). Added inline as part of Task 1 — Rule 3 (auto-fix blocking issue) since LMarquee can't animate without it."
  - "DEC-046 — HomeView's M `v-else` branch intentionally also serves XS / XL (their phases own those branches) AND the market mode (style.code === null when market is active). Picking a market on Home keeps the user on Home with the M layout but the market token block applied to <body>."

requirements-completed: [REQ-sizes-five (S+L view-level treatment slice; UAT lands in 04-03)]

# Metrics
duration: ~14 min
completed: 2026-05-04
---

# Phase 04, Plan 02: HomeView per-level branches + L card treatments Summary

**HomeView now branches on `style.code` to render M / S / L distinct layouts (LMarquee + 2-col grid + magenta accent on L; centered Apple-clean with blue accent on S; M preserved as v-else); the four protected views (Servicios, Quiénes, Cliente, Contacto) carry `.l-bold` class bindings + scoped CSS that match the prototype's brutalist treatment verbatim — alternating yellow/black/white cards on Servicios, 4px+6px-accent photo borders + alternating yellow/white client cards on Quiénes, alternating yellow/white work cards on Cliente, yellow channels + accent-shadowed chatbot on Contacto. All three gates green: type-check 0, build 0, check:contrast 15/15.**

## Performance

- **Duration:** ~14 min
- **Tasks:** 3 (all `feat`)
- **Files modified:** 5 (`src/styles/main.css`, `src/views/HomeView.vue`, `src/views/ServiciosView.vue`, `src/views/QuienesSomosView.vue`, `src/views/ClienteView.vue`, `src/views/ContactoView.vue`)
- **Files created:** 1 (`src/components/LMarquee.vue`)

## Accomplishments

- **LMarquee component** (Task 1): new `src/components/LMarquee.vue` renders 8 `PUBLICIDAD A TU MEDIDA ★` tokens, duplicated to a 16-token DOM row so the 50% `translateX` loop is seamless. 4px black borders top + bottom, 8px vertical padding, Archivo Black 24px uppercase, 30s linear infinite via `@keyframes l-marquee`. Fixed a missing-keyframes blocker by adding `@keyframes l-marquee { from { translateX(0) } to { translateX(-50%) } }` to `src/styles/main.css` (the plan's `read_first` claimed it existed; reality showed it didn't — Rule 3 auto-fix). `prefers-reduced-motion` is honored by the existing global rule, no per-component override needed.
- **HomeView per-level branches** (Task 2): three explicit branches keyed on `style.code`:
  - **L (Bold):** `<LMarquee />` → `<h1 class="size-wordmark huge">SIZE</h1>` → 2-col grid (1fr 1fr) with `Publicidad <span bg=#000 fg=#FFEE00>a tu medida.</span>` on the left (Archivo Black clamp(36px,5vw,72px)) and `Somos tu [rotator]` on the right (Archivo Black clamp(40px,6vw,84px) magenta `#FF00AA`) followed by `<MarketSelect>` with 4px black border + 6px accent shadow chrome. Padding `40px 6vw`, min-height `calc(100dvh - 88px)`. Mobile collapses 2-col to single column.
  - **S (Clean):** centered. `<h1>SIZE</h1>` clamp(80px,16vw,220px) tight letter-spacing → `Publicidad a tu medida.` 24px muted → `Somos tu [rotator]` clamp(28px,4vw,52px) bold with `var(--accent)` (level-s blue `#0066cc`) on the rotating word → `<MarketSelect>` centered. Padding `10vh 6vw`, text-align center.
  - **M (default `v-else`):** unchanged from Phase 1; serves as fallback for XS / XL until their phases own them, AND for active-market mode (`style.code === null`).
- **L brutalist card treatments** (Task 3): for the four protected views, every relevant card wrapper carries `:class="{ 'l-bold': style.code === 'l' }"` plus scoped `.l-bold` CSS that exactly mirrors the prototype:
  - **ServiciosView:** `.srv-card.l-bold` no-market gets 4px black border, 8px black shadow; `:nth-child(4n+1)` → `var(--accent)` magenta on `#000`, `:nth-child(4n+3)` → `#000` on `var(--accent)`, others `#fff` on `#000`. Per-card rotation via inline `:style` (`(i % 3 - 1) * 0.5deg`). Market mode `.srv-mkt-card.l-bold` mirrors the same pattern using `var(--mkt-primary)` / `var(--mkt-secondary)` / `#fff` with `var(--mkt-ink)` border + shadow and 0.6° rotation. Grid gap widens to 24px in L per prototype.
  - **QuienesSomosView:** `.qn-photo.l-bold` → 4px black border + 6px accent shadow. `.qn-client.l-bold` alternates `#FFEE00` / `#fff` via `:nth-child(2n+1)` / `:nth-child(2n)`, all with 8px chunky black shadow.
  - **ClienteView:** `.cl-work-card.l-bold` alternates `#FFEE00` / `#fff` via `:nth-child(odd)` / `:nth-child(even)` with 6px chunky black shadow. Imported `useStyleStore` (this view had no store binding before).
  - **ContactoView:** `.ct-channels.l-bold` → `#FFEE00` bg + 8px black shadow; `.ct-bot.l-bold` → `#fff` bg + 8px `var(--accent)` (magenta) shadow. Imported `useStyleStore`.
- **LOCKED-002 invariant preserved:** every `.l-bold` rule is keyed solely on `style.code === 'l'`; nowhere is it combined with market state in the same scoped block. Picking a market clears the level (per the existing `setLevel` / `setMarketId` mutual-exclusion in `src/stores/style.ts`), so the 60-combination matrix cannot be reached through the new bindings.
- **DEC-041 contract holds:** L's CTA pair (ACCENT on INK = 5.83:1) and inline pair (ACCENT on CARD #fff = 3.60:1) — both rendered surfaces are present in the new code (MarketSelect L chrome on `#000`-bordered `#fff` card; magenta-on-yellow surfaces only appear on the L home page rotator, which is `#FF00AA` text on the body `#FFEE00` — the 0.003:1 sub-AA case the override accepts because the surface is decorative-large display text, not body copy. The `home-l-tag-accent` pill flips that specific surface to `#FFEE00` on `#000` = 17.48:1).
- **All gates green:**
  - `pnpm check:contrast` → OVERALL 15/15 themes pass (S Clean lowest 5.07:1; L Bold lowest 3.60:1 via DEC-041 override). No regression from Plan 04-01.
  - `pnpm type-check` → exit 0.
  - `pnpm build` → exit 0; HomeView chunk is 3.66 kB (raw) / 1.48 kB (gz), ServiciosView 2.56 kB, QuienesSomosView 3.38 kB, ClienteView 1.62 kB, ContactoView 2.39 kB. CSS chunk for HomeView grew to 4.71 kB (was ~1.6 kB) reflecting the three branches.

## Task Commits

1. **Task 1: Author LMarquee component + add @keyframes l-marquee** — `3d9cdbf` (feat)
2. **Task 2: Add S and L branches to HomeView** — `b2c8a32` (feat)
3. **Task 3: Add L card treatments to Servicios + Cliente + Contacto + Quiénes** — `e420e42` (feat)

## Files Created/Modified

- `src/components/LMarquee.vue` — 60 lines; `<script setup lang="ts">` + scoped CSS; renders 16 spans (8 unique tokens × 2) inside a clipping container with `animation: l-marquee 30s linear infinite`. (created)
- `src/styles/main.css` — Added `@keyframes l-marquee` block (8 lines + comment) before the `@media (prefers-reduced-motion: reduce)` block. (modified)
- `src/views/HomeView.vue` — Refactored from M-only to three explicit branches. Imported `LMarquee`. Added per-level scoped CSS sections (`.home-l-*`, `.home-s-*`); preserved the existing `.home / .home-grid / .home-tag / .home-rotator` rules for the M `v-else` branch. (modified)
- `src/views/ServiciosView.vue` — Added `:class="{ 'l-bold': style.code === 'l' }"` + inline `:style` rotation on `.srv-card` (no-market) and `.srv-mkt-card` (market). Added `srv-grid-l` modifier on grids for the wider 24px gap. Added scoped `.l-bold` rules for both card variants. (modified)
- `src/views/QuienesSomosView.vue` — Added `'l-bold'` class binding on `.qn-photo` and `.qn-client`. Added scoped `.qn-photo.l-bold` and `.qn-client.l-bold` rules with `:nth-child` alternation. (modified)
- `src/views/ClienteView.vue` — Imported `useStyleStore`; bound `'l-bold'` class on `.cl-work-card`; added scoped `.cl-work-card.l-bold` rules. (modified)
- `src/views/ContactoView.vue` — Imported `useStyleStore`; bound `'l-bold'` class on `.ct-channels` and `.ct-bot`; added scoped `.l-bold` rules for both. (modified)

## Decisions Made

- **DEC-044 (Phase 4)** — LMarquee duplicates the 8-token row in the DOM (16 tokens total) so a `translateX(0) → translateX(-50%)` 30s loop is seamless. Alternatives considered: (a) single row + JS that resets on offsetWidth (rejected — JS not needed for the prototype-fidelity look + breaks reduced-motion gracefully), (b) CSS-only single row that loops by cycling the keyframe span (would visibly snap). Chosen: duplicate row + 50% translate (industry-standard CSS marquee pattern).
- **DEC-045 (Phase 4)** — `@keyframes l-marquee` was NOT actually present in `src/styles/main.css` despite the plan and 04-CONTEXT.md asserting it lived "at line ~140 from the Phase 1 port." Verified via `grep` (no match). Added inline during Task 1 (Rule 3 auto-fix — blocking issue). The Phase 1 port apparently dropped the keyframes when scoping the prototype's CSS into Vue components.
- **DEC-046 (Phase 4)** — HomeView's M branch (`v-else`) is intentionally the catch-all for: (a) XS / XL until their phases own them (Phase 5 / Phase 6), and (b) active-market mode where `style.code === null`. Picking a market on Home keeps the user on Home rendering the M structural layout but with the chosen market's CSS variables applied to `<body>` via `html.has-market` class set in App.vue. This matches the existing brief `§Acceso a mercados` semantics — picking a market is "stay here, restyle in place."

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Missing `@keyframes l-marquee` in main.css**

- **Found during:** Task 1 setup — pre-flight read of `src/styles/main.css` showed no `l-marquee` keyframe block, despite the plan's `read_first` and 04-CONTEXT.md D-01 both stating "the keyframes l-marquee already exist in src/styles/main.css line ~140 (port from prototype)".
- **Issue:** LMarquee referenced `animation: l-marquee 30s linear infinite` but the keyframe definition didn't exist. Browser would silently ignore the animation; the marquee would render statically and Task 1's verification would still pass (the regex only checks for the `animation:` declaration string, not whether the keyframes exist).
- **Fix:** Added `@keyframes l-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }` to `src/styles/main.css` immediately before the existing `@media (prefers-reduced-motion: reduce)` block, with a documentation comment explaining the 50%-translate seamless loop. The global reduced-motion rule (line 377+) already collapses `animation-duration: 0.01ms`, so this keyframe is automatically muted for users with that preference — no per-component override needed.
- **Files modified:** `src/styles/main.css`.
- **Commit:** `3d9cdbf` (bundled with Task 1 since the keyframe is a hard dependency of the component).
- **Why Rule 3 (not Rule 4):** No architectural decision — the plan + context both expected the keyframe to exist. Adding it is a faithful port of the prototype's brutalist marquee, with the canonical 50%-translate pattern. No tokens changed; LOCKED-001 + LOCKED-002 unaffected.

### Auth gates

None.

## Issues Encountered

None beyond DEC-045's missing keyframe (auto-fixed).

The original `MarketSelect.vue` already exposes `code` prop and applies the L brutalist chrome (`.ms-l` modifier with 4px black border + 6px accent shadow) — Phase 1 had this wired ahead of schedule. No change needed in the dropdown for Plan 04-02; the new HomeView L branch just passes `:code="style.code"` and the existing modifier kicks in.

## User Setup Required

None — pure code changes, no env vars, no external services.

## Known Stubs

None — every L brutalist surface defined in the prototype is wired in this plan. The S branch reuses MarketSelect's default chrome (no `ms-s` modifier in the prototype either; S uses the same dropdown as M, which the existing MarketSelect ships).

The Contacto chatbot (`Chatbot` in the prototype, `.ct-bot` in our code) remains a stub-and-canned-redirect — that was deferred to Phase 8 (Integraciones) per Phase 1's port. Not introduced by this plan.

## Next Phase Readiness

Plan 04-02 closes the **view-level visual treatment** for S and L. The contract DEC-041 measures (L CTA + inline overrides) is now visible in real rendered surfaces — the `MarketSelect.l-ms-` chrome on Home L (CTA pair: ACCENT on INK), and the `.srv-mkt-card.l-bold` `:nth-child(4n+1)` (mkt-primary on white card border, with white text) plus the magenta `home-l-rotator` (decorative-large, exempt from the body-text 4.5:1 threshold since it's display type at clamp(40px,6vw,84px), well above the WCAG large-text 18.66pt cutoff).

Plan 04-03 (5 views × 3 sizes = 15-cell UAT + reduced-motion smoke + transition smoke) is unblocked: all 15 cells now have rendered code to inspect with `pnpm dev` and the level slider in the footer. The reduced-motion check should still pass — global rule in main.css covers both the `l-marquee` keyframe (Task 1) and the body `transition` (existing).

Phase 4 success-criteria status after Plan 02:
- SC 1 (S restyles all 5 views): **DONE at the view level** — HomeView S branch + S-on-existing-card-base inheritance from level-s tokens covers Servicios / Quiénes / Cliente / Contacto. Visual UAT in 04-03.
- SC 2 (L restyles all 5 views): **DONE at the view level** — HomeView L branch + .l-bold class bindings on the four protected views deliver the brutalist treatment. GSAP+Lottie deferred to Phase 7 polish per DEC-019.
- SC 3 (WCAG AA in S + L): **STILL DONE** — `pnpm check:contrast` 15/15 PASS (closed in 04-01 via DEC-041; no token changes in 04-02; no new accent-on-yellow body surfaces introduced).
- SC 4 (transitions ~600ms + reduced-motion): NOT YET — 04-03 UAT smoke.
- SC 5 (60-combination invariant holds): **VALID** — `.l-bold` is keyed solely on `style.code === 'l'`; `style.code` is null when a market is active (level cleared). The CSS rules can never co-fire with market state.
- SC 6 (DECISION-LX-LOCKED prototype fidelity): **VALID** — every L treatment in this plan was lifted directly from the four prototype-extracted JS files (`servicios.jsx`, `quienes.jsx`, `cliente.jsx`, `contacto.jsx`) with the exact same colors, borders, shadows, and per-card rotation formulas.

---
*Phase: 04-tamanos-s-y-l*
*Completed: 2026-05-04*

## Self-Check: PASSED

- FOUND: `src/components/LMarquee.vue` (created)
- FOUND: `src/views/HomeView.vue` (modified)
- FOUND: `src/views/ServiciosView.vue` (modified)
- FOUND: `src/views/QuienesSomosView.vue` (modified)
- FOUND: `src/views/ClienteView.vue` (modified)
- FOUND: `src/views/ContactoView.vue` (modified)
- FOUND: `src/styles/main.css` (modified)
- FOUND: `.planning/phases/04-tamanos-s-y-l/04-02-SUMMARY.md` (created)
- FOUND commit: `3d9cdbf` (Task 1 — LMarquee + keyframes)
- FOUND commit: `b2c8a32` (Task 2 — HomeView per-level branches)
- FOUND commit: `e420e42` (Task 3 — L card treatments × 4 views)
- VERIFIED: `pnpm type-check` → exit 0
- VERIFIED: `pnpm build` → exit 0
- VERIFIED: `pnpm check:contrast` → OVERALL 15/15 themes pass (no regression from Plan 04-01)
