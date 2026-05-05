# Phase 6: Tamaño XL (Unleashed) — Context

**Gathered:** 2026-05-05
**Status:** Ready for execution
**Source:** PROJECT.md (DEC-006, DECISION-XL-PHASER, REQ-progressive-loading, REQ-xl-capability-detection) + ROADMAP.md §Phase 6 + ExistingData prototype `00021082_04_*.js` lines 62-76 (Home XL branch).

<domain>
## Phase Boundary

Phase 6 ships **XL (Unleashed)** as the visual identity + the lazy-load + WebGL2-gate infrastructure. After this phase a user picking XL from the gate or footer slider sees Home render with the prototype-fidelity look (animated `xl-grad-text` gradient on dark bg, neon green/magenta accents, runtime label placeholder for the future Three.js scene), with WCAG AA holding and an automatic L-fallback path when WebGL2 is missing.

What's in:
- HomeView XL branch — verbatim port of prototype (00021082_04 lines 62-76): centered, runtime label `[ home.scene · runtime ]`, big `xl-grad-text` SIZE wordmark, "Publicidad a tu medida." tagline, `xl-grad-text` rotator, `MarketSelect` dropdown. The animated gradient is pure CSS (`@keyframes xl-grad`, already in `src/styles/main.css:156-168`).
- WCAG AA auto-verified for XL (extend `pnpm check:contrast` to the `html.level-xl` block; target 17/17 themes — every style in the project, the entire 17-style catalog).
- WebGL2 capability detection composable (`useXlCapability()`) with auto-fallback to L when WebGL2 unavailable, plus a styled toast (educational message). The composable does NOT load any Three.js / Phaser / Tone.js code yet — it just probes the canvas + emits a boolean. Lazy-loading scaffolding is in place so a later phase can plug Three.js / Phaser into the same hook.
- The 4 protected views (Servicios, Quiénes, Cliente, Contacto) inherit the L visual treatment when XL is active because the prototype only specifies XL for Home and DECISION-XL-PHASER's actual JS-driven content lands in Phase 7. We will not add `.l-bold` re-binding for XL — instead, the existing `<section v-else>` wrapping in those 4 views from Phase 5 already accepts XL into the M-default branch, which is fine because XL's body text uses the same dark-mode tokens as M (just with neon accents). No view change needed in this phase for those 4.

What's deferred to Phase 7 (Contenido):
- Actual Three.js scene rendering inside Home XL (`@tresjs/core` + Three.js installed + a runtime scene).
- Phaser 3 mini-game (DECISION-XL-PHASER, marked "implemented in Phase 7" in PROJECT.md).
- Tone.js generative audio (default OFF).
- `postprocessing` and physics library installation.
- The actual lazy-loaded chunks for the XL stack — Phase 6 sets up the composable contract and confirms zero XL code lands in the XS-S-M bundle; Phase 7 adds the libraries themselves.
- Per-view XL treatments for Servicios / Quiénes / Cliente / Contacto (Phase 7 covers content + final XL layer).

What's deferred outside the milestone:
- Educational fallback toast COPY refinement (Phase 7 product-design pass owns final wording).

## Phase 5 → Phase 6 invariants

- LOCKED-001 (WCAG AA) holds for all 16 themes (M + 12 markets + S + L + XS); Phase 6 must add XL → **17/17 themes**, the entire catalog. After Phase 6 the `check:contrast` script reaches its end state.
- LOCKED-002: each `v-if`/`v-else-if` keys solely on `style.code === 'xl'`. Never combined with marketId. (XL clears market — same rule as XS/S/L.)
- DEC-015 session-only state.
- DEC-016 Reconfigurando overlay plays on XL → other and other → XL.
- The `level-xl` token block + `xl-grad-text` keyframes already live in `src/styles/main.css:146-168` from the Phase 1 port — Phase 6 reads them, doesn't duplicate them.
- The footer mini-slider already exposes XS / S / M / L / XL; after Phase 6, all 5 levels are visually functional. XL-specific JS (Three.js scene + Phaser mini-game) lands in Phase 7.

</domain>

<decisions>
## Locked Decisions

| ID | Decision | Source |
|----|----------|--------|
| LOCKED-001 | WCAG AA legibility, all 17 styles. Phase 6 covers M + 12 markets + S + L + XS + XL = 17/17. | PROJECT.md / brief §3 |
| LOCKED-002 | Single active style; level clears market. | PROJECT.md / brief §3.bis |
| DEC-006 | XL stack lazy-loaded: Three.js + Phaser + Tone.js + postprocessing + Cannon-es/Rapier physics. | PROJECT.md |
| DECISION-XL-PHASER | Phaser 3 first-class for embedded mini-games (not decorative WebGL). Lazy-loaded with the rest of the XL stack. | PROJECT.md (annotated "Phase 7" — see DEC-060 below) |
| REQ-progressive-loading | XS-M lightweight; L and XL lazy-load their stacks. End-to-end bundle audit confirms XS/S/M visitors never download L or XL stacks. | PROJECT.md / REQUIREMENTS.md |
| REQ-xl-capability-detection | XL gated on WebGL2; fallback to L on failure with no crash. | PROJECT.md / REQUIREMENTS.md |
| DEC-060 | Phase 6 is the **infrastructure phase** for XL — visual identity (CSS gradient prototype port) + WebGL2 capability detection + L-fallback hook + WCAG AA verification. The actual Three.js scene + Phaser mini-game + Tone.js installation land in Phase 7 (Contenido) alongside team photos/comments and final content. Resolves the apparent contradiction between PROJECT.md DECISION-XL-PHASER ("Phase 7") and ROADMAP §Phase 6 success criterion #6 ("Phaser locked to DECISION-XL-PHASER"): Phase 6 LOCKS the contract; Phase 7 ships the implementation. | Phase 6, 2026-05-05 |
| DEC-061 | XL does NOT add per-view `.xl-bold` treatments for Servicios / Quiénes / Cliente / Contacto in Phase 6 — those 4 views inherit the M-default branch because the prototype only specifies XL for Home, and any XL-specific per-view chrome is bound to the actual content of Phase 7 (team photos, client cases, mini-game). The `<section v-else>` wrapping from Phase 5 already accepts XL cleanly. | Phase 6, 2026-05-05 |

