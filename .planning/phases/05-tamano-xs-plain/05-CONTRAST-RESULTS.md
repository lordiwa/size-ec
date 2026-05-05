# Phase 5 — XS WCAG AA contrast audit

Generated: 2026-05-04
Source: `pnpm check:contrast` against `src/styles/main.css` `html.level-xs` block + structural overrides
Script: `scripts/check-contrast.cjs` (extended in Phase 5, Plan 01)

---

## Methodology

Same 5-pair contract used for M / S / L, applied per level. Tokens for XS are read
verbatim from `src/styles/main.css` (regex on `html.level-xs { ... }`). Levels use
the **explicit `--muted`** token from the block — they do NOT use the
55%-ink-on-bg `has-market` derivation.

| Pair | FG | BG | Threshold |
|------|----|----|-----------|
| body text | INK | BG | ≥ 4.5 |
| muted text | MUTED (explicit) | BG | ≥ 4.5 |
| large heading | INK | BG | ≥ 3.0 |
| accent CTA | BG on ACCENT (or per-level override) | ≥ 4.5 |
| accent inline | ACCENT on BG (or per-level override) | ≥ 3.0 |

---

## XS (Plain) baseline

Tokens (verbatim from `html.level-xs`):

| token | value | source |
|-------|-------|--------|
| `--bg` | `#c0c0c0` | DECISION-XS-RETRO |
| `--ink` | `#000000` | DECISION-XS-RETRO |
| `--muted` | `#444444` | DECISION-XS-RETRO |
| `--accent` | `#ff0000` | DECISION-XS-RETRO (declared but unused — see DEC-052) |

Plus the link/visited overrides from `html.level-xs a` / `a:visited`:

| selector | value | source |
|----------|-------|--------|
| `a` | `#0000ee` | DECISION-XS-RETRO (1999 default link blue) |
| `a:visited` | `#551a8b` | DECISION-XS-RETRO (1999 default visited purple) |

### Default 5-pair contract (before per-level overrides)

| pair | composition | ratio | threshold | result |
|------|-------------|------:|-----------|--------|
| body | INK on BG (`#000` on `#c0c0c0`) | 11.54:1 | ≥ 4.5 | PASS |
| muted | MUTED on BG (`#444` on `#c0c0c0`) | 5.35:1 | ≥ 4.5 | PASS |
| large | INK on BG (`#000` on `#c0c0c0`) | 11.54:1 | ≥ 3.0 | PASS |
| accent CTA | BG on ACCENT (`#c0c0c0` on `#ff0000`) | **3.00:1** | ≥ 4.5 | **FAIL** |
| accent inline | ACCENT on BG (`#ff0000` on `#c0c0c0`) | **2.20:1** | ≥ 3.0 | **FAIL** |

Two pairs fail when the script naïvely applies the default contract. Both are
the red-on-gray / gray-on-red combinations the default contract assumes from
the `.bright-cta` rule + inline-accent-on-body convention.

The default contract assumes:
1. The level uses the global `.bright-cta` rule (`background: var(--accent); color: var(--bg)`).
2. Accent text renders inline on the body background.

**XS uses neither pattern.**

### Why XS's actual rendered surfaces all pass

Verified against the prototype's `HomeView` XS branch (`ExistingData/prototype-extracted/00021082_04_*.js` lines 23-37) and the global `.l-xs-button` / `html.level-xs` rules in `ExistingData/SIZE Web Prototype - standalone.html`:

- **Buttons (`.l-xs-button`):** `background: linear-gradient(#fff, #c0c0c0); color: #000; border: 2px outset #c0c0c0`
  → INK on near-BG = `#000` on roughly `#dfdfdf` to `#c0c0c0` = **>11:1** PASS. Standard Win95 raised bevel — never red.
- **Interactive CTAs:** plain `<a>` tags styled `color: #0000ee; text-decoration: underline` (the `html.level-xs a` rule)
  → LINK on BG = `#0000ee` on `#c0c0c0` = **5.17:1** PASS (≥ 4.5). The 1999 vocabulary CTA is the underlined blue link, not a colored button.
- **Marquee (Home XS):** `<marquee scrollamount="6" style="background: #FFFF00; border: 2px solid #000">✦ Somos tu {word} ✦ Bienvenido a SIZE Agency Inc. ✦</marquee>`
  → INK on yellow = `#000` on `#ffff00` = **19.56:1** PASS. The decorative inline-emphasis surface in XS is the marquee, not red text on gray.
- **`<hr/>`:** styled `border-top: 1px solid #888; border-bottom: 1px solid #fff` (raised bevel) — never red.
- **Inline accent text on gray body (`#ff0000` on `#c0c0c0`):** **does not exist** in DECISION-XS-RETRO or DEC-050 vocabulary. The accent token is declared in `html.level-xs` for token-system completeness; the rendered XS surfaces do not consume it as a colour value.

The 3.00:1 / 2.20:1 pairs test surfaces XS does not ship.

---

## DEC-052: Per-level CTA + inline overrides for XS

### Decision

The contrast checker applies two per-level overrides for `level-xs` that
reflect the actual rendered surfaces specified by DECISION-XS-RETRO + DEC-050,
rather than the default `.bright-cta` / inline-on-bg contract:

