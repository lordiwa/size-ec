---
phase: 09-cierre-deploy
plan: 01
subsystem: infra
tags: [firebase, firebase-tools, firebase-hosting, vite, typescript, vue3]

# Dependency graph
requires: []
provides:
  - firebase-tools@15.16.0 as devDependency, invokable via pnpm exec firebase
  - firebase.json with SPA catch-all rewrite (dist -> /index.html) and caching headers
  - .firebaserc binding default project to size-ec
  - pnpm build green (dist/index.html confirmed non-empty)
  - .firebase/ runtime cache excluded from git
affects: [09-03, 09-04, all deploy operations]

# Tech tracking
tech-stack:
  added: [firebase-tools@15.16.0]
  patterns:
    - pnpm exec firebase (project-local invoke, no global install)
    - Firebase SPA hosting with catch-all rewrite to /index.html for Vue Router deep links
    - Immutable caching for assets, no-cache for HTML

key-files:
  created:
    - firebase.json
    - .firebaserc
  modified:
    - package.json
    - pnpm-lock.yaml
    - .gitignore
    - tsconfig.node.json

key-decisions:
  - "firebase-tools installed as devDependency so pnpm exec firebase works without global state"
  - "Firebase project id size-ec used as forward declaration; Plan 04 reconciles at deploy time"
  - "tsconfig.node.json no longer extends @tsconfig/node22 to avoid es2024 lib incompatibility with typescript@5.6.3"
  - ".firebaserc default project bound to size-ec (firebase.web.app placeholder URL until domain resolved)"

patterns-established:
  - "Firebase hosting: always point public to dist (Vite default output)"
  - "SPA rewrite: source ** -> /index.html is mandatory for Vue Router deep-link refresh"

requirements-completed: []

# Metrics
duration: 15min
completed: 2026-05-04
---

# Phase 01 Plan 01: Firebase Hosting Bootstrap Summary

**firebase-tools@15.16.0 installed as devDep, firebase.json authored with SPA catch-all rewrite to dist, .firebaserc bound to size-ec, pnpm build and type-check both green**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-04T00:00:00Z
- **Completed:** 2026-05-04T00:15:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- firebase-tools@15.16.0 added to devDependencies; `pnpm exec firebase --version` prints 15.16.0
- firebase.json authored: public=dist, SPA catch-all rewrite (**->index.html), cache headers for assets + no-cache for HTML
- .firebaserc created binding default project to size-ec (forward declaration)
- .gitignore updated to exclude .firebase/ runtime cache
- Phase 1 success criterion #3 confirmed: pnpm type-check exits 0, pnpm build exits 0, dist/index.html = 968 bytes

## Task Commits

Each task was committed atomically:

1. **Task 1: Install firebase-tools as devDependency** - `223d496` (feat)
2. **Task 2: Author firebase.json and .firebaserc with SPA rewrite** - `bd6a792` (feat)
3. **Task 3: Smoke-gate the local build (success criterion #3)** - `6949f44` (chore)

**Plan metadata:** *(this commit)*

## Files Created/Modified
- `firebase.json` - Firebase Hosting config: public=dist, SPA rewrite, caching headers
- `.firebaserc` - Firebase project binding: default=size-ec
- `package.json` - firebase-tools added to devDependencies
- `pnpm-lock.yaml` - lockfile updated with firebase-tools and 615 transitive deps
- `.gitignore` - .firebase/ runtime cache entry appended
- `tsconfig.node.json` - removed @tsconfig/node22 extends; inlined compatible compilerOptions

## Decisions Made
- firebase-tools installed as devDependency (not globally) so `pnpm exec firebase` works agent-side without per-machine global state
- Used firebase project id `size-ec` as forward declaration; Plan 04 will create the Firebase project in console and reconcile
- SPA catch-all rewrite (`"source": "**"`) is non-negotiable for Vue Router deep-link refresh on direct URL navigation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed @tsconfig/node22 incompatibility with TypeScript 5.6.3**
- **Found during:** Task 3 (Smoke-gate build)
- **Issue:** `@tsconfig/node22@22.0.5` declares `"lib": ["es2024", "ESNext.Array", "ESNext.Collection", "ESNext.Iterator"]` in its base config. TypeScript 5.6.3 does not support `es2024` as a lib value. `pnpm build` (vue-tsc -b) errored with TS6046 pointing at the node_modules config file.
- **Fix:** Rewrote `tsconfig.node.json` to not extend `@tsconfig/node22` and instead inline equivalent compilerOptions (target=es2022, lib=["es2023"], module=ESNext, moduleResolution=Bundler, strict=true, esModuleInterop=true, skipLibCheck=true). This is correct for a frontend Vite project where tsconfig.node.json only covers vite.config.ts.
- **Files modified:** tsconfig.node.json
- **Verification:** `pnpm type-check` exits 0; `pnpm build` exits 0; dist/index.html = 968 bytes
- **Committed in:** 6949f44 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — pre-existing scaffold incompatibility with @tsconfig/node22@22.0.5 vs typescript@5.6.3)
**Impact on plan:** Auto-fix was necessary for the smoke-gate to pass. No scope creep. tsconfig.node.json covers only vite.config.ts so the change has no effect on Vue app compilation (tsconfig.app.json untouched).

## Issues Encountered
- `@tsconfig/node22@22.0.5` had a breaking lib value (`es2024`) not supported by `typescript@5.6.3`. Resolved by removing the extends and inlining equivalent compilerOptions. The fix is isolated to the Node/Vite config layer; the Vue app tsconfig (tsconfig.app.json) was not affected.

## User Setup Required
None — no external service configuration required for this plan. Firebase login and project creation are deferred to Plan 04.

## Next Phase Readiness
- firebase-tools installed and CLI resolves locally
- firebase.json + .firebaserc are committed and ready for Plan 03 (deploy skill) and Plan 04 (smoke deploy)
- pnpm build is confirmed green; dist/ is a valid Firebase Hosting publish target
- No blockers for Plan 02 (concurrent wave) or Plan 03 (deploy skill)

---
*Phase: 09-cierre-deploy*
*Completed: 2026-05-04*
