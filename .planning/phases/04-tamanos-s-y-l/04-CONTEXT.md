# Phase 4: Tamaños S y L — Context

**Gathered:** 2026-05-04
**Status:** Ready for planning
**Source:** Direct authoring — Phase 1 ported the M layout for every view; Phases 4–6 add per-level branches by reading `style.code` and switching layout/styling. The prototype's S and L treatments are extracted in `ExistingData/prototype-extracted/` (home.jsx, servicios.jsx, quienes.jsx, cliente.jsx, contacto.jsx).

<domain>
## Phase Boundary

Phase 4 ships **S (Clean)** and **L (Bold)** as fully working creative-size styles, on top of the M baseline that Phases 1–2 already produced. After this phase a user can pick S or L from the gate / mini-slider and see all 5 views restyle to that intensity, with WCAG AA holding and the Reconfigurando overlay carrying the swap.

What's in:
- HomeView: per-level branches for `s` and `l` (M already shipped). Match the prototype's home.jsx verbatim — S is centered clean (white bg, blue accent, sans), L is brutalist (yellow bg, black ink, marquee top, 2-col grid with magenta+yellow accents, dropdown with chunky 4px+6px shadow).
- ServiciosView: L brutalist card treatment (alternating yellow / black / white bg every 4th card, 4px black borders, 8px chunky shadows, ~0.5° rotation). S is structurally the same as M but inherits the level-s tokens (already in main.css).
- QuienesSomosView: photo borders in L become 4px black + 6px accent shadow; client cards alternate yellow/white in L; PortraitPlaceholder already handles per-level via `style.code` (Phase 1).
- ClienteView: work cards alternate yellow/white in L with 6px black shadow.
- ContactoView: channels card BG=#FFEE00 yellow in L with 8px chunky shadow; chatbot card BG=#fff with accent shadow.
- WCAG AA auto-verified in S and L (extend `pnpm check:contrast` to read the S/L blocks from `src/styles/main.css`).
- `prefers-reduced-motion` blocks L's marquee + per-card hover lifts.

