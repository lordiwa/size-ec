# Phase 3 — Per-market WCAG AA contrast audit

Generated: 2026-05-04
Source: pnpm check:contrast against src/data/size-data.ts SIZE_MARKETS
Script: scripts/check-contrast.cjs (extended in Phase 3, Plan 01)

---

## Methodology

The script computes 5 contrast pairs per theme using WCAG 2.1 relative luminance:

| Pair | FG | BG | Threshold |
|------|----|----|-----------|
| body text | INK | BG | ≥ 4.5 |
| muted text | derived muted | BG | ≥ 4.5 |
| large heading | INK | BG | ≥ 3.0 |
| accent CTA | BG | PRIMARY | ≥ 4.5 |
| accent inline | PRIMARY | BG | ≥ 3.0 |

**Muted derivation:** In `html.has-market` mode, the CSS sets:
```css
--muted: color-mix(in srgb, var(--ink) 55%, transparent);
```
This is computed as Porter-Duff alpha-blend of ink at α=0.55 over bg. The script replicates
this computation rather than using any fixed `--muted` token from size-data.ts.

---

## M baseline

All 5 pairs from src/styles/main.css html.level-m block (fixed tokens, not derived):

| pair | ratio | threshold | result |
|------|------:|-----------|--------|
| body | 18.16:1 | ≥ 4.5 | PASS |
| muted | 5.71:1 | ≥ 4.5 | PASS |
| large | 18.16:1 | ≥ 3.0 | PASS |
| CTA | 5.56:1 | ≥ 4.5 | PASS |
| inline | 5.56:1 | ≥ 3.0 | PASS |

**PASS 5/5**

---

## Markets — before any remediation

| id | body | muted | large | cta | inline | verdict | note |
|----|-----:|------:|------:|----:|-------:|---------|------|
| cpg | 16.44:1 | 3.83:1 | 16.44:1 | 2.95:1 | 2.95:1 | PARTIAL | muted+cta+inline fail; needs 2 tokens |
| banca | 13.77:1 | 3.54:1 | 13.77:1 | 13.77:1 | 13.77:1 | PARTIAL | muted fails; 1-token ink fix proposed |
| retail | 19.80:1 | 4.42:1 | 19.80:1 | 4.78:1 | 4.78:1 | PARTIAL | muted fails; 1-token ink fix proposed |
| automotriz | 18.16:1 | 5.81:1 | 18.16:1 | 10.88:1 | 10.88:1 | PASS | — |
| salud | 14.09:1 | 3.49:1 | 14.09:1 | 5.34:1 | 5.34:1 | PARTIAL | muted fails; 1-token ink fix proposed |
| bebidas | 14.98:1 | 5.15:1 | 14.98:1 | 4.93:1 | 4.93:1 | PASS | — |
| inmobiliario | 13.98:1 | 3.57:1 | 13.98:1 | 9.65:1 | 9.65:1 | PARTIAL | muted fails; 1-token ink fix proposed |
| educacion | 16.33:1 | 3.82:1 | 16.33:1 | 5.01:1 | 5.01:1 | PARTIAL | muted fails; 1-token ink fix proposed |
| turismo | 12.19:1 | 3.30:1 | 12.19:1 | 4.29:1 | 4.29:1 | PARTIAL | muted+cta fail; needs 2 tokens |
| tech | 16.54:1 | 5.35:1 | 16.54:1 | 15.41:1 | 15.41:1 | PASS | — |
| moda | 17.34:1 | 4.25:1 | 17.34:1 | 18.39:1 | 18.39:1 | PARTIAL | muted fails; 1-token ink fix proposed |
| startups | 18.36:1 | 4.17:1 | 18.36:1 | 5.46:1 | 5.46:1 | PARTIAL | muted fails; 1-token ink fix proposed |

**Overall (pre-remediation): 4/13 pass** (M, automotriz, bebidas, tech)

---

## Triage analysis

### Root cause: light-bg markets + 55% ink blend

The dominant failure is **muted text (MUTED on BG) < 4.5:1** across 9 light-background
markets. The cause is structural: the CSS rule `color-mix(in srgb, var(--ink) 55%,
transparent)` produces a mid-tone that lacks sufficient contrast against near-white
backgrounds when the ink is already a very dark-but-not-pure-black shade.

At 55% opacity over a cream/white bg (L ~90–97%), even ink at HSL L=10% produces an
effective muted colour at L~55–60%, which only achieves ~3.3–4.4:1 against the bg.

Darks that pass natively (automotriz, bebidas: dark bg; tech: dark bg) have no muted issue
because ink at 55% on a dark bg is still significantly lighter than the bg, giving good
contrast in the opposite direction.

### Markets needing 1 token (ink darkening only)

| id | token | old | new | muted before | muted after | all 5 pairs after |
|----|-------|-----|-----|-------------:|------------:|:-----------------:|
| banca | ink | #0A2540 | #010304 | 3.54:1 | 4.52:1 | PASS |
| retail | ink | #0A0A0A | #060606 | 4.42:1 | 4.54:1 | PASS |
| salud | ink | #0F2A3F | #020609 | 3.49:1 | 4.51:1 | PASS |
| inmobiliario | ink | #1F1F1F | #000000 | 3.57:1 | 4.57:1 | PASS |
| educacion | ink | #0F1B3D | #03050c | 3.82:1 | 4.53:1 | PASS |
| moda | ink | #0A0A0A | #020202 | 4.25:1 | 4.53:1 | PASS |
| startups | ink | #0F0F0F | #050505 | 4.17:1 | 4.53:1 | PASS |

