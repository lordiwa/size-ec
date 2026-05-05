---
phase: 06-tamano-xl-unleashed
plan: 01
subsystem: testing
tags: [wcag, contrast, accessibility, xl, neon, gradient, audit, vue3, css-tokens]

# Dependency graph
requires:
  - phase: 05-tamano-xs-plain
    provides: parseLevelTokens / buildLevelPairs / runLevel scaffolding (16 themes via DEC-052 override pattern)
  - phase: 04-tamanos-s-y-l
    provides: per-level override pattern (DEC-041 — rendered surface, not default rule)
  - phase: 03-mercados-sobre-m
    provides: 12-market parser + has-market muted derivation (DEC-035)
  - phase: 02-mensaje-y-contacto
    provides: M baseline contrast contract (DEC-032/033/034)
  - phase: 01-paridad-prototipo
    provides: html.level-xl token block + xl-grad-text keyframes (already in src/styles/main.css:146-168)
provides:
  - "scripts/check-contrast.cjs covers full SIZE catalog (17 themes)"
  - "06-CONTRAST-RESULTS.md — XL audit + --accent-2 decorative-only rationale"
  - "Closed 17-style WCAG AA contract — every style in the project passes"
  - "Empirical proof XL needs neither token tweaks nor per-level pair overrides"
affects:
  - phase: 06-tamano-xl-unleashed
    note: "Plans 06-02 (WebGL2 gate + L fallback), 06-03 (HomeView XL branch), 06-04 (UAT) inherit a passing XL contrast audit"
  - phase: 07-contenido
    note: "Phase 7 ships Three.js / Phaser / Tone.js into XL — must preserve the 17/17 baseline locked here"
  - phase: 09-cierre
    note: "Final 17-style QA inherits a closed contrast contract — no new pairs to audit, just regressions"

# Tech tracking
tech-stack:
  added: []  # Pure script extension — no new libraries
  patterns:
    - "Default-contract sufficiency: when level rendered surfaces match the default .bright-cta + inline-on-bg pattern, no per-level override is needed (XL is the first such level after M)"
    - "Decorative-only token exclusion: gradient-clipped tokens (--accent-2 inside background-clip:text) are excluded from the body-pair contract because the rendered colour is a moving function of position+time, not a single hex value"

key-files:
  created:
    - .planning/phases/06-tamano-xl-unleashed/06-CONTRAST-RESULTS.md
  modified:
    - scripts/check-contrast.cjs

key-decisions:
  - "DEC-062 — XL clears 5/5 on the default 5-pair contract with zero per-level override and zero token tweaks. Body 20.38:1, muted 8.77:1, large 20.38:1, CTA 15.42:1, inline 15.42:1. First level since M to need neither remediation nor structural override (DEC-041 L pattern, DEC-052 XS pattern, DEC-035 has-market derivation all not invoked)."
  - "DEC-063 — --accent-2 (#ff00ff) is intentionally excluded from XL's body-pair contract because it is consumed only inside the html.level-xl .xl-grad-text rule's linear-gradient + -webkit-background-clip:text composition. The rendered text colour is a moving gradient between #00ffaa and #ff00ff, never a single hex value, so a body-pair contrast check would be meaningless. Captured in 06-CONTRAST-RESULTS.md for auditability; if a future XL view binds --accent-2 to a flat fill (non-gradient surface), the contract is re-evaluated then."

patterns-established:
  - "Default-contract sufficiency confirmation: M and XL both pass with the unmodified 5-pair contract — they are the catalog's two dark-mode levels with high-luminance ink + accent against near-black bg. Future levels that follow this shape can skip override authoring."
  - "Decorative-token exclusion documentation: when a token exists for token-system uniformity but is consumed only via gradient/clip/animation, document the exclusion explicitly in the audit (mirrors DEC-052's --accent declared-but-unused pattern in XS)."

requirements-completed:
  - REQ-sizes-five  # XL slice — WCAG AA proof closed for the XL token block; visual XL view branch + WebGL2 gate land in 06-02 / 06-03

# Metrics
duration: ~9 min
completed: 2026-05-04
---

# Phase 6 Plan 01: Extend pnpm check:contrast to XL — Summary

**XL passes 5/5 on the default WCAG AA contract with zero overrides, closing the 17-style contrast contract for the entire SIZE catalog.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-05-04T04:14:30Z
- **Completed:** 2026-05-04T04:23:42Z
- **Tasks:** 2
- **Files modified:** 1 (script)
- **Files created:** 1 (audit doc)

## Accomplishments

