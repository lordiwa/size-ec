# Phase 5 — Tamaño XS (Plain): Operator UAT Checklist

**Generated:** 2026-05-05
**Phase:** 05-tamano-xs-plain
**Plans covered:** 05-01 (extend `pnpm check:contrast` to XS tokens, 16/16 via DEC-052), 05-02 (XS view branches across HomeView + 4 protected views — 1999 markup vocabulary per DEC-050; DEC-053/054/055 logged), 05-03 (this UAT)

Before walking the 5-cell view-state matrix, confirm the automated gates pass:

```
pnpm check:contrast   # exits 0 — all 16 themes (M + 12 markets + S + L + XS) pass WCAG AA
pnpm check:markets    # exits 0 — all 12 market service lists are valid
pnpm type-check       # exits 0 — no TypeScript errors
pnpm build            # exits 0 — clean production bundle
pnpm dev              # vite dev server up at http://localhost:5173
```

WCAG AA audit results for XS (Plain) — including the DEC-052 per-level overrides
(CTA = LINK on BG; inline = INK on marquee `#FFFF00`) and the operator escalation
path if a red-on-gray surface is found in the rendered DOM — are documented in:

[`05-CONTRAST-RESULTS.md`](05-CONTRAST-RESULTS.md)

The contrast contract is already auto-verified — this walk-through is a **visual
sanity check** that DECISION-XS-RETRO + DEC-050's rendered surfaces hold in
shipped UI (per the operator escalation path in `05-CONTRAST-RESULTS.md`), and
that the 1999 personality reads at first glance across all 5 views.

**XS personality cheat-sheet** (what the operator should expect to see):

| token / surface | value | feel |
|-----------------|-------|------|
| `--bg` / `--ink` / `--muted` | `#c0c0c0` / `#000` / `#444` | Win95 desktop chrome — gray, never red |
| `--accent` | `#ff0000` | declared but **not consumed** as a colour value (DEC-052) |
| display font | **Times New Roman** (serif) | newspaper/early-web feel, never sans |
| links | `#0000ee` underlined; visited `#551a8b` | 1999 default browser blue / purple |
| layout | `<table border="1">`, `<center>`, `<hr/>`, `<marquee>` | HTML 1999 vocabulary verbatim — no flex, no grid, no rounded corners |
| buttons (footer mini-slider) | Win95 raised bevel (`outset`); inset on click | physical-feeling chrome |
| Home decorative emphasis | yellow `<marquee>` `#FFFF00` with 2px black border | the only large-size inline-emphasis surface |

Pick **XS** from the **footer mini-slider** (XS · S · M · L · XL — XS / S / M / L
are functional after Phase 5; XL is chrome-only until Phase 6). The
Reconfigurando overlay should play on every level switch (DEC-016).

---

## A. 5-cell XS view-state matrix

**Goal:** Confirm every view × XS renders without console errors, the 1999
personality reads, the Reconfigurando overlay plays on entry, and WCAG AA holds
visually (already auto-confirmed at the token level via
`05-CONTRAST-RESULTS.md`; this is a visual sanity check on the rendered DOM).

**Procedure:**
1. Run `pnpm dev` and open `http://localhost:5173`.
2. Pick **XS** from the footer mini-slider.
3. For each of the 5 views, navigate to it, check the browser console for errors, and visually confirm: (a) the XS palette + Times New Roman are applied, (b) the Reconfigurando overlay played on entry, (c) the layout is intact (`<table>` borders visible where applicable), (d) no red-on-gray accent body copy (the DEC-052 escalation trigger).
4. Tick the cell when all four conditions hold.

```
                    XS
Home                [ ]
Servicios           [ ]
Quiénes somos       [ ]
Cliente             [ ]
Contacto            [ ]
```

**Per-cell pass criteria:**
- **No console errors** in the browser devtools.
- **XS personality reads:** gray `#c0c0c0` body, Times New Roman serif, blue underlined links, `<table>`-driven layout where applicable, yellow `<marquee>` on Home only.
- **Reconfigurando overlay** played on entry (~900ms swap mask).
- **WCAG AA** holds visually — body copy and large headings legible against the gray bg; no red text on gray anywhere.

**Notes per cell (optional — fill in if any cell has issues):**