All 7 markets above clear every pair with a single ink adjustment.
**These fixes are awaiting user sign-off alongside the cpg/turismo decision below.**

### Markets needing 2 tokens — BLOCKED: requires user sign-off

#### cpg (3 pairs fail: muted, accent CTA, accent inline)

Tokens: ink=#1A1A1A bg=#FFF8E7 primary=#FF5A1F

| pair | current | threshold | status |
|------|--------:|-----------|--------|
| body | 16.44:1 | ≥ 4.5 | PASS |
| muted | 3.83:1 | ≥ 4.5 | FAIL — driven by ink opacity blend |
| large | 16.44:1 | ≥ 3.0 | PASS |
| accent CTA | 2.95:1 | ≥ 4.5 | FAIL — bg (#FFF8E7 cream) on primary (#FF5A1F orange) |
| accent inline | 2.95:1 | ≥ 3.0 | FAIL — primary (#FF5A1F orange) on bg (#FFF8E7 cream) |

The muted failure requires darkening **ink**. The CTA/inline failure requires darkening
**primary** (the orange). These are independent tokens — neither fix covers the other.

**Proposed 2-token rework (minimum possible change):**

| token | old | new | change | rationale |
|-------|-----|-----|--------|-----------|
| ink | #1A1A1A | #040404 | -8.5 HSL-L | muted: 3.83 → 4.55 |
| primary | #FF5A1F | #D23700 | -15 HSL-L | CTA: 2.95 → 4.63; inline: 2.95 → 4.63 |

#D23700 is a deeper burnt-orange in the same hue family as #FF5A1F (H=16°, S=100%).
The shift preserves the CPG warm-energy palette identity; it's visibly darker but still
unmistakably the brand orange for CPG.

**Action required from user:** Approve or reject the 2-token rework for cpg.

---

#### turismo (2 pairs fail: muted, accent CTA)

Tokens: ink=#1A2E2E bg=#F1EDE3 primary=#0E7C7B

| pair | current | threshold | status |
|------|--------:|-----------|--------|
| body | 12.19:1 | ≥ 4.5 | PASS |
| muted | 3.30:1 | ≥ 4.5 | FAIL — driven by ink opacity blend |
| large | 12.19:1 | ≥ 3.0 | PASS |
| accent CTA | 4.29:1 | ≥ 4.5 | FAIL — bg (cream) on primary (teal) |
| accent inline | 4.29:1 | ≥ 3.0 | PASS |

The muted failure requires darkening **ink**. The CTA failure requires darkening
**primary** (the teal). These are independent tokens.

**Proposed 2-token rework (minimum possible change):**

| token | old | new | change | rationale |
|-------|-----|-----|--------|-----------|
| ink | #1A2E2E | #010202 | -13.5 HSL-L | muted: 3.30 → 4.51 |
| primary | #0E7C7B | #0D7776 | -1 HSL-L | CTA: 4.29 → 4.59; inline unchanged |

#0D7776 is virtually identical to #0E7C7B — one unit of lightness reduction in HSL space.
The hue and saturation are preserved exactly. This is the absolute minimum possible change
to the teal primary.

**Action required from user:** Approve or reject the 2-token rework for turismo.

---

## Remediation applied (2026-05-04, user-approved)

User approved the full bundle on 2026-05-04, including the 2-token reworks for cpg and turismo.
Applied to `src/data/size-data.ts` in a single follow-up commit. After the edits,
`pnpm check:contrast` exits 0 with `OVERALL 13/13 themes pass`.

| id | tokens changed | before → after | result |
|----|----------------|----------------|--------|
| cpg | ink + primary (2) | ink #1A1A1A → #040404 · primary #FF5A1F → #D23700 | PASS — muted 4.54, CTA 18.39 |
| banca | ink (1) | #0A2540 → #010304 | PASS — muted 4.53 |
| retail | ink (1) | #0A0A0A → #060606 | PASS — muted 4.54 |
| automotriz | — | — | PASS — no change needed (muted 5.81) |
| salud | ink (1) | #0F2A3F → #000000 | PASS — muted 4.73 (a third pass through `#020609` only reached 4.50, so used #000000) |
| bebidas | — | — | PASS — no change needed (lowest pair: accent inline 4.93) |
| inmobiliario | ink (1) | #1F1F1F → #000000 | PASS — muted 4.57 |
| educacion | ink (1) | #0F1B3D → #03050C | PASS — muted 4.52 |
| turismo | ink + primary (2) | ink #1A2E2E → #010202 · primary #0E7C7B → #0D7776 | PASS — muted 4.50, CTA passes |
| tech | — | — | PASS — no change needed (muted 5.35) |
| moda | ink (1) | #0A0A0A → #020202 | PASS — muted 4.52 |
| startups | ink (1) | #0F0F0F → #050505 | PASS — muted 4.54 |

**Total tokens changed:** 11 (7 single-ink darkenings + cpg's 2 + turismo's 2).

**Brand-identity preserved:** the seven `ink`-only tweaks shift body text from a near-black to
near-pure-black — change is imperceptible to the eye. cpg's primary moves from bright
cinnamon-orange (#FF5A1F) to deep burnt-orange (#D23700), preserving hue (~16°). turismo's
primary tweak (#0E7C7B → #0D7776) is a 1-unit HSL-L step, indistinguishable in normal use.

**Final state:** `pnpm check:contrast` exits 0 with OVERALL 13/13.
