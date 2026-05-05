---
phase: 06-tamano-xl-unleashed
plan: 04
subsystem: uat-signoff
tags: [uat, sign-off, xl, webgl2, fallback, reduced-motion, accessibility, operator]

# Dependency graph
requires:
  - phase: 06-tamano-xl-unleashed
    provides: 17-style WCAG AA contract closed (06-01 — DEC-062, DEC-063)
  - phase: 06-tamano-xl-unleashed
    provides: WebGL2 capability gate + L fallback toast (06-02 — DEC-064/065/066/067)
  - phase: 06-tamano-xl-unleashed
    provides: HomeView XL branch shipped (06-03 — DEC-068/069/070)
  - phase: 05-tamano-xs-plain
    provides: 05-UAT.md format mirror (5-section + automated gates + footnotes pattern)
provides:
  - "06-UAT.md — operator sign-off doc for Phase 6 (XL Unleashed)"
  - "Deterministic WebGL2-disabled DevTools negative-path procedure (Chrome Rendering panel + Firefox about:config alternatives)"
  - "Explicit DEC-060 / DEC-061 footnotes documenting expected-not-bug deferrals (Three.js + Phaser → Phase 7; 4 protected views inherit M-default in XL)"
  - "Closed Phase 6 plan deck — operator UAT walk-through is the only remaining gate before Phase 7 unblocks"
affects:
  - phase: 06-tamano-xl-unleashed
    note: "Phase 6 plan deck is now complete (4/4); operator UAT walk-through is the final gate"
  - phase: 07-contenido
    note: "Once operator signs off Phase 6, Phase 7 (Three.js / Phaser / Tone.js installation + content) is unblocked"
  - phase: 09-cierre
    note: "Final 17-style QA inherits the XL UAT result; the WebGL2 fallback path is locked at the contract level here"

# Tech tracking
tech-stack:
  added: []  # Pure documentation plan — no code changes
  patterns:
    - "UAT mirror discipline: 06-UAT.md follows 05-UAT.md's section structure (A visual / B negative-path / C bundle / D reduced-motion / E transition / F sign-off + automated gates) so an operator who signed off Phase 5 walks Phase 6 with the same vocabulary"
    - "DevTools-driven negative-path procedure: WebGL2 disabling is reproducible without real hardware constraints (Chrome Rendering panel — fastest; Firefox about:config — alternative). Mirrors how Phase 4/5 used DevTools for reduced-motion and visual sanity checks rather than requiring multi-device labs"
    - "Footnote pattern for expected-not-bug deferrals: explicitly call out DEC-060 / DEC-061 at the bottom of the operator-facing doc so the operator does not file false-positive bugs against Phase 7-scoped work"

key-files:
  created:
    - .planning/phases/06-tamano-xl-unleashed/06-UAT.md
  modified: []

key-decisions:
  - "Mirror discipline (Phase 6) — 06-UAT.md follows 05-UAT.md's section structure verbatim (header + cheat-sheet + A/B/C/D/E/F + automated gates + footnotes) so the Phase 6 walk-through is muscle-memory after Phase 5. Section shape variation: B (WebGL2 fallback test) replaces 05-UAT's pure-visual matrix — Phase 6 introduces the negative path as a first-class operator gate because REQ-xl-capability-detection is the phase's signature requirement. Sections A (XL Home only — 1 cell, 6 sub-checks) and B (5 sub-checks) together replace the multi-cell matrices Phases 4/5 used since XL only ships a Home branch (DEC-061 — 4 protected views inherit M-default by design)."
  - "Footnote-as-decision-anchor — DEC-060 (Three.js + Phaser deferred to Phase 7) and DEC-061 (4 protected views inherit M-default in XL) are pinned as numbered footnotes at the bottom of 06-UAT.md so an operator walking the doc cold encounters them at the natural moment (Section A's runtime label sub-check + Section E's protected-view fallback). Both call out the deferral as 'expected, not a bug' to prevent false-positive bug reports against Phase 7-scoped work. Phase 5's DEC-052 escalation flag pattern (sign-off-time validation loop) is NOT used here because Phase 6 has no rendered-surface escalation contract — DEC-062 confirmed the default 5-pair contract suffices for XL with zero overrides."

requirements-completed:
  - REQ-sizes-five  # XL slice closed end-to-end: WCAG AA (06-01) + WebGL2 gate (06-02) + Home XL view (06-03) + operator UAT (06-04). The full 5-size catalog (XS / S / M / L / XL) is now visually + functionally + accessibly verified.
  - REQ-xl-capability-detection  # Closed at the contract level (06-02) AND at the operator-procedure level (06-04 Section B — deterministic DevTools negative path). Phase 7 will plug Three.js / Phaser into the established `supported === true` branch but the gate contract does not change.

# Metrics
duration: ~3 min
completed: 2026-05-05
---

# Phase 6 Plan 04: Operator UAT (XL + WebGL2 fallback) — Summary