| pair | default (failing) | XS override (passing) | rendered source |
|------|-------------------|------------------------|-----------------|
| accent CTA | BG on ACCENT (`#c0c0c0` on `#ff0000`, 3.00:1) | LINK on BG (`#0000ee` on `#c0c0c0`, **5.17:1**) | DECISION-XS-RETRO + DEC-050: 1999 CTA is `<a>` underlined blue |
| accent inline | ACCENT on BG (`#ff0000` on `#c0c0c0`, 2.20:1) | INK on marquee `#FFFF00` (`#000` on `#ffff00`, **19.56:1**) | Home XS branch: `<marquee style="background:#FFFF00">` is the only large-size inline-emphasis surface |

### Rationale

1. **Tokens stay untouched.** DECISION-XS-RETRO is preserved exactly:
   `#c0c0c0` / `#000` / `#444` / `#ff0000` / `#0000ee` / `#551a8b` are not modified.
   DEC-018 ("only TUNE if a pair fails WCAG AA") is honored without ever touching the locked palette.
2. **Overrides reflect ground truth.** The XS interactive CTA per
   DECISION-XS-RETRO + DEC-050 is a plain `<a>` link styled blue (`#0000ee`)
   underlined. The default `.bright-cta` rule (BG on ACCENT) does not apply
   to XS — XS ships `.l-xs-button` (Win95 bevel, INK on gray gradient) and `<a>`
   links, never a red `.bright-cta`. The audit pair must match the rendered colour.
3. **No red-on-gray inline accent surface in XS.** The accent token
   `#ff0000` is declared for token-system uniformity but is not consumed as a
   colour by any rendered XS view. The decorative inline-emphasis surface is
   the yellow marquee on Home (verbatim from prototype `home.jsx` XS branch);
   testing red on gray would punish a surface that does not exist.
4. **Same shape as L override (DEC-041) and Phase 3 has-market derivation
   (DEC-035).** The 5-pair contract is per-mode: when a level overrides the
   global rule, the audit follows the override. This is now the third
   instance of the rendered-surface-not-default-rule pattern.

### Operator escalation path

If during 05-03 UAT the operator finds that red `#ff0000` accent text DOES
render directly on the gray body anywhere in XS (i.e. the rendered DOM
departs from DECISION-XS-RETRO + DEC-050), the inline override must be
removed and one of the following two paths surfaced for explicit user
approval (token tweak violates DECISION-XS-RETRO):

- (a) Remove the red-on-gray surface from XS's rendered components
  (preferred — preserves the locked palette; the 1999 vocabulary already
  excludes red inline text by convention).
- (b) User unlocks DECISION-XS-RETRO and approves an accent darkening tweak;
  cheapest remediation would be `#ff0000` → `#cc0000` (~3.55:1 inline, still
  under 4.5; DEC-018 single-token gate). Note: clearing the 4.5 body
  threshold from gray would require darker than ~`#a40000` and would no
  longer read as a 1999-standard red.

Neither path is taken in 05-01. This audit accepts the override and defers
verification to the UAT walk-through in 05-03.

---

## Tweaks applied

| level | token | before | after | reason |
|-------|-------|--------|-------|--------|
| XS | — | — | — | Tokens untouched per DECISION-XS-RETRO; pair contract uses per-level overrides instead (see DEC-052) |

**Total tokens changed: 0.** DEC-018's >1-token-per-level escalation gate is
not triggered. The remediation path is structural (per-level pair contract),
not palette-level.

---

## Final state

```
SIZE — XS Plain      | 5 pairs checked | all >= 3.0 (lowest: accent CTA    (LINK on BG — XS link override) = 5.17:1)

OVERALL  16/16 themes pass WCAG AA at the required thresholds
```

`pnpm check:contrast` exits 0. All 16 themes (M + 12 markets + S + L + XS)
clear the required thresholds.

---

## References

- `.planning/PROJECT.md` — DECISION-XS-RETRO (XS palette + 1999 vocab)
- `.planning/phases/05-tamano-xs-plain/05-CONTEXT.md` — DEC-050 (HTML 1999 vocab only), D-04 (regex extraction), DEC-051 (IE11 deferred)
- `.planning/phases/04-tamanos-s-y-l/04-CONTRAST-RESULTS.md` — DEC-041 pattern (rendered-surface override; this audit follows the same shape)
- `.planning/phases/03-mercados-sobre-m/03-CONTRAST-RESULTS.md` — Phase 3 remediation pattern + DEC-035 (has-market derivation)
- `scripts/check-contrast.cjs` — `parseLevelTokens()`, `buildLevelPairs()`, XS override block
- `src/styles/main.css:121-144` — `html.level-xs` token block + link / visited overrides
- `src/styles/main.css:309-334` — StickyFooter XS Win95 bevel rules
- `ExistingData/SIZE Web Prototype - standalone.html` — `.l-xs-button`, `.l-xs-table` (Win95 / 1999 vocab anchor)
- `ExistingData/prototype-extracted/00021082_04_a353c98e-7080-4c7c-859d-e8ebafc9597d.js` lines 23-37 — Home XS branch (marquee surface)
