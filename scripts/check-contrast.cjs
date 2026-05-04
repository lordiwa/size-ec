/**
 * scripts/check-contrast.cjs
 *
 * WCAG 2.1 AA contrast checker for the SIZE M (Crafted) dark-mode baseline.
 *
 * Source of token values: src/styles/main.css — html.level-m block.
 * Phase 3 can extend this file by adding an entry to THEMES below.
 *
 * Pure Node — no third-party dependencies.
 *
 * Usage:
 *   node scripts/check-contrast.cjs     # or pnpm check:contrast
 *
 * Exit 0 if all required pairs meet their thresholds; non-zero otherwise.
 */

'use strict';

// ─── M (Crafted) dark-mode token table ───────────────────────────────────────
// Values are hard-coded from html.level-m in src/styles/main.css.
// For 8-digit hex tokens (RRGGBBAA) we alpha-blend the foreground over the
// background before computing luminance, because what the user actually sees
// is the composited colour, not the raw channel value.
// The formula is:  effective = alpha * fg_channel + (1 - alpha) * bg_channel
// We emit a note for every pair that involves an alpha-blended channel so the
// intent is auditable.

const M_TOKENS = {
  BG:          '#0a0a0a',  // background surface
  INK:         '#f5f5f5',  // primary text
  MUTED:       '#8a8a85',  // secondary / muted text (still copy, ≥ 4.5 required)
  LINE:        '#ffffff14', // separator — 8-digit hex (alpha 0x14 / 255 ≈ 0.078)
  LINE_STRONG: '#ffffff33', // stronger separator — 8-digit hex (alpha 0x33 / 255 ≈ 0.2)
  ACCENT:      '#ff3b1f',  // primary accent / CTA background
};

// ─── Required contrast pairs ──────────────────────────────────────────────────
// Format: { label, fg, bg, threshold, note }
// threshold: minimum contrast ratio (≥ value to PASS)

const PAIRS = [
  {
    label:     'body text     (INK on BG)',
    fg:        M_TOKENS.INK,
    bg:        M_TOKENS.BG,
    threshold: 4.5,
    note:      'WCAG AA normal text',
  },
  {
    label:     'muted text    (MUTED on BG)',
    fg:        M_TOKENS.MUTED,
    bg:        M_TOKENS.BG,
    threshold: 4.5,
    note:      'Muted is still readable copy — same threshold as body',
  },
  {
    label:     'large heading (INK on BG)',
    fg:        M_TOKENS.INK,
    bg:        M_TOKENS.BG,
    threshold: 3.0,
    note:      'WCAG AA large text (≥ 18pt / 14pt bold)',
  },
  {
    label:     'accent CTA    (BG on ACCENT)',
    fg:        M_TOKENS.BG,
    bg:        M_TOKENS.ACCENT,
    threshold: 4.5,
    note:      '.bright-cta uses var(--bg) text on var(--accent) background',
  },
  {
    label:     'accent inline (ACCENT on BG)',
    fg:        M_TOKENS.ACCENT,
    bg:        M_TOKENS.BG,
    threshold: 3.0,
    note:      'Accent words in body copy at large sizes',
  },
];

// ─── WCAG 2.1 helper functions ────────────────────────────────────────────────

/**
 * Parse a hex colour string into { r, g, b, a } in the range [0, 1].
 * Accepts 3-, 6-, or 8-digit hex (with or without leading #).
 * 8-digit format: RRGGBBAA — the last two nibbles are the alpha channel.
 */
function parseHex(hex) {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16) / 255,
      g: parseInt(h[1] + h[1], 16) / 255,
      b: parseInt(h[2] + h[2], 16) / 255,
      a: 1,
    };
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  if (h.length === 8) {
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: parseInt(h.slice(6, 8), 16) / 255,
    };
  }
  throw new Error(`Unrecognised hex colour: "${hex}"`);
}

/**
 * Alpha-blend a foreground colour over a background colour (Porter-Duff
 * "source over" composite).  Returns an opaque { r, g, b } in [0, 1].
 *
 * effective = alpha * fg + (1 - alpha) * bg
 *
 * This is what the user actually sees on screen when a semi-transparent
 * foreground is composited over a solid background.
 */
