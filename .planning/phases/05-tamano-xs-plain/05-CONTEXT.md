# Phase 5: Tamaño XS (Plain) — Context

**Gathered:** 2026-05-05
**Status:** Ready for execution
**Source:** Approved plan-mode brief (`~/.claude/plans/xs-tiene-que-ser-cheerful-eich.md`) + user clarification 2026-05-05 ("XS tiene que ser HTML puro como en 1999. CSS super básico porque en esa época no habían librerías modernas.")

<domain>
## Phase Boundary

Phase 5 ships **XS (Plain)** as the literal Web 1999 size — the third functional creative-size after M (Phase 1–2) and S+L (Phase 4). After this phase a user picking XS from the gate or footer mini-slider sees all 5 views render in HTML 1999 vocabulary (Times New Roman, gray `#c0c0c0`, blue underlined links, `<table>` layouts, `<hr>` separators, `<marquee>` banner on Home), with WCAG AA holding and the Reconfigurando overlay carrying the swap.

What's in:
- HomeView XS branch — verbatim port of the prototype `home.jsx` XS branch (00021082_04 lines 23-37): centered, ★ SIZE ★ heading, italic tagline, yellow `<marquee>`, `<hr/>`, "Somos tu [rotator]" line, native `<MarketSelect>`.
- ServiciosView XS branch — single `<table border="1">` listing the 11 canonical services, no cards, no grid.
- QuienesSomosView XS branch — `<table>` 4×5 placeholder photo grid + clients table.
- ClienteView XS branch — `<table>` per cliente listing trabajos as rows.
- ContactoView XS branch — 2-column `<table>` for channels + chatbot placeholder, then a `<form>` with `<table>` for label/input alignment (Geocities style).
- WCAG AA auto-verified for XS (extend `pnpm check:contrast` to the `html.level-xs` block — 16/16 themes).
- Existing `prefers-reduced-motion` global rule continues to win — the `<marquee>` freezes; rotator (text) keeps swapping.

