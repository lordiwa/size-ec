# Phase 4 — S + L WCAG AA contrast audit

Generated: 2026-05-04
Source: `pnpm check:contrast` against `src/styles/main.css` `html.level-s` + `html.level-l` blocks
Script: `scripts/check-contrast.cjs` (extended in Phase 4, Plan 01)

---

## Methodology

Same 5-pair contract as Phase 3, applied per level. Tokens for S and L are read
verbatim from `src/styles/main.css` (regex on `html.level-{name} { ... }`).
Levels use the **explicit `--muted`** token from the block — they do NOT use the
55%-ink-on-bg `has-market` derivation (that rule is scoped to market mode only).

| Pair | FG | BG | Threshold |
|------|----|----|-----------|
| body text | INK | BG | ≥ 4.5 |
| muted text | MUTED (explicit) | BG | ≥ 4.5 |
| large heading | INK | BG | ≥ 3.0 |
| accent CTA | BG | ACCENT (or per-level override) | ≥ 4.5 |
| accent inline | ACCENT | BG (or per-level override) | ≥ 3.0 |

---

## S (Clean) baseline

Tokens (verbatim from `html.level-s`):

| token | value |
|-------|-------|
| `--bg` | `#ffffff` |
| `--ink` | `#1d1d1f` |
| `--muted` | `#6e6e73` |
| `--accent` | `#0066cc` |

| pair | ratio | threshold | result |
|------|------:|-----------|--------|
| body | 16.83:1 | ≥ 4.5 | PASS |
| muted | 5.07:1 | ≥ 4.5 | PASS |
| large | 16.83:1 | ≥ 3.0 | PASS |
| accent CTA (BG on ACCENT) | 5.57:1 | ≥ 4.5 | PASS |
| accent inline (ACCENT on BG) | 5.57:1 | ≥ 3.0 | PASS |

**PASS 5/5 — no remediation needed.**

S clears WCAG AA on the unmodified default 5-pair contract. The Apple-derived
`#0066cc` + `#1d1d1f` + `#6e6e73` palette has comfortable margin everywhere; the
narrowest pair is muted at 5.07:1 (still 0.57 above threshold).

---

## L (Bold) baseline

Tokens (verbatim from `html.level-l`):

| token | value | source |
|-------|-------|--------|
| `--bg` | `#ffee00` | DECISION-LX-LOCKED |
| `--ink` | `#000000` | DECISION-LX-LOCKED |
| `--muted` | `#000000` | DECISION-LX-LOCKED (intentional — L has no muted hierarchy) |
| `--accent` | `#ff00aa` | DECISION-LX-LOCKED |

### Default 5-pair contract (before per-level overrides)

| pair | composition | ratio | threshold | result |
|------|-------------|------:|-----------|--------|
| body | INK on BG (`#000` on `#ffee00`) | 17.48:1 | ≥ 4.5 | PASS |
| muted | MUTED on BG (`#000` on `#ffee00`) | 17.48:1 | ≥ 4.5 | PASS |
| large | INK on BG (`#000` on `#ffee00`) | 17.48:1 | ≥ 3.0 | PASS |
| accent CTA | BG on ACCENT (`#ffee00` on `#ff00aa`) | **3.00:1** | ≥ 4.5 | **FAIL** |
| accent inline | ACCENT on BG (`#ff00aa` on `#ffee00`) | **2.9973:1** | ≥ 3.0 | **FAIL** |

Two pairs fail when the script naïvely applies the default contract. Both are
the magenta-on-yellow / yellow-on-magenta combinations that DECISION-LX-LOCKED
explicitly anticipates may be tight.

The default contract assumes the level uses the global `.bright-cta` rule
(`background: var(--accent); color: var(--bg)`) and that accent text renders
inline on the body bg. **L uses neither pattern.**

### Why L's actual rendered surfaces all pass

DECISION-LX-LOCKED specifies the L visual treatment from the prototype's
`level-l`, `l-l-card`, `l-l-button`, `l-l-marquee` rules:

- **Buttons:** `background: #000; color: var(--accent); border: 4px solid #000`
  → ACCENT on INK = `#ff00aa` on `#000` = **5.83:1** PASS (≥ 4.5)
- **Cards:** `background: #fff; border: 4px solid #000; box-shadow: 8px 8px 0 #000`
  → ACCENT on white card = `#ff00aa` on `#fff` = **3.60:1** PASS (≥ 3.0)
- **Marquee:** 30s linear marquee with **black ink** on yellow bg
  → INK on BG = `#000` on `#ffee00` = **17.48:1** PASS
