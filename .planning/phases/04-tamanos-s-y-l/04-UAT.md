# Phase 4 — Tamaños S y L: Operator UAT Checklist

**Generated:** 2026-05-05
**Phase:** 04-tamanos-s-y-l
**Plans covered:** 04-01 (extend `pnpm check:contrast` to S + L tokens, 15/15 via DEC-041), 04-02 (HomeView per-level branches + `LMarquee` + L card treatments across the 4 protected views), 04-03 (this UAT)

Before walking the 5×3 view-state matrix, confirm the automated checks pass:

```
pnpm check:contrast   # exits 0 — all 15 themes (M + 12 markets + S + L) pass WCAG AA
pnpm check:markets    # exits 0 — all 12 market service lists are valid
pnpm type-check       # exits 0 — no TypeScript errors
pnpm build            # exits 0 — clean production bundle
pnpm dev              # vite dev server up at http://localhost:5173
```

WCAG AA audit results for S (Clean) and L (Bold) are documented in:
[`04-CONTRAST-RESULTS.md`](04-CONTRAST-RESULTS.md)

The contrast contract is already auto-verified — this walk-through is a **visual sanity check** that DECISION-LX-LOCKED's rendered surfaces hold in shipped UI (per the operator escalation path in `04-CONTRAST-RESULTS.md`), and that S and L personalities read at first glance across all 5 views.

**Level personality cheat-sheet** (what the operator should expect to see):

| level | bg / ink / accent | display font | feel |
|-------|-------------------|--------------|------|
| **S** (Clean) | `#ffffff` / `#1d1d1f` / `#0066cc` | sans (Inter / Geist stack) | Apple-clean, centered, flat — no rotation, no chunky shadows |
| **M** (Crafted) | dark editorial baseline | serif display | the existing M default from Phases 1–2 |
| **L** (Bold) | `#FFEE00` / `#000` / `#FF00AA` | **Archivo Black** | brutalist — 4px borders, 8px chunky shadows, marquee, ±0.5° card rotation |

Pick each level from the **footer mini-slider** (XS · S · M · L · XL — only S / M / L are functional after Phase 4; XS / XL ship in Phases 5–6). The Reconfigurando overlay should play on every level switch (DEC-016).

---

## A. 5×3 view-state matrix

**Goal:** Confirm every view × every level (S / M / L) renders without console errors, the level personality reads, the Reconfigurando overlay plays on entry, and WCAG AA holds (already auto-confirmed at the token level via `04-CONTRAST-RESULTS.md`; this is a visual sanity check on the rendered DOM).

**Procedure:**
1. Run `pnpm dev` and open `http://localhost:5173`.
2. Pick a level from the footer mini-slider (start with S).
3. For each of the 5 views, navigate to it, check the browser console for errors, and visually confirm: (a) the level palette + display font are applied, (b) the Reconfigurando overlay played on entry, (c) layout is intact, (d) no magenta-on-yellow body copy in L (the DEC-041 escalation trigger).
4. Repeat for M, then L.
5. Tick the cell when all four conditions hold.

```
                  S          M          L
Home              [ ]        [ ]        [ ]
Servicios         [ ]        [ ]        [ ]
Quiénes somos     [ ]        [ ]        [ ]
Cliente           [ ]        [ ]        [ ]
Contacto          [ ]        [ ]        [ ]
```

**Per-cell pass criteria:**
- **No console errors** in the browser devtools.
- **Level personality reads:** S = clean white + blue accent + sans; M = dark editorial; L = brutalist yellow + magenta accent + Archivo Black.
- **Reconfigurando overlay** played on entry (~900ms swap mask).
- **WCAG AA** holds visually — body copy and large headings legible against their backgrounds.

**Notes per cell (optional — fill in if any cell has issues):**

| View | Level | Issue | Resolved? |
|------|-------|-------|-----------|
| | | | |

---

## B. Per-level highlights

**Goal:** Confirm the prototype-fidelity surfaces from DECISION-LX-LOCKED (L) and the Apple-clean spec (S) render exactly as specified by Plan 04-02.

Tick each item once verified at `pnpm dev`:

