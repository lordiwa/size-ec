---
phase: 01-paridad-prototipo
plan: 02
subsystem: ui
tags: [vue3, pinia, css-tokens, wcag, transitions, aria, markets-grid]

# Dependency graph
requires:
  - phase: 01-paridad-prototipo/01-01
    provides: "src/styles/markets.css with 12 html.market-{id} token blocks; App.vue watchEffect that swaps <html> classes on store change"
provides:
  - "src/components/MarketsGrid.vue — 12-tile 4x3 inline markets selector, consumed via <MarketsGrid /> (no props)"
  - "src/views/HomeView.vue — rotator wrapped in <Transition name=\"word-fade\" mode=\"out-in\"> with prefers-reduced-motion fallback; MarketsGrid mounted between rotator and CTA"
affects: [01-03, 01-04, phase-04-mercados]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Vue built-in <Transition> with mode=out-in and :key binding for DOM node replacement — enables opacity crossfade with screen-reader-safe aria-live on stable parent"
    - "MarketsGrid tile pattern: scoped CSS with var(--*) tokens, aria-pressed, focus-visible outline — mirrors StyleGate.vue tile language"
    - "prefers-reduced-motion: set transition-duration: 0ms on the enter/leave-active classes — zero added JS"

key-files:
  created:
    - src/components/MarketsGrid.vue
  modified:
    - src/views/HomeView.vue

key-decisions:
  - "MarketsGrid is a no-props component; all state flows through useStyleStore().setMarket(id) — no local state or additional plumbing"
  - "aria-live='polite' moved from the rotating <span> to the parent <p> because <Transition mode=out-in> replaces the DOM node on each word change, which would silence screen readers if aria-live lived on the replaced element"
  - "min-width: 8ch preserved on .home-rotator-word to prevent layout jump during the 100ms leave phase of the crossfade"
  - "setMarket action replaces any prior active style (market or size) with a single assignment — LOCKED-002 mutual exclusivity is maintained by the existing store, not by this component"

patterns-established:
  - "Tile grid pattern: display:grid repeat(4,1fr) desktop / repeat(2,1fr) <=720px; 1px border var(--line); active border var(--accent); hover color-mix(in srgb, var(--ink) 4%, transparent) + translateY(-1px)"
  - "Word rotator crossfade: <Transition name=word-fade mode=out-in> + :key on span + transition:opacity 100ms ease on enter/leave-active + prefers-reduced-motion override"

requirements-completed: [REQ-style-persistence, REQ-home-rotating-words]

# Metrics
duration: 18min
completed: 2026-05-04
---

# Phase 01 Plan 02: MarketsGrid + Rotator Crossfade Summary

**12-tile inline market selector on Home with click-to-restyle and a 100ms opacity crossfade on the rotating word, both wired into the existing Pinia/watchEffect machinery**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-05-04T16:42:36Z
- **Completed:** 2026-05-04T17:00:00Z
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments

- Created `src/components/MarketsGrid.vue`: 12 tiles in 4x3 grid, eyebrow `¿DE QUÉ INDUSTRIA VIENES?`, ACTIVO label on active tile, 2-column collapse <=720px, WCAG-compliant focus-visible outline
- Mounted MarketsGrid in HomeView below the rotator and above the CTA
- Wrapped the rotating word in `<Transition name="word-fade" mode="out-in">` with `:key` binding — each word swap is a DOM node replacement that triggers the 100ms opacity crossfade
- Moved `aria-live="polite"` from the replaced `<span>` to the stable parent `<p>` — screen readers now correctly announce each new word
- Added `prefers-reduced-motion` block that collapses the transition to instant (0ms)
- `pnpm type-check` and `pnpm build` both pass clean

## Task Commits

1. **Task 1: Create src/components/MarketsGrid.vue** - `9d0798e` (feat)
2. **Task 2: Mount MarketsGrid + rotator crossfade in HomeView** - `c24faf2` (feat)

**Plan metadata:** *(docs commit follows this summary)*

## Files Created/Modified

- `src/components/MarketsGrid.vue` — 12-tile 4x3 grid; calls `useStyleStore().setMarket(id)` on click; shows mono ACTIVO label on active tile via `v-if="isActive(m.id)"`; scoped CSS with `var(--*)` tokens; no props, no side effects on mount
- `src/views/HomeView.vue` — added `import MarketsGrid`; `<MarketsGrid />` between rotator and CTA; `<Transition name="word-fade" mode="out-in">` wrapping the rotating span; `aria-live="polite"` on parent `<p>`; word-fade CSS appended to scoped style block

## Component Contract

`<MarketsGrid />` — consumed with no props. Reads and writes style via `useStyleStore()` from `@/stores/style`. Calling `setMarket(id)` writes `{ type: 'market', value: id, updatedAt: Date.now() }` to localStorage via the store's deep `watch`. App.vue's `watchEffect` then adds `level-m has-market market-{id}` classes to `<html>`, which activates the corresponding token block from `src/styles/markets.css`.

Confirmed: clicking any tile writes `{ "type": "market", "value": "<id>", "updatedAt": <epoch> }` to `localStorage['size-style']` via the existing store — no new plumbing added by this plan.

Note on setMarket vs LOCKED-002: `setMarket(id)` overwrites `active.value` with a single object — the prior style (whether a market or a size) is replaced by the one assignment. Mutual exclusivity is enforced at the store level, not by this component. The 60-combination cross-product is architecturally impossible.

## Decisions Made

- `aria-live="polite"` moved to parent `<p>` rather than staying on the `<span>` — the `<Transition mode="out-in">` approach replaces the DOM node per word change (via `:key`), which would silence screen readers if the live region were on the replaced element
- No additional JS plumbing: the existing `watchEffect` in App.vue and Pinia store handle all class swapping and persistence
- Scoped CSS only — no global styles added; word-fade classes are locally scoped to HomeView

## Deviations from Plan

None — plan executed exactly as written. Both automated verify commands exited 0, type-check and build smoke gates passed.

## Known Stubs

None — MarketsGrid renders real data from a hardcoded `markets: Market[]` array (all 12 IDs and Spanish labels present). Rotating words in HomeView are placeholder content (per `.planning/STATE.md` known blocker: "Final rotating-words list — content — Phase 1 ships with placeholders, finalised in Phase 7"), but this was pre-existing and out of scope for this plan.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes. `setMarket()` writes to localStorage under the pre-approved `size-style` key per LOCKED-002.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- MarketsGrid.vue is live on Home; clicking any tile restyles the page in place via the existing Pinia/watchEffect machinery
- Rotator crossfade is live; prefers-reduced-motion users get instant swaps
- Plan 01-03 can proceed: StickyFooter M-tick reset semantics and StyleGate routing wiring
- Phase 4 (Mercados sobre M) can layer richer per-market treatments on top of the token blocks established in 01-01; MarketsGrid will automatically reflect any token changes without modification

---
*Phase: 01-paridad-prototipo*
*Completed: 2026-05-04*