| View | Issue | Resolved? |
|------|-------|-----------|
| | | |

---

## B. 1999-look highlights

**Goal:** Confirm the prototype-fidelity surfaces from DECISION-XS-RETRO + DEC-050 render exactly as specified by Plan 05-02 — that the 1999 look is **literal** (HTML 1999 vocabulary + Win95 chrome), not a retro accent on top of a modern layout.

Tick each item once verified at `pnpm dev` (DevTools → Elements where called out):

- [ ] **Home renders Times New Roman** — the ★ SIZE ★ heading and italic tagline (`<p><i>Publicidad a tu medida.</i></p>`) display in the serif Times New Roman face. DevTools confirms `font-family` resolves to `Times New Roman` (or the platform's `serif` fallback that maps to it). No sans-serif anywhere in the XS markup.
- [ ] **Home `<marquee>` scrolls** — the yellow (`#FFFF00`) `<marquee scrollamount="6">` banner across the top of Home actively scrolls right-to-left with the prototype content (`✦ Somos tu [rotator] ✦ Bienvenido a SIZE Agency Inc. ✦`). The marquee has a 2px solid black border and `#000` ink on `#FFFF00` (DEC-052 inline-pair surface, 19.56:1 contrast).
- [ ] **Servicios renders an actual `<table>`** — DevTools → Elements confirms a `<TABLE>` element (not a `<DIV>` with CSS grid) lists all 11 services with `border="1"`, `cellpadding="6"`, `cellspacing="0"`. Cell borders are 1px solid black (`<TD>` borders visible). `<thead>`: `# | Servicio | Descripción`.
- [ ] **Quiénes somos renders the team grid as a `<TABLE>`** — DevTools → Elements confirms a `<TABLE>` tag wraps the 4-column team grid (NOT a `<DIV>` with `display: grid` or `display: flex`). Each cell holds a nested `<TABLE>` photo frame (DEC-054 — width: 120px; height: 160px on the inner `<TD>`) + `<i>name</i>` + `<small>role</small>`. Clients section also uses `<TABLE border="1">` with a `[ LOGO ]` placeholder column.
- [ ] **Cliente renders one `<table border="1">` per cliente** — when no slug resolves, all 3 SIZE_CLIENTS render as separate `<TABLE>` blocks each listing `# | Trabajo | Detalle` rows from `c.work[]`, separated by `<hr/>`. When a slug resolves, exactly one cliente's `<TABLE>` renders. DevTools confirms 1px solid black borders on `<TD>` cells.
- [ ] **Contacto channels + chatbot in a 2-col `<table>`; form aligns labels/inputs via `<table>` rows** — DevTools confirms a 2-column `<TABLE>` with channels `<UL>` left and `[ CHATBOT 1999 GOES HERE — TBD Phase 8 ]` right. The `<form @submit.prevent>` wraps a `<TABLE>` whose rows align `<label>` / `<input>` / `<textarea>` cells (Geocities-style form layout). The submit button is `<input type="submit" value="Enviar">`.
- [ ] **Internal links render as plain blue underlined anchors** — RouterLink instances (e.g., "Vuelve al inicio", "Hablemos →", per-cliente links from Quiénes somos) render as `<a>` with `color: #0000ee` and `text-decoration: underline` (no styling overrides — XS overrides every `<a>` via `html.level-xs a`). Visited links go `#551a8b` purple. DevTools computed-style confirms.
- [ ] **`<table>` borders are 1px solid (DevTools confirms `<TABLE>` tag, not `<DIV>` with CSS grid)** — a global spot-check across Servicios, Quiénes somos, Cliente, and Contacto: every layout `<TABLE>` element has `border="1"` (or scoped CSS `border: 1px solid #000`), `border-collapse: collapse`. No `display: grid` / `display: flex` / `border-radius` / `box-shadow` on any of the 5 XS scoped CSS blocks (`.home-xs`, `.srv-xs`, `.qn-xs`, `.cl-xs`, `.ct-xs`) — DEC-050 vocabulary discipline.
- [ ] **Footer Win95 bevel responds to click** — the StickyFooter mini-slider buttons render as raised Win95 chrome (`border: 2px outset #c0c0c0`, gradient background `linear-gradient(#fff, #c0c0c0)`); on `:active` they switch to inset (depressed). The XS / S / M / L / XL slot buttons all behave this way under XS. The 1ms transition (per the global `prefers-reduced-motion` override) is below human perception — the bevel still depresses visibly on click.

---

## C. Reduced-motion sweep

**Goal:** Confirm the global `prefers-reduced-motion` rule in `src/styles/main.css` correctly mutes XS's only motion-heavy surface (the Home `<marquee>`) while preserving status feedback (Reconfigurando is communication, not decoration) and text-level rotation (the Home rotator swaps words, not pixels — it's text replacement, not motion).