## Claude's Discretion (resolve in plans)

- D-01 — Where to slot the XL branch in `HomeView.vue`. **Decision:** insert as `v-else-if="style.code === 'xl'"` between the existing S branch and the XS branch (so L → S → XL → XS → M-default). Rationale: keeps the per-level chain ordered by visual weight, and the M default still catches markets + any unknown level.
- D-02 — How to render the runtime label and gradient text. **Decision:** the prototype uses `class="mono upper"` + inline color `var(--accent)` for the runtime label, and `class="xl-grad-text"` for the wordmark + rotator span. Both already exist in main.css; reuse, don't duplicate.
- D-03 — How to detect WebGL2. **Decision:** new composable `src/composables/useXlCapability.ts` that creates a throwaway `<canvas>`, requests `getContext('webgl2')`, returns `{ supported: boolean, reason: string }`, and never retains the canvas. Pure DOM — no Three.js dependency.
- D-04 — How to handle the L fallback. **Decision:** wire the composable into the style store's `setLevel` handler. When user picks XL but `useXlCapability().supported === false`, the store auto-redirects to `level: 4` (L), shows a `<XlFallbackToast>` component (~3s, then auto-dismiss), and logs `[xl] WebGL2 unavailable — falling back to L`. The toast lives in `App.vue` so it persists across route changes.
- D-05 — How to verify the bundle audit (REQ-progressive-loading). **Decision:** Phase 6 establishes the **contract** by ensuring no `import 'three'` / `'@tresjs/core'` / `'phaser'` / `'tone'` exists anywhere in the codebase yet (no XL lib code reaches the bundle by definition). The actual REQ-progressive-loading verification (lazy chunks, dynamic imports, route-split bundles) runs in Phase 7 when those libraries are installed.
- D-06 — Where to add per-level WCAG AA verification for XL. **Decision:** extend `scripts/check-contrast.cjs` mechanically — same `parseLevelTokens('xl')` and `runLevel(...)` flow used for S, L, XS. After this plan: 17 themes (M + 12 markets + S + L + XS + XL) all pass. The XL block has both `--accent #00ffaa` and `--accent-2 #ff00ff` — the script's existing 5-pair contract uses `--accent` only; `--accent-2` is decorative-only (used inside the gradient text, where the gradient masks the color anyway). Document this explicitly in 06-CONTRAST-RESULTS.md.
- D-07 — `prefers-reduced-motion` for XL. **Decision:** the global `@media (prefers-reduced-motion: reduce)` rule already kills `*` animations including `xl-grad`. Phase 6 only verifies the rule still applies (UAT step). When Phase 7 adds Three.js / Phaser, those libraries get their own per-feature reduced-motion handling.
- D-08 — How to QA Phase 6. **Decision:** `06-UAT.md` — single XL view (Home) checkbox + WebGL2-fallback test (operator opens DevTools → emulate `webgl2: disabled`, picks XL, confirms toast appears + auto-flip to L) + bundle-size spot check (operator runs `pnpm build` and confirms no Three.js / Phaser chunks in dist/) + reduced-motion sweep + transition smoke + sign-off table.

</decisions>

<refs>
## Canonical Refs

- `.planning/PROJECT.md` — DEC-006, DECISION-XL-PHASER, REQ-progressive-loading, REQ-xl-capability-detection
- `.planning/ROADMAP.md` — Phase 6 success criteria (lines 111-122)
- `.planning/REQUIREMENTS.md` — REQ-progressive-loading, REQ-xl-capability-detection
- `ExistingData/SIZE-design-brief-v4.md §6` — XL row of the size table
- `ExistingData/prototype-extracted/00021082_04_*.js` lines 62-76 — Home XL branch verbatim source
- `src/styles/main.css:146-168` — `html.level-xl` token block + `xl-grad-text` keyframes
- `src/views/HomeView.vue` — current L/S/XS/M layout (Phase 5)
- `src/components/MarketSelect.vue`, `RotatingWord.vue`
- `src/stores/style.ts` — extends here (auto-fallback hook)
- `src/App.vue` — extends here (XlFallbackToast mount)
- `scripts/check-contrast.cjs` — extends here (16 → 17)
- `.planning/phases/05-tamano-xs-plain/05-UAT.md` — format mirror for 06-UAT.md
</refs>