What's deferred:
- **GSAP + Lottie lazy-load** (ROADMAP §Phase 4 SC #2 mentions it). The prototype is CSS-only and reaches the brutalist look through `@keyframes l-marquee` + `transform`/`box-shadow` tricks. Phase 4 ships the prototype-fidelity CSS treatment. Adding GSAP/Lottie as decorative enhancement is logged for **Phase 7 polish** (Contenido) or as a follow-up, not for this phase. Decision recorded as DEC-019 below.
- XS (Phase 5), XL (Phase 6).

## What's Out of Scope

- XS / XL level branches (Phases 5–6).
- Real GSAP/Lottie integration on L (Phase 7 polish or after).
- Per-market overrides on S or L (markets and levels are mutually exclusive — the only interaction is the existing has-market wins-over-level rule from Phase 3).
- Photography content for L (Phase 7).
- New chatbot wiring in Contacto L (Phase 8).

## Phase 3 → Phase 4 invariants

- LOCKED-001 (WCAG AA), LOCKED-002 (mutual exclusivity) hold for all 13 themes already (M + 12 markets); Phase 4 must not regress and must add S + L to that contract → 15 themes pass after this phase.
- Session-only state (DEC-015) holds.
- Reconfigurando overlay (DEC-016) plays on every level switch.
- The `level-s`, `level-l` token blocks already live in `src/styles/main.css` from the Phase 1 port — Phase 4 reads them, doesn't duplicate them.
- The footer mini-slider already exposes XS / S / M / L / XL; only S and M and L will be functional after Phase 4 (XS/XL show but cycling to them just changes ink/bg via the existing tokens — full per-view treatment lands in Phases 5–6).

</domain>

<decisions>
## Locked Decisions

| ID | Decision | Source |
|----|----------|--------|
| LOCKED-001 | WCAG AA legibility, all 17 styles. Phase 4 covers M + S + L = 15/17 by phase end. | PROJECT.md / brief §3 |
| LOCKED-002 | Single active style; level clears market. | PROJECT.md / brief §3.bis |
| DEC-014 | Roadmap is prototype-first; deploy + Cierre live in Phase 9. | STATE.md |
| DEC-015 | Session-only state — no localStorage. | User decision 2026-05-04 |
| DEC-016 | Reconfigurando overlay on every level/market change. | User decision 2026-05-04 |
| DEC-018 | Themes are LOCKED to prototype palettes; only TUNE if a pair fails WCAG AA. | Phase 3 |
| DEC-019 | L ships CSS-only (prototype-fidelity). GSAP + Lottie integration deferred to Phase 7 polish or later. The brief's §10 "L lazy-loads GSAP + Lottie" requirement is treated as an enhancement target, not a Phase 4 blocker — the brutalist visual identity is fully delivered by CSS. | Phase 4, 2026-05-04 |
| DECISION-LX-LOCKED | L visual contract: `#FFEE00` bg / `#000` ink / `#FF00AA` accent / Archivo Black display / 4px borders / 8px+6px chunky shadows with hover translate / 30s marquee. | PROJECT.md |

## Claude's Discretion (resolve in plans)

- D-01 — How to render the L marquee on Home. **Decision:** new `<LMarquee>` component (scoped CSS-only) wraps a horizontal-flex of `<span>` elements with `animation: l-marquee 30s linear infinite`. The keyframes `l-marquee` already exist in `src/styles/main.css` line ~140 (port from prototype). The component renders inside `<HomeView v-if="style.code === 'l'">` only.
- D-02 — How to switch HomeView layouts by level. **Decision:** keep one HomeView component that branches `<template v-if="style.code === 'l'">` / `<template v-else-if="style.code === 's'">` / `<template v-else>` (M default). Each branch is mostly its own markup. No mixin, no slots — readable per-level layouts beat clever abstraction.
- D-03 — How to apply L card treatments in Servicios / Quiénes / Cliente / Contacto. **Decision:** scoped CSS in each component using `:deep(html.level-l) ...` selectors OR a class binding `:class="{ 'l-bold': style.code === 'l' }"` on the cards' wrapper, then per-class styling. Pick the second (class binding) — easier to scope, doesn't depend on `:deep()` quirks. Fall back to the first if a global selector is needed for a third-party-ish style (none in this phase).
- D-04 — Where to add per-level WCAG AA verification. **Decision:** extend `scripts/check-contrast.cjs` to also parse `src/styles/main.css` for the `html.level-s` and `html.level-l` blocks (regex on the existing format), running the same 5-pair contract. After this plan: 15 themes (M + 12 markets + S + L) all pass.
- D-05 — `prefers-reduced-motion` for L. **Decision:** the global `@media (prefers-reduced-motion: reduce)` rule in main.css already collapses `*` animation-duration to 0.01ms — this kills the L marquee and any L card hover transforms. Phase 4 only adds an inline test confirming the rule still wins after the per-component scoped styles are added.
- D-06 — How to QA the 5 views × 3 sizes (S/M/L) = 15 cells. **Decision:** `04-UAT.md` mirrors `03-UAT.md` — one row per (view, level) cell with PASS/FAIL/note + reviewer + date. Operator walks through `pnpm dev`, picks each level from the footer slider, and ticks every view. Reduced-motion sweep is a separate single-line check. Total ≥15 + 5 + 1 = 21 checkboxes.

</decisions>

<refs>
## Canonical Refs

- `.planning/PROJECT.md` — DECISION-LX-LOCKED palette + DECISION-XS-RETRO (XS, deferred)
- `.planning/ROADMAP.md` — Phase 4 success criteria (lines 79–88)
- `.planning/REQUIREMENTS.md` — REQ-sizes-five (S+L slice)
- `.planning/phases/03-mercados-sobre-m/03-CONTRAST-RESULTS.md` — sets the contrast-tweak pattern
- `ExistingData/prototype-extracted/00021082_04_*.js` — home.jsx (per-level home layouts)
- `ExistingData/prototype-extracted/00021163_02_*.js` — servicios.jsx (L card treatment)
- `ExistingData/prototype-extracted/00021244_01_*.js` — quienes.jsx (L photo + clients)
- `ExistingData/prototype-extracted/00021325_07_*.js` — cliente.jsx (L work cards)
- `ExistingData/prototype-extracted/00021406_03_*.js` — contacto.jsx (L channels + chatbot)
- `src/styles/main.css` — `html.level-s`, `html.level-l` blocks + `@keyframes l-marquee` + footer overrides
- `src/views/HomeView.vue` — current M-only layout (Phase 1 port)
- `src/components/RotatingWord.vue` — reused across all level branches
- `src/components/MarketSelect.vue` — already accepts `code` prop for the L brutalist chrome
- `scripts/check-contrast.cjs` — extends here
</refs>
