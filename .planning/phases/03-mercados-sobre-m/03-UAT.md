# Phase 3 — Mercados sobre M: Operator UAT Checklist

**Generated:** 2026-05-04
**Phase:** 03-mercados-sobre-m
**Plans covered:** 03-01 (WCAG AA audit + token remediation), 03-02 (service integrity + this UAT)

Before walking this matrix, confirm the automated checks pass:

```
pnpm check:contrast   # exits 0 — all 13 themes pass WCAG AA
pnpm check:markets    # exits 0 — all 12 market service lists are valid
pnpm type-check       # exits 0 — no TypeScript errors
pnpm build            # exits 0 — clean production bundle
```

WCAG AA audit results are documented in:
[`03-CONTRAST-RESULTS.md`](03-CONTRAST-RESULTS.md)

---

## A. Recognisability sign-off

**Goal:** Each market must be identifiable as its industry by a non-technical reader with no prior context.

**Procedure:**
1. Run `pnpm dev` and open `http://localhost:5173`.
2. On the Home view, open the market selector and pick a market.
3. Navigate to `/servicios` — take a screenshot.
4. Navigate to `/quienes-somos` — take a screenshot.
5. Show the screenshots to someone who has not seen this brief. Ask: "What kind of business do you think this is?"
6. Mark `yes` if they name the industry correctly (or something close), `no` + note otherwise.

| id | sub | recognisable as industry? | screenshot | reviewer | date |
|----|-----|---------------------------|------------|----------|------|
| cpg | CPG | [ ] yes / [ ] no — note: | screenshots/cpg/ | | |
| banca | Finance | [ ] yes / [ ] no — note: | screenshots/banca/ | | |
| retail | Retail | [ ] yes / [ ] no — note: | screenshots/retail/ | | |
| automotriz | Auto | [ ] yes / [ ] no — note: | screenshots/automotriz/ | | |
| salud | Health | [ ] yes / [ ] no — note: | screenshots/salud/ | | |
| bebidas | Drinks | [ ] yes / [ ] no — note: | screenshots/bebidas/ | | |
| inmobiliario | Real Estate | [ ] yes / [ ] no — note: | screenshots/inmobiliario/ | | |
| educacion | Edu | [ ] yes / [ ] no — note: | screenshots/educacion/ | | |
| turismo | Travel | [ ] yes / [ ] no — note: | screenshots/turismo/ | | |
| tech | Tech | [ ] yes / [ ] no — note: | screenshots/tech/ | | |
| moda | Fashion | [ ] yes / [ ] no — note: | screenshots/moda/ | | |
| startups | Startups | [ ] yes / [ ] no — note: | screenshots/startups/ | | |

---

## B. 48-state QA matrix

**Goal:** Confirm every market × every view renders without console errors, with WCAG AA holding (auto-verified by `pnpm check:contrast`), and with the market personality visible through palette, typography, and the Reconfigurando overlay on entry.

**Procedure:**
1. Pick a market from Home.
2. For each view, open it, check the browser console for errors, and visually confirm the market colours + fonts are applied.
3. Tick the cell when: (a) no console errors, (b) market personality is visible, (c) layout is intact.

```
           Home        Servicios   Quienes     Contacto
cpg        [ ]         [ ]         [ ]         [ ]
banca      [ ]         [ ]         [ ]         [ ]
retail     [ ]         [ ]         [ ]         [ ]
automotriz [ ]         [ ]         [ ]         [ ]
salud      [ ]         [ ]         [ ]         [ ]
bebidas    [ ]         [ ]         [ ]         [ ]
inmobiliario [ ]       [ ]         [ ]         [ ]
educacion  [ ]         [ ]         [ ]         [ ]
turismo    [ ]         [ ]         [ ]         [ ]
tech       [ ]         [ ]         [ ]         [ ]
moda       [ ]         [ ]         [ ]         [ ]
startups   [ ]         [ ]         [ ]         [ ]
```

**Notes per market (optional — fill in if any cell has issues):**

| Market | View | Issue | Resolved? |
|--------|------|-------|-----------|
| | | | |

---

## C. Transition smoke

**Goal:** Confirm multi-market switches feel instant-but-not-jarring, that the Reconfigurando overlay carries the gap, and that there is no full reload or flash beyond the overlay.

> [ ] Switch CPG → Banca → Tech → Moda → exit market. Each transition feels instant-but-not-jarring; Reconfigurando overlay carries the gap (~900ms); no full reload, no flash beyond the overlay.

**Transition timing contract:** Body background and color transition in 600ms (`background 600ms ease, color 600ms ease` — verified by `pnpm check:markets` smoke; see Task 2 automated checks). The Reconfigurando overlay masks the swap for ~900ms. Net effect: the user sees the overlay appear, content reconfigures beneath it, overlay fades — total perceived switch time ≤ 1 second.

---

## D. Sign-off

All checks above must be complete before Phase 4 planning begins.

| Reviewer | Date | All cells PASS? | Notes |
|----------|------|-----------------|-------|
| | | [ ] yes [ ] no | |

**Automated gates (must be green before sign-off):**

- [ ] `pnpm check:contrast` exits 0 — OVERALL 13/13 themes pass WCAG AA
- [ ] `pnpm check:markets` exits 0 — OVERALL 12/12 markets pass
- [ ] `pnpm type-check` exits 0
- [ ] `pnpm build` exits 0