What's deferred:
- IE11 compatibility shim (ROADMAP §Phase 5 SC #3). The Vite/TS build emits modern syntax; IE11 compatibility is logged as DEC-051 (deferred) and must not gate this phase. The 1999 look is achieved at the markup layer; the engine underneath is still Vue 3.
- Real chatbot wiring on Contacto XS (Phase 8 owns it; XS placeholder is a styled-text block).
- XL (Phase 6).

## Phase 4 → Phase 5 invariants

- LOCKED-001 (WCAG AA), LOCKED-002 (mutual exclusivity) hold for all 15 themes already (M + 12 markets + S + L); Phase 5 must add XS to that contract → **16 themes** pass after this phase.
- DEC-015 session-only state — XS does not change persistence semantics.
- DEC-016 Reconfigurando overlay plays on every level switch including → XS and XS → other.
- The `level-xs` token block + `<a>` overrides + footer Win95 bevel rules already live in `src/styles/main.css:121-144` and `:309-334` from the Phase 1 port — Phase 5 reads them, doesn't duplicate them.
- The footer mini-slider already exposes XS / S / M / L / XL (StickyFooter.vue:48-62); after Phase 5, XS is the second size to be **fully** functional alongside M, S, L. XL alone remains chrome-only until Phase 6.

</domain>

<decisions>
## Locked Decisions

| ID | Decision | Source |
|----|----------|--------|
| LOCKED-001 | WCAG AA legibility, all 17 styles. Phase 5 covers M + S + L + XS = 16/17 by phase end. | PROJECT.md / brief §3 |
| LOCKED-002 | Single active style; level clears market. | PROJECT.md / brief §3.bis |
| DEC-014 | Roadmap is prototype-first; deploy + Cierre live in Phase 9. | STATE.md |
| DEC-015 | Session-only state — no localStorage. | Phase 1 |
| DEC-016 | Reconfigurando overlay on every level/market change. | Phase 1 |
| DEC-018 | Themes are LOCKED to prototype palettes; only TUNE if a pair fails WCAG AA. | Phase 3 |
| DECISION-XS-RETRO | XS is the literal Web 1999 size: gray `#c0c0c0`, Times New Roman, blue underlined links, `<table>` layout, `<hr>`, `<marquee>`, raised/inset bevels — not a retro accent. Locked palette: `--bg #c0c0c0 / --ink #000 / --muted #444 / --accent #ff0000`, links `#0000ee` / visited `#551a8b`. | PROJECT.md |
| DEC-050 | XS branches use HTML 1999 vocabulary only: `<table>`, `<center>`, `<hr>`, `<marquee>`, inline `style="..."`, basic CSS (no Tailwind, no `display: flex`/`grid`, no `border-radius`, no `box-shadow`, no `transform`, no `transition` in scoped styles). The global `body { transition }` and Reconfigurando overlay are chrome of the switcher and stay. | User decision 2026-05-05 |
| DEC-051 | IE11 compatibility (ROADMAP §Phase 5 SC #3) is deferred — Vue 3 + Vite emits modern syntax; XS achieves the 1999 look at the markup/CSS layer, not the engine layer. Logged for Phase 9 polish or future enhancement; does not gate Phase 5. | Phase 5, 2026-05-05 |

## Claude's Discretion (resolve in plans)

- D-01 — Where to slot the XS branch in `HomeView.vue`. **Decision:** insert as `v-else-if="style.code === 'xs'"` between the existing S branch and the M `v-else` fallback. Order becomes L → S → XS → M-default. The market branch lives inside the M `v-else`, untouched.
- D-02 — How to structure XS for the 4 protected views. **Decision:** wrap the existing `<template>`/`<section>` in a `v-else` and add a `v-if="style.code === 'xs'"` sibling above. NOT a `.xs-plain` class binding — XS replaces structure, doesn't decorate it.
- D-03 — How to render XS marquee on Home. **Decision:** native `<marquee scrollamount="6">` HTML element (deprecated but supported by all evergreen browsers; honored by `prefers-reduced-motion` globally because the global animation-duration override applies to it). Do NOT wrap in a `<LMarquee>`-style component — the whole point is "1999 vocabulary".
- D-04 — Where to add XS WCAG AA verification. **Decision:** extend `scripts/check-contrast.cjs` to add `'xs'` to the parsed level array. Same `parseLevelTokens()` and `buildLevelPairs()` flow used for S and L. After this plan: 16 themes (M + 12 markets + S + L + XS) all pass.
- D-05 — `prefers-reduced-motion` for XS. **Decision:** the global `@media (prefers-reduced-motion: reduce)` rule in main.css already kills `*` animations and transitions — that includes the `<marquee>` element via the `animation-duration: 0.01ms` override. Phase 5 only verifies the rule still applies; nothing new added.
- D-06 — Inline `style="..."` vs `<style scoped>`. **Decision:** prefer per-component `<style scoped>` blocks (e.g., `.home-xs`, `.srv-xs`) for repeated styles (table borders, font sizes, padding) — keeps the template readable. Use inline `style="..."` for one-offs that mirror the prototype JSX (e.g., `style="background: #FFFF00"` on the home marquee). Both are 1999-acceptable.
- D-07 — How to QA the 5 views × XS = 5 cells. **Decision:** `05-UAT.md` mirrors `04-UAT.md` — one row per view + 5-7 highlights specific to the 1999 look (Times New Roman renders, links are blue + underlined, marquee scrolls, table borders are 1px solid, footer Win95 bevels respond to click) + reduced-motion sweep + transition smoke + sign-off table. Total ≥12 checkboxes.

</decisions>

<refs>
## Canonical Refs

- `.planning/PROJECT.md` — DECISION-XS-RETRO
- `.planning/ROADMAP.md` — Phase 5 success criteria (lines ~95-106)
- `.planning/REQUIREMENTS.md` — REQ-sizes-five (XS slice)
- `~/.claude/plans/xs-tiene-que-ser-cheerful-eich.md` — approved plan-mode brief
- `ExistingData/SIZE-design-brief-v4.md §6` — XS row of the size table
- `ExistingData/prototype-extracted/00021082_04_*.js` lines 23-37 — Home XS branch verbatim source
- `src/styles/main.css:121-144` — `html.level-xs` token block + link/visited overrides
- `src/styles/main.css:309-334` — StickyFooter XS Win95 bevel overrides
- `src/data/size-data.ts` — SIZE_LEVELS (XS entry n=1), SIZE_SERVICES, SIZE_MARKETS
- `src/views/HomeView.vue` — current L/S/M layout (Phase 4)
- `src/views/ServiciosView.vue`, `src/views/QuienesSomosView.vue`, `src/views/ClienteView.vue`, `src/views/ContactoView.vue`
- `src/components/RotatingWord.vue`, `src/components/MarketSelect.vue`, `src/components/PortraitPlaceholder.vue`
- `scripts/check-contrast.cjs` — extends here
- `.planning/phases/04-tamanos-s-y-l/04-UAT.md` — format mirror for 05-UAT.md
</refs>