**Procedure:** Toggle OS-level reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion; Windows: Settings → Accessibility → Visual effects → Animation effects OFF). Refresh the page. Pick XS. Walk Home → Servicios → Cliente.

> [ ] With OS-level reduced motion ON and `prefers-reduced-motion: reduce` honored: the Home `<marquee>` **freezes mid-scroll** (the global `* { animation-duration: 0.01ms !important }` override collapses the marquee's intrinsic scroll into a still frame). The Home **rotating word keeps swapping** — it's text replacement (`<Transition mode="out-in">` on the rotator span), not motion, and stays alive. The Reconfigurando overlay still flashes on level switches (status feedback per DEC-016). Footer Win95 bevel buttons still depress on click — the 1ms transition under reduced-motion is below human perception, so the bevel state still reads.

---

## D. Transition smoke

**Goal:** Confirm M ↔ XS round-trips feel instant-but-not-jarring, that the Reconfigurando overlay carries the gap, that the `~600ms` body bg/ink fade holds (gray ↔ dark editorial), and that there is no full reload or flash beyond the overlay.

**Procedure:** From Home, use the footer mini-slider to walk M → XS → M. Time each transition with the devtools Performance tab open if needed.

> [ ] Pick **M → XS → M** from the footer mini-slider in order. Each transition: ~600ms body bg/ink fade (`background 600ms ease, color 600ms ease` from `main.css` — dark editorial fading to `#c0c0c0` and back), Reconfigurando overlay covers the swap for ~900ms, then the new layout commits. **No full page reload** (URL stays the same, no white flash beyond the overlay), no flicker between the overlay's lift and the next layout's commit. The XS branch swaps in (HomeView `v-else-if="style.code === 'xs'"`; the 4 protected views' `v-if="style.code === 'xs'"` siblings) and the M-default branch returns cleanly.

**Transition timing contract:** Body `background` and `color` transition in 600ms. The Reconfigurando overlay masks the swap for ~900ms. Net effect: the user sees the overlay appear, content reconfigures beneath it, overlay fades — total perceived switch time ≤ 1 second.

---

## E. Sign-off

All checks above must be complete before Phase 6 (XL) planning begins.

| Reviewer | Date | All cells PASS? | Notes |
|----------|------|-----------------|-------|
| | | [ ] yes [ ] no | |

**Automated gates (must be green before sign-off):**

- [ ] `pnpm check:contrast` exits 0 — OVERALL 16/16 themes pass WCAG AA (M + 12 markets + S + L + XS)
- [ ] `pnpm check:markets` exits 0 — OVERALL 12/12 markets pass
- [ ] `pnpm type-check` exits 0
- [ ] `pnpm build` exits 0

**DEC-052 escalation flag (operator-only, set if observed):**

- [ ] During the XS walk-through, the operator found an XS surface that contradicts DEC-052's structural override — i.e. either (a) a colored CTA consuming `--accent #ff0000` as its background or text colour anywhere in shipped XS markup, OR (b) inline emphasis text rendering `#ff0000` directly on the `#c0c0c0` body bg (NOT on the yellow `<marquee style="background:#FFFF00">` surface). If checked, **file a CHECKPOINT and re-run 05-01 contrast pair definitions** — follow the operator escalation path in `05-CONTRAST-RESULTS.md` § "Operator escalation path", which requires either (a) removing the offending surface from the XS rendered components (preferred — preserves the locked palette; the 1999 vocabulary already excludes red inline text by convention), or (b) escalating to the user for an explicit DECISION-XS-RETRO unlock to darken the accent token (e.g. `#ff0000` → `~#a40000` to clear 4.5:1 on gray, at which point it stops reading as 1999-standard red).