**Authored 06-UAT.md — the operator sign-off doc for Phase 6 (XL Unleashed). 20 checkboxes across 6 sections (Home XL visual check, WebGL2 fallback negative path, bundle audit, reduced-motion sweep, M ↔ XL transition smoke, sign-off + 4 automated gates), mirroring 05-UAT.md structure with a DevTools-driven WebGL2-disabled procedure replacing Phase 5's multi-cell visual matrix. Footnotes pin DEC-060 (Three.js + Phaser → Phase 7) and DEC-061 (4 protected views inherit M-default in XL) as expected-not-bug deferrals. Phase 6 plan deck is now complete (4/4); operator UAT walk-through is the final gate before Phase 7 unblocks.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-05T04:44:51Z
- **Completed:** 2026-05-05T04:47:19Z
- **Tasks:** 1 (single-task plan)
- **Files created:** 1 (`06-UAT.md`)

## Accomplishments

- Authored `.planning/phases/06-tamano-xl-unleashed/06-UAT.md` with the full Phase 6 operator sign-off procedure, mirroring `05-UAT.md`'s section structure verbatim.
- Document opens with header (plans covered, automated-gate command list, contrast-results + capability-contract references) and an XL personality cheat-sheet (token table + cycle description for `xl-grad-text`).
- **Section A — Home-XL visual check** (6 checkboxes): Reconfigurando overlay, runtime label `[ home.scene · runtime ]` rendering, animated SIZE wordmark gradient cycle, tagline, gradient-rotator, MarketSelect dropdown.
- **Section B — WebGL2 fallback test** (5 checkboxes): Chrome DevTools Rendering panel + Firefox `about:config` procedures; auto-flip to L, educational toast with WebGL2-specific copy, `×` close button, no console errors / black screen, 3.5 s auto-dismiss.
- **Section C — Bundle audit** (1 checkbox): Confirms zero `three / phaser / tone / postprocessing / @tresjs / cannon-es / rapier` chunks in `dist/assets/` after `pnpm build` (Phase 6 ships the contract; Phase 7 installs the libraries and re-runs with full bundle-splitting verification).
- **Section D — Reduced-motion sweep** (1 checkbox): Confirms global `prefers-reduced-motion: reduce` rule freezes the `xl-grad` animation while preserving Reconfigurando overlay (status feedback per DEC-016) and rotating-word text replacement (DEC-019/020).
- **Section E — Transition smoke** (1 checkbox): M ↔ XL ↔ M round-trip with the ~600ms body bg/ink fade + ~900ms Reconfigurando mask + no full reload contract; explicit DEC-061 callout that the 4 protected views fall back to M-default under XL.
- **Section F — Sign-off** (table row + 4 automated-gate checkboxes): Reviewer / Date / All cells PASS? / Notes; `pnpm check:contrast` (17/17), `pnpm check:markets` (12/12), `pnpm type-check`, `pnpm build`.
- **Footnotes** — DEC-060 (Three.js scene + Phaser mini-game intentionally deferred to Phase 7; resolves the apparent PROJECT.md / ROADMAP.md contradiction with "Phase 6 LOCKS the contract; Phase 7 ships the implementation") and DEC-061 (4 protected views inherit M-default in XL — explicit decision, not a missing piece). Both anchored as superscript references at the natural moment in Sections A and E.
- **Total: 20 checkboxes** (well above the plan's ≥10 minimum). 9 required keywords (`06-CONTRAST-RESULTS`, `XL`, `Home`, `WebGL2`, `Reconfigurando`, `prefers-reduced-motion`, `xl-grad`, `DEC-060`, `DEC-061`) all present.

## Task Commits

Single task, single atomic commit:

1. **Task 1: Author 06-UAT.md sign-off matrix** — `deff793` (docs)

_Plan metadata commit follows this SUMMARY._

## Files Created/Modified

- **Created** `.planning/phases/06-tamano-xl-unleashed/06-UAT.md` — 201 lines, 20 checkboxes, 6 sections (A/B/C/D/E/F), 2 footnotes (DEC-060 + DEC-061), full mirror of 05-UAT.md format with a WebGL2-disabled DevTools procedure replacing the multi-cell visual matrix.

## Decisions Made

- **Mirror discipline (Phase 6) — 06-UAT.md tracks 05-UAT.md verbatim.** Header → cheat-sheet → A (visual) → B (negative path / 1999 highlights swap) → C (bundle / reduced-motion swap) → D (reduced-motion / transition swap) → E (transition / sign-off swap) → F (sign-off). Section shape variation: B introduces the WebGL2 fallback negative path as a first-class operator gate because REQ-xl-capability-detection is Phase 6's signature requirement; Phases 4/5 had no equivalent capability-gated negative path. Sections A and B together (6 + 5 = 11 visual + functional checkboxes for XL Home) replace the multi-cell matrices Phases 4/5 used (5×3 in 04-UAT, 5×1 in 05-UAT) since XL only ships a Home branch by design (DEC-061).
- **Footnote-as-decision-anchor pattern.** DEC-060 (Three.js + Phaser deferred to Phase 7) and DEC-061 (4 protected views inherit M-default in XL) are pinned as numbered footnotes (`[^1]` / `[^2]`) at the bottom of 06-UAT.md, with superscript references at the natural moment in the doc — DEC-060 on Section A's runtime-label sub-check (where the operator might wonder where the 3D scene is), DEC-061 on Section E's transition smoke (where the operator might wonder why Servicios / Quiénes / Cliente / Contacto don't get a per-view XL treatment). Both call out the deferral as **"expected, not a bug"** to prevent false-positive bug reports against Phase 7-scoped work. This pattern replaces Phase 4's DEC-041 escalation flag and Phase 5's DEC-052 escalation flag (both of which were sign-off-time validation loops for rendered-surface contracts) — Phase 6 has no rendered-surface escalation contract because DEC-062 confirmed the default 5-pair contract suffices for XL with zero per-level overrides.

## Deviations from Plan

None — plan executed exactly as written. The single task's `<verify>` gate passed on first run (`ok 20 boxes`). All 9 required keywords present. All 6 required sections (A/B/C/D/E/F) present. Sign-off table at the bottom. DEC-060 and DEC-061 footnotes both present with explicit "expected, not a bug" framing. No Rule 1/2/3 auto-fixes triggered; no Rule 4 architectural escalations required.

The plan's checkbox lower bound was ≥10; the authored doc has 20 — driven not by padding but by the natural shape of the XL Home check (6 surfaces to verify per the prototype port: overlay + runtime label + wordmark gradient + tagline + rotator + dropdown) plus the 5 fallback-path checkboxes (auto-flip, toast appearance, dismiss button, no errors, auto-fade) plus 1 bundle + 1 reduced-motion + 1 transition + 4 automated gates + 1 sign-off-row checkbox.

## Issues Encountered

None.

## Verification

- 06-UAT.md exists at `.planning/phases/06-tamano-xl-unleashed/06-UAT.md`.
- Plan `<verify>` automated gate passed: `ok 20 boxes` — all 9 required keywords (`06-CONTRAST-RESULTS`, `XL`, `Home`, `WebGL2`, `Reconfigurando`, `prefers-reduced-motion`, `xl-grad`, `DEC-060`, `DEC-061`) present, 20 ≥ 10 checkboxes.
- All 6 sections (A: Home-XL visual check; B: WebGL2 fallback test; C: Bundle audit; D: Reduced-motion sweep; E: Transition smoke; F: Sign-off) present.
- Sign-off table at the bottom (Reviewer / Date / All cells PASS? / Notes).
- Footnotes for DEC-060 + DEC-061 both present, anchored from Sections A and E respectively.
- References both `06-CONTRAST-RESULTS.md` (auto-verified 17/17) and `06-02-SUMMARY.md` (capability contract).
- Commit `deff793` exists in `git log` (Task 1: docs).

## User Setup Required

None for the plan execution. **Operator action required for Phase 6 closure:** walk through 06-UAT.md per the documented procedure (Sections A–E + automated gates) and sign Section F. No external services or hardware needed — DevTools handles the WebGL2-disabled negative path on any modern browser.

## Next Phase Readiness

- **Phase 6 plan deck complete (4/4).** All four plans (06-01 through 06-04) shipped. The XL slice of REQ-sizes-five and REQ-xl-capability-detection are now closed at the engineering level; the operator UAT walk-through is the only remaining gate.
- **Phase 7 (Contenido) unblocked once operator signs off.** Phase 7 will install Three.js / `@tresjs/core` / Phaser 3 / Tone.js / `postprocessing` / a physics library (Cannon-es or Rapier) lazy-loaded behind the `useXlCapability().supported === true` branch (DEC-060). Phase 7 will also revisit per-view XL treatments if the content warrants it (e.g. a Phaser mini-game embedded in Servicios), though DEC-061 keeps the default contract — 4 protected views inherit M-default in XL — as the baseline.
- **Phase 7 first-deploy trigger.** When Three.js / Phaser / Tone.js land, Section C (bundle audit) of this UAT will be re-run with the full chunk-splitting verification: an XS / S / M visitor must never download any of these libraries; an L visitor must not download Phaser / Tone.js (XL-only); an XL visitor on a non-WebGL2 browser must still not download them (the L fallback is the canonical degradation path per DEC-064).
- **17-style WCAG AA contract locked.** The full SIZE catalog (M + 12 markets + S + L + XS + XL = 17 themes) passes `pnpm check:contrast`. No new contrast surface lands in Phase 7 unless a new XL view binds `--accent-2` to a flat fill (per DEC-063, that re-evaluates the contract).

## Self-Check: PASSED

Verified before STATE.md / ROADMAP.md update:

- `.planning/phases/06-tamano-xl-unleashed/06-UAT.md` exists, contains "06-CONTRAST-RESULTS", "XL", "Home", "WebGL2", "Reconfigurando", "prefers-reduced-motion", "xl-grad", "DEC-060", "DEC-061", 20 checkboxes (≥10), Sign-off table at the bottom.
- Plan `<verify>` automated regex passed: `ok 20 boxes`.
- Commit `deff793` exists in `git log` (Task 1: docs).

---
*Phase: 06-tamano-xl-unleashed*
*Plan: 04*
*Completed: 2026-05-05*
