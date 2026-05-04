---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: "Roadmap restructured prototype-first. New Phase 1 (Paridad prototipo) inherits the 4 plans previously authored under old Phase 2 (Sistema base) — they are unchanged in scope. New Phase 9 (Cierre + Despliegue) holds the 4 plans previously authored under old Phase 1 (Setup); Plan 09-01 (Firebase Hosting bootstrap) is already executed (4 commits in main: 223d496, bd6a792, 6949f44, 5c50b1f) and remains valid foundation for the eventual real deploy."
last_updated: "2026-05-04T17:01:00.000Z"
last_activity: 2026-05-04 -- Plan 01-04 complete (Vitest smoke layer: store + MarketsGrid + gate-flow + routes)
progress:
  total_phases: 9
  completed_phases: 0
  total_plans: 8
  completed_plans: 5
  percent: 63
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-03)

**Core value:** A visitor can pick one of 17 mutually exclusive styles (12 markets + 5 creative sizes) and see the entire site reshape itself — legibly, in place, without reload — to that single style.
**Current focus:** Phase 01 — paridad-prototipo

## Current Position

Phase: 01 (paridad-prototipo) — COMPLETE
Plan: 4 of 4 (all plans done)
Status: Phase 01 complete — Plans 01-01, 01-02, 01-03, and 01-04 all done
Last activity: 2026-05-04 -- Plan 01-04 complete (Vitest smoke layer: store + MarketsGrid + gate-flow + routes)

Progress: [██████░░░░] 63%

## Performance Metrics

**Velocity:**

- Total plans completed: 4
- Average duration: 14 min
- Total execution time: 53 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 09-cierre-deploy | 1/4 done (was 01-setup before restructure) | 15 min | 15 min |
| 01-paridad-prototipo | 4/4 done | 56 min | 14 min |

**Recent Trend:**

- Last 5 plans: 09-01 (firebase hosting bootstrap, 15 min), 01-01 (markets token CSS, 15 min), 01-02 (MarketsGrid + rotator crossfade, 18 min), 01-03 (gate routing + M-tick reset, 18 min), 01-04 (Vitest smoke layer, 5 min)
- Trend: steady

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md "Key Decisions" table. Two are LOCKED:

- **LOCKED-001** — WCAG AA legibility in all 17 styles (REGLA INVIOLABLE, §3 of brief).
- **LOCKED-002** — Mutually exclusive styles via single localStorage flag `size-style: { type, value, updatedAt }`; 12 + 5 = 17, never 60 (REGLA INVIOLABLE, §3.bis).

Recent accepted decisions:

- DEC-001 frontend stack (Vue 3 + Vite + Pinia + Vue Router + Tailwind + TS).
- DEC-002 hosting on Firebase Spark + Cloudflare, prod-only.
- DEC-008 Kanban eternal sprint, Jira project SIZE via GSD MCP.
- **DEC-014 (2026-05-04)** — Roadmap is prototype-first: design system / 17 styles / 5 routes / gate must work locally in the browser BEFORE any Firebase deploy. Setup + deploy + Cierre + SEO + analytics + Jira epics are consolidated in the final Phase 9 (Cierre + Despliegue), not the first.

Decisions from completed plan 09-01 (firebase hosting bootstrap):

- **DEC-011** — firebase-tools installed as devDependency (not globally); invoked via `pnpm exec firebase`.
- **DEC-012** — Firebase project id `size-ec` declared as forward declaration in .firebaserc; reconciliation deferred to first real deploy in Phase 9.
- **DEC-013** — tsconfig.node.json no longer extends @tsconfig/node22 to avoid es2024 lib incompatibility with typescript@5.6.3; inlined equivalent compilerOptions targeting es2022.

Decisions from completed plan 01-01 (markets token CSS):

- **DEC-015** — Market token blocks define --bg, --ink, --muted, --line, --line-strong, --accent, --accent-2, --radius, --font-display; body/mono fonts never overridden (Geist stays, per D-04).
- **DEC-016** — WCAG AA enforced at token-creation time via automated luminance check; all 12 blocks ≥ 4.5:1 (lowest: turismo 13.22:1, highest: moda 18.86:1).
- **DEC-017** — Source Serif 4 used for market-banca (not deprecated Source Serif Pro); matching string in index.html is Source+Serif+4.

Decisions from completed plan 01-02 (MarketsGrid + rotator crossfade):

- **DEC-018** — MarketsGrid is a no-props component; all state via useStyleStore().setMarket(id); no additional JS plumbing beyond what existed in Pinia store and App.vue watchEffect.
- **DEC-019** — aria-live="polite" lives on the stable parent <p>, not the <span> replaced by <Transition mode=out-in> — required for screen readers to announce each new rotating word.
- **DEC-020** — Word rotator crossfade: transition: opacity 100ms ease on word-fade enter/leave-active; prefers-reduced-motion collapses to transition-duration: 0ms with zero added JS.

Decisions from completed plan 01-03 (gate routing + M-tick reset):

- **DEC-021** — Post-gate routing owned entirely by App.vue via watch on style.active; StyleGate.vue remains a pure UI component calling only style.setSize(size.id).
- **DEC-022** — intendedPath capture uses { immediate: true } so a bookmark deep-link to /servicios on a fresh visit captures the path before any user interaction.
- **DEC-023** — M-tick no-op guard (s === 'M' && !style.active) is the sole protection against inadvertently writing a localStorage flag on a fresh visit, which would cause the gate to never appear on protected routes.
- **DEC-024** — src/stores/style.ts required NO modification — setSize/setMarket overwrite active.value in one assignment (LOCKED-002 satisfied by existing store).

Decisions from completed plan 01-04 (Vitest smoke layer):

- **DEC-025** — `await nextTick()` required after store mutations in tests; the style store watcher uses default Vue flush (`'pre'`), which is deferred. The production store is correct — only the specs needed the await.
- **DEC-026** — `StickyFooter` stubbed in gate-flow integration tests (not under test); `StyleGate` left un-stubbed because the test asserts on `.gate` DOM presence.
- **DEC-027** — `@vue/compiler-sfc` NOT added as direct devDependency — Vue 3.4+ ships it inside the `vue` package; adding it explicitly causes duplicate-instance warnings.
- **DEC-028** — Playwright e2e deferred to Phase 9; Vitest layer is the contract surface for all Phase 1 automated acceptance criteria.

### Pending Todos

None.

### Blockers/Concerns

Carried forward from §11 of the brief (acknowledged TBDs):

- **Definitive domain** — infra — affects Phase 9.
- **Corporate email** — product — affects Phase 8 / Phase 9.
- **Social handles** (Instagram / WhatsApp / Facebook) — product — affects Phase 8.
- **Chatbot provider** — product — affects Phase 8.
- **20 team photos** (4 × 5) — content — affects Phase 7.
- **20 team comments** (4 × 5) — content — affects Phase 7.
- **3 client case write-ups** (MMA El Valle, Cranial Trading, Sin-Cero) — content — affects Phase 7.
- **Final rotating-words list** — content — Phase 1 ships with placeholders, finalised in Phase 7.
- **Analytics event taxonomy** — product — affects Phase 9.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-05-04
Stopped at: Plan 01-04 complete. Phase 01 fully done. Vitest smoke layer (4 spec files, 18 tests) passing. pnpm type-check + build + test all green. Ready for Phase 02 planning.
Resume file: None — Phase 01 complete. Next: /gsd-plan-phase 2