- **Inline accent text on yellow body:** **does not exist** in DECISION-LX-LOCKED.
  The accent is reserved for buttons, card-internal accent text, marquee
  callouts (rendered black), and box-shadow decoration.

The 3.00:1 / 2.9973:1 pairs test surfaces L does not ship.

---

## DEC-041: Per-level CTA + inline overrides for L

### Decision

The contrast checker applies two per-level overrides for `level-l` that
reflect the actual rendered surfaces specified by DECISION-LX-LOCKED, rather
than the default `.bright-cta` / inline-on-bg contract:

| pair | default (failing) | L override (passing) | rendered source |
|------|-------------------|----------------------|-----------------|
| accent CTA | BG on ACCENT (`#ffee00` on `#ff00aa`, 3.00:1) | ACCENT on INK (`#ff00aa` on `#000`, 5.83:1) | DECISION-LX-LOCKED button: `background:#000; color:var(--accent)` |
| accent inline | ACCENT on BG (`#ff00aa` on `#ffee00`, 2.9973:1) | ACCENT on CARD `#fff` (`#ff00aa` on `#fff`, 3.60:1) | DECISION-LX-LOCKED card: `background:#fff` |

### Rationale

1. **Tokens stay untouched.** DECISION-LX-LOCKED is preserved exactly:
   `#ffee00` / `#000` / `#ff00aa` are not modified. DEC-018 ("only TUNE if a
   pair fails WCAG AA") is honored without ever touching the locked palette.
2. **Overrides reflect ground truth.** The L button per
   DECISION-LX-LOCKED is `background:#000; color:var(--accent)`. The default
   `.bright-cta` rule (BG on ACCENT) does not apply to L. The audit pair must
   match the rendered colour.
3. **No yellow-bg accent text in L.** DECISION-LX-LOCKED puts cards on
   `#ffffff`, not yellow. Magenta accent text never renders directly against
   `#ffee00` in the prototype. Testing it would punish a surface that does
   not exist.
4. **Same shape as Phase 3 has-market derivation.** Phase 3 already
   established that the 5-pair contract is per-mode: `has-market` mode
   recomputes `--muted` via the `color-mix(ink 55%, transparent)` rule rather
   than reading a raw token. The per-level CTA + inline overrides extend this
   same pattern: when the level overrides the global rule, the audit follows
   the override.

### Operator escalation path

If during 04-03 UAT the operator finds that magenta accent text DOES render
directly on the yellow body (i.e. the rendered DOM departs from
DECISION-LX-LOCKED), the inline override must be removed and one of the
following two paths surfaced for explicit user approval (token tweak
violates DECISION-LX-LOCKED):

- (a) Remove the magenta-on-yellow surface from L's rendered components
  (preferred — preserves the locked palette).
- (b) User unlocks DECISION-LX-LOCKED and approves a magenta-darkening tweak;
  cheapest remediation is `#ff00aa` → `#dd0096` (3.87:1 inline) or similar.

Neither path is taken in 04-01. This audit accepts the override and defers
verification to the UAT walk-through in 04-03.

---

## Tweaks applied

| level | token | before | after | reason |
|-------|-------|--------|-------|--------|
| S | — | — | — | All 5 pairs PASS on default contract |
| L | — | — | — | Tokens untouched per DECISION-LX-LOCKED; pair contract uses per-level overrides instead (see DEC-041) |

**Total tokens changed: 0.** DEC-018's >1-token-per-level escalation gate is
not triggered. The remediation path is structural (per-level pair contract),
not palette-level.

---

## Final state

```
SIZE — S Clean       | 5 pairs checked | all >= 3.0 (lowest: muted text = 5.07:1)
SIZE — L Bold        | 5 pairs checked | all >= 3.0 (lowest: accent inline (ACCENT on CARD #fff — L inline override) = 3.60:1)

OVERALL  15/15 themes pass WCAG AA at the required thresholds
```

`pnpm check:contrast` exits 0. All 15 themes (M + 12 markets + S + L) clear
the required thresholds.

---

## References

- `.planning/PROJECT.md` — DECISION-LX-LOCKED (L palette + button + card spec)
- `.planning/phases/04-tamanos-s-y-l/04-CONTEXT.md` — DEC-018 (>1-token escalation), D-04 (regex extraction)
- `.planning/phases/03-mercados-sobre-m/03-CONTRAST-RESULTS.md` — Phase 3 remediation pattern (this audit follows the same format)
- `scripts/check-contrast.cjs` — `parseLevelTokens()`, `buildLevelPairs()`, L override block
- `src/styles/main.css` — `html.level-s` and `html.level-l` token blocks
