---
phase: 01-paridad-prototipo
plan: "04"
subsystem: testing
tags: [vitest, vue-test-utils, jsdom, pinia, vue-router]

# Dependency graph
requires:
  - phase: 01-paridad-prototipo
    provides: "style store (useStyleStore), MarketsGrid component, App.vue gate flow, router with 5 named routes + catch-all"

provides:
  - "Vitest 4.x + jsdom smoke layer covering all Phase 1 owned requirements"
  - "tests/stores/style.spec.ts — 7 specs proving single-flag persistence, last-write-wins, reset, rehydration"
  - "tests/components/MarketsGrid.spec.ts — 4 specs proving 12-tile render, click->setMarket, active tile"
  - "tests/integration/gate-flow.spec.ts — 5 specs proving gate appearance, suppression, happy-path restore, and drift-case router.replace branch"
  - "tests/integration/routes.spec.ts — 2 specs proving 5 named routes resolve + catch-all not-found"

affects: [02-diseno-visual, 10-cierre]

# Tech tracking
tech-stack:
  added:
    - "vitest 4.1.5 (test runner with Vite 6 peer)"
    - "@vue/test-utils 2.4.10 (component mounting + flushPromises)"
    - "jsdom 29.1.1 (browser-like environment for unit/integration tests)"
    - "@vitest/coverage-v8 4.1.5 (future coverage reports)"
  patterns:
    - "Fresh Pinia instance per test via setActivePinia(createPinia()) in setup.ts"
    - "localStorage.clear() before each test to ensure store rehydrates cleanly"
    - "await nextTick() after store mutations to let deferred Vue watchers flush to localStorage"
    - "createMemoryHistory() router in integration tests (avoids real browser URL)"
    - "StickyFooter stubbed in gate-flow tests (not under test); StyleGate left real"

key-files:
  created:
    - "vitest.config.ts — jsdom env, globals, @ alias, setupFiles pointer"
    - "tests/setup.ts — global Pinia + localStorage reset hooks"
    - "tests/stores/style.spec.ts — store unit specs"
    - "tests/components/MarketsGrid.spec.ts — component smoke specs"
    - "tests/integration/gate-flow.spec.ts — App-level gate + route-restore specs"
    - "tests/integration/routes.spec.ts — router resolution specs"
  modified:
    - "package.json — added test/test:watch scripts + 4 devDeps"
    - ".gitignore — added coverage/ and .vitest-out.log"

key-decisions:
  - "Used await nextTick() in store specs because style store watcher uses default (deferred) flush, not flush:'sync' — this is correct Vue behavior and the fix lives in the spec, not the store"
  - "StickyFooter stubbed (global.stubs) in gate-flow integration tests to prevent component resolution errors without affecting gate assertion logic"
  - "Did NOT add @vue/compiler-sfc as direct dep — Vue 3.4+ ships it inside vue package (plan locked this)"
  - "Vitest output consumed via child_process.execSync in verification — no temp log files on disk"
  - "Playwright e2e deliberately deferred to Phase 10 per CONTEXT.md scope boundary"

patterns-established:
  - "Spec naming: tests/{stores,components,integration}/*.spec.ts"
  - "All specs import named exports (router named import) matching source export shapes"
  - "Integration specs use createMemoryHistory to avoid real browser navigation"

requirements-completed:
  - REQ-routes-five-views
  - REQ-style-gate
  - REQ-style-persistence
  - REQ-home-rotating-words

# Metrics
duration: 5min
completed: 2026-05-04
---

# Phase 01 Plan 04: Vitest Smoke Layer Summary

**Vitest 4 + jsdom integration test layer with 18 specs across 4 files proving gate flow, 5-route resolution, single-flag last-write-wins, and MarketsGrid tile interaction**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-04T16:55:50Z
- **Completed:** 2026-05-04T17:00:37Z
- **Tasks:** 3 (all complete)
- **Files modified/created:** 8

## Accomplishments