- Extended `scripts/check-contrast.cjs` to read `html.level-xl` from `src/styles/main.css` via the existing `parseLevelTokens('xl')` flow — same code path used for S, L, XS.
- Confirmed empirically that XL clears all 5 pairs on the **default contract** with no per-level override: body 20.38:1, muted 8.77:1, large heading 20.38:1, accent CTA 15.42:1, accent inline 15.42:1.
- Documented `--accent-2` (#ff00ff) as decorative-only with full rationale in `06-CONTRAST-RESULTS.md` — gradient-clipped via `xl-grad-text` rule, never rendered as a flat fill.
- Updated header / usage / `--levels-only` / OVERALL line all to "17 themes (M + 12 markets + S + L + XS + XL)".
- Closed the 17-style WCAG AA contrast contract — `pnpm check:contrast` now exits 0 with `OVERALL 17/17 themes pass`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend check-contrast.cjs to XL** — `241cec5` (feat)
2. **Task 2: Document audit + --accent-2 rationale** — `29c1818` (docs)

_Plan metadata commit follows this SUMMARY._

## Files Created/Modified

- `scripts/check-contrast.cjs` — added XL block (parses `html.level-xl`, runs default 5-pair contract via `runLevel()`, no override); updated header / usage / OVERALL to 17 themes; `--levels-only` now prints 5 themes.
- `.planning/phases/06-tamano-xl-unleashed/06-CONTRAST-RESULTS.md` — new audit doc mirroring 05-CONTRAST-RESULTS.md format; explicit `--accent-2` decorative-only section; final-state block showing 17/17 PASS.

## Decisions Made

- **DEC-062 — XL needs no override.** The default 5-pair contract maps cleanly onto XL's actual rendered surfaces: `.bright-cta` is reused (`#050505` text on `#00ffaa` bg = 15.42:1), and accent text renders inline on the dark body (`#00ffaa` on `#050505` = 15.42:1). DEC-041 (L) and DEC-052 (XS) override patterns were not invoked. Confirmed by reading `xl-grad-text` rule + token block; no surface in XL violates the default contract assumptions.
- **DEC-063 — --accent-2 is gradient-only.** Consumed only inside `html.level-xl .xl-grad-text` via `linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent))` + `background-clip:text`. The rendered text colour is a moving function of position + time (animated by the `xl-grad` 6s linear infinite keyframe), so a body-pair contrast check on `--accent-2` would be meaningless. Excluded from the contract; documented for auditability so a future flat-fill use of `--accent-2` triggers re-evaluation.

## Deviations from Plan

None — plan executed exactly as written. All Task 1 acceptance criteria green on first run; all Task 2 verify gates green on first run; no Rule 1/2/3 auto-fixes triggered; no Rule 4 architectural escalations needed. The plan correctly predicted XL would be the easiest level in the catalog (math: dark bg + white ink + neon accent = 17:1+ on every pair).

## Issues Encountered

- **Initial verify gate command used a `/tmp/contrast.txt` path (POSIX convention) which doesn't exist on Windows.** Switched to a project-local `.contrast-out.txt` to run the verify gate, then deleted the temp file before staging. No code or commit impact — purely a verify-step accommodation. Both Task 1 and Task 2 verify gates passed on the project-local path.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **17-style WCAG AA contract closed.** The full SIZE catalog (M + 12 markets + S + L + XS + XL) passes via `pnpm check:contrast`. No further per-style audit work is needed in Phase 6 or later.
- **Plan 06-02 unblocked** — `useXlCapability()` composable + WebGL2 gate + L fallback can land on a green contrast baseline. The composable is pure DOM (no Three.js dep) per D-03, so no contrast surface changes.
- **Plan 06-03 unblocked** — HomeView XL branch (verbatim port of prototype lines 62-76) inherits the passing audit; the `xl-grad-text` rule on the wordmark + rotator span has been validated as non-functional content (decorative only) and falls outside the contract.
- **Phase 7 baseline locked** — when Three.js / Phaser / Tone.js / postprocessing / physics ship into XL, Phase 7 must preserve the 17/17 baseline. Any new XL surface (e.g. mini-game UI text, Tone.js controls) must clear the default contract or trigger a per-level override following the DEC-041 / DEC-052 pattern.

## Self-Check: PASSED

Verified before STATE.md / ROADMAP.md update:

- `scripts/check-contrast.cjs` exists, contains XL block, runs `OVERALL 17/17 themes pass WCAG AA at the required thresholds`.
- `.planning/phases/06-tamano-xl-unleashed/06-CONTRAST-RESULTS.md` exists, contains "XL (Unleashed)" section header and "--accent-2" rationale section.
- Commit `241cec5` exists in `git log` (Task 1: feat).
- Commit `29c1818` exists in `git log` (Task 2: docs).
- `pnpm check:contrast` exits 0.
- `pnpm type-check` exits 0.
- `pnpm build` exits 0 (built in 3.31s, no XL-specific JS in bundle — Three.js / Phaser absent as expected per D-05).

---
*Phase: 06-tamano-xl-unleashed*
*Plan: 01*
*Completed: 2026-05-04*
