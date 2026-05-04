---
phase: 01-paridad-prototipo
plan: "03"
subsystem: ui
tags: [vue3, pinia, vue-router, sticky-footer, style-gate, routing, accessibility]

# Dependency graph
requires:
  - phase: 01-paridad-prototipo
    plan: "01"
    provides: 12 market token CSS blocks in markets.css; html class watchEffect in App.vue
  - phase: 01-paridad-prototipo
    plan: "02"
    provides: MarketsGrid.vue, rotating word crossfade, StickyFooter pickSize wired to store
provides:
  - Post-gate routing: App.vue captures intendedPath on gate-up, router.replace on gate-resolve
  - M-tick reset semantics: no-op on fresh-M, accent ring when non-M is active
  - StyleGate.vue confirmed inert (no router calls — App.vue owns routing)
affects: [01-04, testing, qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Intended-route capture via watch(gateRequired, ..., { immediate: true }) in App.vue"
    - "Post-gate routing via watch(() => style.active) calling router.replace(intendedPath)"
    - "No-op guard: pickSize('M') returns early when style.active is null (fresh visit)"
    - "Reset-mode visual: computed resetMode drives reset-active class on M tick"

key-files:
  created: []
  modified:
    - src/App.vue
    - src/components/StickyFooter.vue

key-decisions:
  - "DEC-021: Post-gate routing owned entirely by App.vue via watch on style.active; StyleGate.vue remains a pure UI component calling only style.setSize(size.id)"
  - "DEC-022: intendedPath capture uses { immediate: true } so a bookmark deep-link to /servicios on a fresh visit captures the path before any user interaction"
  - "DEC-023: M-tick no-op guard (s === 'M' && !style.active) is the sole protection against inadvertently writing a localStorage flag on a fresh visit, which would cause the gate to never appear on protected routes"
  - "DEC-024: src/stores/style.ts required NO modification — setSize/setMarket overwrite active.value in one assignment (LOCKED-002 satisfied by existing store)"

patterns-established:
  - "App.vue is the single orchestrator of gate trigger and post-gate routing; child components (StyleGate, StickyFooter) call only store actions"
  - "Reset semantics are co-located in StickyFooter pickSize + resetMode computed; no store-level reset action needed"

requirements-completed:
  - REQ-style-gate
  - REQ-style-persistence
  - REQ-routes-five-views

# Metrics
duration: 18min
completed: 2026-05-04
---

# Phase 01 Plan 03: Gate Routing + M-Tick Reset Summary

**Intended-route preservation via App.vue watch pair, M-tick reset ring with fresh-visit no-op guard, and StyleGate.vue confirmed inert — closes three behavioural gaps without modifying the Pinia store**

## Performance

- **Duration:** 18 min
- **Started:** 2026-05-04T17:20:00Z
- **Completed:** 2026-05-04T17:38:00Z
- **Tasks:** 3 (2 code changes + 1 read-verify)
- **Files modified:** 2

## Accomplishments

- App.vue now captures `route.fullPath` the moment `gateRequired` turns true (with `{ immediate: true }` for bookmark deep-links) and calls `router.replace(intendedPath.value)` once `style.active` becomes non-null after a gate pick — users land on the URL they originally requested, not the gate shell.
- StickyFooter M tick correctly implements D-02 reset semantics: `pickSize('M')` is a no-op when `style.active` is null (fresh visit with no localStorage flag), preventing the gate from being silently bypassed; `resetMode` computed adds the `reset-active` accent ring (`box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent)`) whenever a non-M style is active.
- StyleGate.vue verified inert: relies on App.vue + Pinia for routing and persistence. No `router.push` / `router.replace` calls present.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add intended-route preservation to App.vue** - `92a4bd1` (feat)
2. **Task 2: Add M-tick reset visual + no-op-on-fresh-visit guard to StickyFooter** - `a50de3f` (feat)
3. **Task 3: Confirm StyleGate.vue still routes intended view post-pick** - no commit (read-only verification; file confirmed correct as-is)

## Files Created/Modified

- `src/App.vue` — Added `ref`, `watch`, `useRouter`; `intendedPath` ref; `watch(gateRequired, …, { immediate: true })` and `watch(() => style.active, …)` pair for post-gate routing; existing `watchEffect` preserved verbatim.
- `src/components/StickyFooter.vue` — Added `computed` import; `resetMode` computed; no-op guard in `pickSize`; `reset-active` class binding on M tick; dynamic `aria-label`; scoped `<style>` with `box-shadow` ring.

## Intended-Route Flow

When a first-time visitor lands on `/servicios` (no `size-style` flag in localStorage):

1. `gateRequired` computes to `true` on the first render.
2. `watch(gateRequired, …, { immediate: true })` fires immediately, capturing `intendedPath = '/servicios'`.
3. `<StyleGate />` renders. User picks a size tile.
4. `style.setSize(size.id)` writes the flag; `style.active` becomes non-null.
5. `watch(() => style.active, …)` fires; `route.fullPath` is still `/servicios` (URL never changed while gate was visible) so `route.fullPath === intendedPath.value` — no `router.replace` call needed in the simple case.
6. `gateRequired` flips to `false`; `<RouterView />` renders Servicios.

The `router.replace` is a defensive fallback for the drift case: if a programmatic navigation occurs while the gate is open and changes the URL before the user picks a style, the watcher restores the originally intended URL.

## WatchEffect Preservation

The existing `watchEffect` in `src/App.vue` (the `level-{x}` / `has-market` / `market-{id}` class swap on `<html>`) was preserved **verbatim**. Task 1 additions (4 declarations: `router`, `intendedPath`, two `watch` calls) were inserted **above** it, inside the same `<script setup>` block. No line of the `watchEffect` body was modified, retyped, or refactored.

## M-Tick Reset Semantics

Per CONTEXT.md D-02, the M tick in the footer mini-slider is the canonical reset:

| Scenario | pickSize('M') behaviour | localStorage after |
|----------|------------------------|-------------------|
| Market active (e.g. banca) | Calls `style.setSize('M')` → overwrites market flag | `{type:'size', value:'M', ...}` |
| Non-M size active (e.g. L) | Calls `style.setSize('M')` → overwrites size flag | `{type:'size', value:'M', ...}` |
| M already active (size flag) | Calls `style.setSize('M')` → overwrites with same value | `{type:'size', value:'M', ...}` |
| Fresh visit (no flag) | **No-op — returns early** | *(empty)* |

The no-op guard (`if (s === 'M' && !style.active) return`) ensures that a first-time visitor clicking the M tick does not write a localStorage flag, which would permanently suppress the gate on protected routes.

`resetMode` computed returns true when `style.active` is a market (any) or a non-M size. The M tick receives the `reset-active` class in those states, displaying the accent ring.

## Store Confirmation

`src/stores/style.ts` did **NOT** need modification. Its existing single-flag persistence (`active.value = X` in one assignment, deep-watched and synced to localStorage) already covers all reset semantics. Setting `style.setSize('M')` from a market state correctly overwrites the market flag with a size flag — LOCKED-002 holds.

## Deviations from Plan

None — plan executed exactly as written. Task 3 was a read-only verification as expected; no code change was required.

## Issues Encountered

The plan's automated verify script for Task 1 used a regex (`/market-\$\{active\.value\}/`) that failed under PowerShell quoting but the string `market-${active.value}` is present in the file. A direct string-inclusion check confirmed correctness; all Task 1 acceptance criteria passed.

## Known Stubs

None — all logic is wired. The M-tick ring and post-gate routing are fully functional. No placeholder values flow to the UI.

## Threat Surface Scan

No new network endpoints, auth paths, or file access patterns introduced. Changes are client-side reactive state only (`vue-router`, `pinia`). No additions to threat surface.

## User Setup Required

None — no external service configuration required.

## Self-Check

- `src/App.vue` exists and contains `intendedPath`, `router.replace`, `immediate: true`, `watchEffect` — confirmed.
- `src/components/StickyFooter.vue` exists and contains `resetMode`, `reset-active` class binding, no-op guard, scoped `box-shadow` — confirmed.
- Task 1 commit `92a4bd1` — present in git log.
- Task 2 commit `a50de3f` — present in git log.
- `pnpm type-check` — passed (0 errors).
- `pnpm build` — passed (58 modules, 2.66s).

## Self-Check: PASSED

## Next Phase Readiness

- Plan 01-04 (smoke tests for routing, gate behaviour, persistence) can proceed: the gate routing and M-tick semantics it tests are now fully implemented.
- StyleGate.vue inertness (no router calls) is a verified invariant for the test suite to assert.

---
*Phase: 01-paridad-prototipo*
*Completed: 2026-05-04*