- Vitest 4.1.5 + jsdom 29.1.1 + @vue/test-utils 2.4.10 installed; `pnpm test` is the canonical gate (exits 0)
- 18 tests across 4 spec files covering all 4 Phase 1 owned requirements (routes, gate, persistence, home-rotator component side)
- Gate-flow spec exercises both the happy-path AND the drift-case `router.replace(intendedPath.value)` branch — the branch that fires only when the user navigates away while the gate is still open

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Vitest deps + test script** - `fc0ed4e` (chore)
2. **Task 2: vitest.config.ts + tests/setup.ts** - `277749c` (test)
3. **Task 3a: style store specs** - `6f8681f` (test)
4. **Task 3b: MarketsGrid component specs** - `9dd7bdc` (test)
5. **Task 3c: gate-flow integration specs** - `265850a` (test)
6. **Task 3d: routes integration specs** - `a8044fc` (test)

## Files Created/Modified

- `vitest.config.ts` — Vitest config: jsdom, globals, @ alias, setupFiles
- `tests/setup.ts` — Global hooks: fresh Pinia + localStorage.clear() per test
- `tests/stores/style.spec.ts` — 7 store specs (persistence, last-write-wins, reset, rehydration)
- `tests/components/MarketsGrid.spec.ts` — 4 component specs (tiles, click, active state)
- `tests/integration/gate-flow.spec.ts` — 5 integration specs (gate logic + drift case)
- `tests/integration/routes.spec.ts` — 2 router resolution specs (5 routes + catch-all)
- `package.json` — Added `test`/`test:watch` scripts + 4 devDeps
- `.gitignore` — Added `coverage/` and `.vitest-out.log`

## Decisions Made

- `await nextTick()` required in store specs because the store's `watch(active, ...)` uses default Vue flush (`'pre'` — deferred). Mutations update `active.value` immediately but the watcher callback (which writes to localStorage) runs on the next microtask tick. The fix is in the spec, not the store — the store behavior is correct.
- `StickyFooter: true` stub added to gate-flow integration tests. The test only asserts on `.gate` visibility and `RouterView` content; stubbing the footer avoids component-resolution side effects without changing what is verified.
- `@vue/compiler-sfc` deliberately NOT added as a direct devDependency (Vue 3.4+ ships it inside `vue`; adding it explicitly causes duplicate-instance warnings).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Store spec templates required `await nextTick()` after mutations**
- **Found during:** Task 3 (first `pnpm test` run)
- **Issue:** 4 store specs failed with `TypeError: Cannot read properties of null` because `localStorage.getItem('size-style')` returned null immediately after `setSize()`/`setMarket()`. The store watcher (deferred flush) had not yet written to localStorage.
- **Fix:** Added `await nextTick()` import from `vue` and `await nextTick()` calls after each store mutation before reading localStorage.
- **Files modified:** `tests/stores/style.spec.ts`
- **Verification:** All 18 tests pass after fix; `pnpm test` exits 0.
- **Committed in:** `6f8681f` (Task 3a commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — spec async timing bug)
**Impact on plan:** The production store code is correct; only the spec needed adjustment. No scope creep.

## Issues Encountered

The plan's spec templates assumed synchronous localStorage writes after store mutations. In practice, Vue's watcher with default flush is deferred, requiring `nextTick()`. This is a known jsdom + Vue reactivity behavior and was resolved immediately.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 4 Phase 1 owned requirements are now protected by automated specs
- `pnpm test` is the canonical pre-commit gate going forward
- Playwright e2e is still deferred to Phase 10 per plan scope — this Vitest layer is the contract surface until then
- Phase 2 (design system tokens, visual regression) can proceed independently of this test layer

## Self-Check: PASSED

- vitest.config.ts: FOUND
- tests/setup.ts: FOUND
- tests/stores/style.spec.ts: FOUND
- tests/components/MarketsGrid.spec.ts: FOUND
- tests/integration/gate-flow.spec.ts: FOUND
- tests/integration/routes.spec.ts: FOUND
- All 6 task commits verified in git log (fc0ed4e, 277749c, 6f8681f, 9dd7bdc, 265850a, a8044fc)

---
*Phase: 01-paridad-prototipo*
*Completed: 2026-05-04*