function alphaBlend(fg, bg) {
  const a = fg.a;
  return {
    r: a * fg.r + (1 - a) * bg.r,
    g: a * fg.g + (1 - a) * bg.g,
    b: a * fg.b + (1 - a) * bg.b,
  };
}

/**
 * Convert a single sRGB channel value (in [0, 1]) to linear light.
 * WCAG 2.1 formula (IEC 61966-2-1).
 */
function toLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Compute relative luminance of an { r, g, b } colour (channels in [0, 1]).
 * L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
 */
function luminance({ r, g, b }) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Compute the WCAG 2.1 contrast ratio between two relative luminances.
 * ratio = (L_lighter + 0.05) / (L_darker + 0.05)
 */
function contrastRatio(L1, L2) {
  const lighter = Math.max(L1, L2);
  const darker  = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Compute contrast ratio between two hex colours, handling alpha-blending.
 * @param {string} fgHex  foreground hex (6- or 8-digit)
 * @param {string} bgHex  background hex (must be opaque / 6-digit)
 * @returns {{ ratio: number, alphaNote: string|null }}
 */
function checkPair(fgHex, bgHex) {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);

  let effective = { r: fg.r, g: fg.g, b: fg.b };
  let alphaNote = null;

  if (fg.a < 1) {
    // Alpha-blend the foreground over the background so we measure the
    // composited colour that users actually perceive on screen.
    effective = alphaBlend(fg, bg);
    alphaNote =
      `(alpha ${fg.a.toFixed(3)} — effective colour after blending over BG: ` +
      `rgb(${Math.round(effective.r * 255)},${Math.round(effective.g * 255)},${Math.round(effective.b * 255)}))`;
  }

  const Lfg = luminance(effective);
  const Lbg = luminance(bg);
  const ratio = contrastRatio(Lfg, Lbg);
  return { ratio, alphaNote };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let allPass = true;
let lowestRatio = Infinity;
let lowestLabel = '';

const COL_LABEL = 36;
const COL_RATIO = 8;

console.log('');
console.log('SIZE — M Crafted dark-mode | WCAG AA contrast check');
console.log('─'.repeat(70));
console.log(
  padRight('Pair', COL_LABEL) +
  padRight('Ratio', COL_RATIO) +
  padRight('Required', 10) +
  'Result'
);
console.log('─'.repeat(70));

const results = [];

for (const pair of PAIRS) {
  const { ratio, alphaNote } = checkPair(pair.fg, pair.bg);
  const pass = ratio >= pair.threshold;
  const status = pass ? 'PASS' : 'FAIL';

  if (!pass) allPass = false;
  if (ratio < lowestRatio) {
    lowestRatio = ratio;
    lowestLabel = pair.label.trim();
  }

  results.push({ ...pair, ratio, pass, alphaNote });

  console.log(
    padRight(pair.label, COL_LABEL) +
    padRight(ratio.toFixed(2) + ':1', COL_RATIO) +
    padRight('>= ' + pair.threshold.toFixed(1), 10) +
    status
  );

  if (alphaNote) {
    console.log('  ' + alphaNote);
  }
}

console.log('─'.repeat(70));
console.log('');

// ─── Summary line ─────────────────────────────────────────────────────────────
const pairsChecked = PAIRS.length;
const lowestFormatted = lowestRatio.toFixed(2);
const summaryPart = allPass
  ? `all >= ${Math.min(...PAIRS.map(p => p.threshold)).toFixed(1)} (lowest: ${lowestLabel.replace(/\s+/g, ' ')} = ${lowestFormatted}:1)`
  : `FAILING — see details above`;

console.log(
  `M Crafted dark-mode | ${pairsChecked} pairs checked | ${summaryPart}`
);
console.log('');

if (!allPass) {
  const failing = results.filter(r => !r.pass);
  const names = failing.map(r => `"${r.label.trim()}" (${r.ratio.toFixed(2)}:1 < ${r.threshold})`).join(', ');
  console.error(`WCAG AA check FAILED — failing pair(s): ${names}`);
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function padRight(str, width) {
  return String(str).padEnd(width, ' ');
}
