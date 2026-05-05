# Phase 6 — XL WCAG AA contrast audit

Generated: 2026-05-04
Source: `pnpm check:contrast` against `src/styles/main.css` `html.level-xl` block
Script: `scripts/check-contrast.cjs` (extended in Phase 6, Plan 01 — 16 → 17 themes)

---

## Methodology

Same 5-pair contract used for M / S / L / XS, applied per level. Tokens for XL
are read verbatim from `src/styles/main.css` (regex on `html.level-xl { ... }`).
Levels use the **explicit `--muted`** token from the block — they do NOT use
the 55%-ink-on-bg `has-market` derivation.

| Pair | FG | BG | Threshold |
|------|----|----|-----------|
| body text | INK | BG | ≥ 4.5 |
| muted text | MUTED (explicit) | BG | ≥ 4.5 |
| large heading | INK | BG | ≥ 3.0 |
| accent CTA | BG on ACCENT (or per-level override) | ≥ 4.5 |
| accent inline | ACCENT on BG (or per-level override) | ≥ 3.0 |

XL uses the **default contract** with no per-level override. Unlike L
(DEC-041) and XS (DEC-052), the rendered XL surfaces match the default rule
set: dark body, neon-green `--accent` consumed by the global `.bright-cta`
rule and as inline accent text on the dark body.

---

## XL (Unleashed) baseline

Tokens (verbatim from `html.level-xl`, `src/styles/main.css:146-153`):

| token | value | source |
|-------|-------|--------|
| `--bg` | `#050505` | DEC-006 / DECISION-XL-PHASER |
| `--ink` | `#ffffff` | DEC-006 / DECISION-XL-PHASER |
| `--muted` | `#aaaaaa` | DEC-006 / DECISION-XL-PHASER |
| `--accent` | `#00ffaa` | DEC-006 / DECISION-XL-PHASER (neon green) |
| `--accent-2` | `#ff00ff` | DEC-006 / DECISION-XL-PHASER (decorative magenta — see below) |

### 5-pair contract

| pair | composition | ratio | threshold | result |
|------|-------------|------:|-----------|--------|
| body | INK on BG (`#ffffff` on `#050505`) | 20.38:1 | ≥ 4.5 | PASS |
| muted | MUTED on BG (`#aaaaaa` on `#050505`) | 8.77:1 | ≥ 4.5 | PASS |
| large | INK on BG (`#ffffff` on `#050505`) | 20.38:1 | ≥ 3.0 | PASS |
| accent CTA | BG on ACCENT (`#050505` on `#00ffaa`) | 15.42:1 | ≥ 4.5 | PASS |
| accent inline | ACCENT on BG (`#00ffaa` on `#050505`) | 15.42:1 | ≥ 3.0 | PASS |

**5/5 pass.** XL is the easiest level in the catalog — every pair clears its
threshold by a wide margin. No token tweaks required, no per-level overrides
required.

---

## `--accent-2` (#ff00ff) — decorative-only, excluded from the body-pair contract

### Decision (D-06)

`--accent-2` is referenced ONLY inside the `html.level-xl .xl-grad-text` rule
in `src/styles/main.css:161-168`:

```css
html.level-xl .xl-grad-text {
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: xl-grad 6s linear infinite;
}
```

The rule paints the text fill with a horizontal linear gradient that
interpolates `--accent` → `--accent-2` → `--accent`, then clips that gradient
to the text glyphs (`-webkit-background-clip: text` + `color: transparent`).
The `xl-grad` keyframe animates the gradient position back and forth so the
hue at any given pixel is a **moving function of position and time**, never a
single hex value.

A body-pair contrast check on `--accent-2` would be meaningless:

1. **No fixed colour.** At any moment, the rendered text colour at any glyph
   is somewhere on the gradient between `#00ffaa` and `#ff00ff`. The lowest
   contrast against `#050505` along that gradient is `#ff00ff` itself
   (~7.45:1, still PASS) and the highest is `#00ffaa` (15.42:1, PASS) — but
   neither is the "rendered" colour, both are stops.
2. **Decorative-only by spec.** The `xl-grad-text` class is applied only to
   the SIZE wordmark and the `RotatingWord` rotator span on Home XL — both
   large, ornamental, with the dark body still carrying the readable copy
   (`#ffffff` on `#050505` = 20:1) underneath. Functional content (services,
   navigation, CTAs) never uses the gradient class.