- [ ] **L Home marquee** scrolls smoothly across the top: 16 `PUBLICIDAD A TU MEDIDA ★` tokens in **Archivo Black** 24px uppercase, 4px black borders top + bottom, 30s linear infinite, seamless 50%-translate loop.
- [ ] **L Servicios cards** rotate ±0.5° with chunky 8px black shadows + 4px black borders, alternating yellow / black / white backgrounds (`:nth-child(4n+1)` magenta-on-black, `:nth-child(4n+3)` black-on-magenta, others white-on-black).
- [ ] **L Quiénes somos photo borders** are 4px black with 6px magenta (`#FF00AA`) shadow; client cards alternate yellow / white with 8px black shadow.
- [ ] **L Cliente work cards** alternate yellow / white via `:nth-child(odd)` / `:nth-child(even)` with 6px chunky black shadow.
- [ ] **L Contacto channels card** is yellow (`#FFEE00`) with 8px black shadow; chatbot card is white with 8px magenta accent shadow.
- [ ] **S Home** centers everything: SIZE wordmark clamp(80px,16vw,220px), `Publicidad a tu medida.` in muted grey, `Somos tu [rotator]` with the rotating word in `var(--accent)` blue (`#0066cc`); MarketSelect centered.
- [ ] **S Servicios cards** are flat — **no rotation, no chunky shadows** — inheriting the `level-s` tokens (white bg, blue accent, Apple grey muted).

---

## C. Reduced-motion sweep

**Goal:** Confirm the global `prefers-reduced-motion` rule in `src/styles/main.css` correctly mutes L's motion-heavy surfaces while preserving status feedback (Reconfigurando is communication, not decoration).

**Procedure:** Toggle OS-level reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion; Windows: Settings → Accessibility → Visual effects → Animation effects OFF). Refresh the page. Pick L. Walk Home → Servicios → Cliente.

> [ ] With OS-level reduced motion ON and `prefers-reduced-motion: reduce` honored: the L `marquee` freezes mid-scroll (no horizontal translate), L card hovers no longer translate (`transform` collapsed to `0.01ms`), the Home rotator on M / S freezes between words. The Reconfigurando overlay still flashes on level switches — it's status feedback, not decoration, and stays visible per DEC-016.

---

## D. Transition smoke

**Goal:** Confirm multi-level switches feel instant-but-not-jarring, that the Reconfigurando overlay carries the gap, that `~600ms` body bg/ink fades hold, and that there is no full reload or flash beyond the overlay.

**Procedure:** From Home, use the footer mini-slider to walk M → S → L → M. Time each transition with the devtools Performance tab open if needed.

> [ ] Pick **M → S → L → M** from the footer mini-slider in order. Each transition: ~600ms body bg/ink fade (`background 600ms ease, color 600ms ease` from `main.css`), Reconfigurando overlay covers the swap for ~900ms, then the new layout commits. **No full page reload** (URL stays the same, no white flash beyond the overlay), no flicker between the overlay's lift and the next layout's commit.

**Transition timing contract:** Body `background` and `color` transition in 600ms. The Reconfigurando overlay masks the swap for ~900ms. Net effect: the user sees the overlay appear, content reconfigures beneath it, overlay fades — total perceived switch time ≤ 1 second.

---

## E. Sign-off

All checks above must be complete before Phase 5 (XS) planning begins.

| Reviewer | Date | All cells PASS? | Notes |
|----------|------|-----------------|-------|
| | | [ ] yes [ ] no | |

**Automated gates (must be green before sign-off):**

- [ ] `pnpm check:contrast` exits 0 — OVERALL 15/15 themes pass WCAG AA (M + 12 markets + S + L)
- [ ] `pnpm check:markets` exits 0 — OVERALL 12/12 markets pass
- [ ] `pnpm type-check` exits 0
- [ ] `pnpm build` exits 0

**DEC-041 escalation flag (operator-only, set if observed):**

- [ ] During the L walk-through, magenta accent text was observed rendering directly on the yellow body bg (i.e. NOT on `#000` button or `#fff` card surfaces). If checked, follow the operator escalation path in `04-CONTRAST-RESULTS.md` § "Operator escalation path" — either remove the offending surface (preferred) or escalate the locked-palette unlock to the user.