3. **Same shape as M's `--accent-2`.** M (Crafted) declares `--accent-2:
   #c9a961` for ornamental purposes too; the M baseline contract has never
   included it. The XL audit follows the same convention.

Captured here for auditability: `--accent-2` is intentionally outside the
WCAG AA body-pair contract because it is a gradient stop, not a body text
colour. If a future XL view binds `--accent-2` to a flat fill on a non-
gradient surface (e.g. a magenta button on dark body — `#ff00ff` on `#050505`
= 7.45:1, would PASS), the contract should be re-evaluated then.

### Why no per-level override is needed

L's CTA and inline pairs were overridden in DEC-041 because L's button is
not the default `.bright-cta` rule. XS's pairs were overridden in DEC-052
because XS uses Win95 bevels + plain blue `<a>` links, not `.bright-cta`,
and ships no inline-red surface.

XL ships **both** rendered surfaces the default contract assumes:

- `.bright-cta` (BG on ACCENT) is reused by XL — `#050505` text on `#00ffaa`
  background, 15.42:1 PASS.
- Inline accent text on the dark body — neon green words inside `<p>` /
  headings, `#00ffaa` on `#050505`, 15.42:1 PASS.

The default 5-pair contract maps cleanly onto XL's actual rendered surfaces.
No override required, no rendered-surface remediation pattern needed (DEC-041
/ DEC-052 / DEC-035 do not extend to XL).

---

## Tweaks applied

| level | token | before | after | reason |
|-------|-------|--------|-------|--------|
| XL | — | — | — | Tokens untouched per DEC-006 / DECISION-XL-PHASER; XL clears 5/5 on the default contract with zero changes |

**Total tokens changed: 0.** DEC-018's >1-token-per-level escalation gate is
not triggered. XL is the only level in the catalog that required neither a
token tweak (Phase 3 markets, multiple) nor a per-level pair override (DEC-041
for L, DEC-052 for XS).

---

## Final state

```
SIZE — XL Unleashed  | WCAG AA contrast check
──────────────────────────────────────────────────────────────────────
Pair                                Ratio   Required  Result
──────────────────────────────────────────────────────────────────────
body text     (INK on BG)           20.38:1 >= 4.5    PASS
muted text    (MUTED on BG)         8.77:1  >= 4.5    PASS
large heading (INK on BG)           20.38:1 >= 3.0    PASS
accent CTA    (BG on ACCENT)        15.42:1 >= 4.5    PASS
accent inline (ACCENT on BG)        15.42:1 >= 3.0    PASS
──────────────────────────────────────────────────────────────────────
SIZE — XL Unleashed | 5 pairs checked | all >= 3.0 (lowest: muted text    (MUTED on BG) = 8.77:1)

OVERALL  17/17 themes pass WCAG AA at the required thresholds
```

`pnpm check:contrast` exits 0. **All 17 themes** (M + 12 markets + S + L +
XS + XL) clear the required thresholds. **The 17-style WCAG AA contrast
contract is closed — the entire SIZE catalog passes.**

---

## References

- `.planning/PROJECT.md` — DEC-006 (XL stack lazy-loaded), DECISION-XL-PHASER (XL ships Phaser 3)
- `.planning/phases/06-tamano-xl-unleashed/06-CONTEXT.md` — D-06 (per-level WCAG AA via `parseLevelTokens('xl')`; `--accent-2` decorative-only)
- `.planning/phases/05-tamano-xs-plain/05-CONTRAST-RESULTS.md` — DEC-052 pattern (rendered-surface override; XL does NOT need this — default contract suffices)
- `.planning/phases/04-tamanos-s-y-l/04-CONTRAST-RESULTS.md` — DEC-041 pattern (rendered-surface override; XL does NOT need this either)
- `.planning/phases/03-mercados-sobre-m/03-CONTRAST-RESULTS.md` — Phase 3 token-tweak remediation (not invoked here — zero tweaks)
- `scripts/check-contrast.cjs` — `parseLevelTokens()`, `buildLevelPairs()`, XL block (added in Plan 06-01)
- `src/styles/main.css:146-153` — `html.level-xl` token block (5 colour tokens)
- `src/styles/main.css:161-168` — `html.level-xl .xl-grad-text` rule (`--accent-2` consumer)
- `src/styles/main.css:156-159` — `@keyframes xl-grad` (gradient animation driver)
- `ExistingData/prototype-extracted/00021082_04_*.js` lines 62-76 — Home XL branch (where `xl-grad-text` is applied)
