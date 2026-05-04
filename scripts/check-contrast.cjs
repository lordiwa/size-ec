/**
 * scripts/check-contrast.cjs
 *
 * WCAG 2.1 AA contrast checker for the SIZE M (Crafted) dark-mode baseline
 * PLUS all 12 market themes.
 *
 * Sources:
 *   M baseline  — hard-coded from src/styles/main.css  html.level-m block
 *   12 markets  — parsed from src/data/size-data.ts  SIZE_MARKETS array
 *
 * Pure Node — no third-party dependencies.
 *
 * Usage:
 *   node scripts/check-contrast.cjs               # M + 12 markets
 *   node scripts/check-contrast.cjs --markets-only # skip M block
 *   pnpm check:contrast
 *
 * Exit 0 if all required pairs in every theme meet their thresholds; non-zero otherwise.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── CLI flags ────────────────────────────────────────────────────────────────
const MARKETS_ONLY = process.argv.includes('--markets-only');

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
  MUTED:       '#8a8a85',  // secondary / muted text (still copy, >= 4.5 required)
  LINE:        '#ffffff14', // separator — 8-digit hex (alpha 0x14 / 255 ≈ 0.078)
  LINE_STRONG: '#ffffff33', // stronger separator — 8-digit hex (alpha 0x33 / 255 ≈ 0.2)
  ACCENT:      '#ff3b1f',  // primary accent / CTA background
};

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function padRight(str, width) {
  return String(str).padEnd(width, ' ');
}

// ─── Build 5-pair contract from a generic token bag ──────────────────────────

/**
 * Build the 5 required contrast pairs for a theme.
 *
 * For market themes the muted colour is NOT a fixed token in size-data.ts.
 * Instead, the global App.vue rule `html.has-market` resets --muted by
 * blending ink at 55% opacity over bg:
 *
 *   --muted: color-mix(in srgb, var(--ink) 55%, transparent)
 *
 * Because `color-mix(..., transparent)` reduces to alpha-blending:
 *   muted_effective = 0.55 * ink + 0.45 * bg   (Porter-Duff source-over)
 *
 * We must compute this derived value here rather than reading a raw --muted
 * token, otherwise markets whose ink/bg differ from M's would use the wrong
 * muted value and the audit would be misleading.
 *
 * @param {{ BG: string, INK: string, ACCENT: string }} tokens
 */
function buildPairs(tokens) {
  const { BG, INK, ACCENT } = tokens;

  // Derive muted: color-mix(in srgb, ink 55%, transparent) over bg
  // == alpha-blend with a = 0.55
  const inkParsed = parseHex(INK);
  const bgParsed  = parseHex(BG);
  const mutedRGB  = alphaBlend({ ...inkParsed, a: 0.55 }, bgParsed);
  const mutedHex  =
    '#' +
    [mutedRGB.r, mutedRGB.g, mutedRGB.b]
      .map(c => Math.round(c * 255).toString(16).padStart(2, '0'))
      .join('');

  return [
    {
      label:     'body text     (INK on BG)',
      fg:        INK,
      bg:        BG,
      threshold: 4.5,
      note:      'WCAG AA normal text',
    },
    {
      label:     'muted text    (MUTED on BG)',
      fg:        mutedHex,
      bg:        BG,
      threshold: 4.5,
      note:      'Muted derived via color-mix(ink 55%, transparent) — same threshold as body',
    },
    {
      label:     'large heading (INK on BG)',
      fg:        INK,
      bg:        BG,
      threshold: 3.0,
      note:      'WCAG AA large text (>= 18pt / 14pt bold)',
    },
    {
      label:     'accent CTA    (BG on ACCENT)',
      fg:        BG,
      bg:        ACCENT,
      threshold: 4.5,
      note:      '.bright-cta uses var(--bg) text on var(--accent) background',
    },
    {
      label:     'accent inline (ACCENT on BG)',
      fg:        ACCENT,
      bg:        BG,
      threshold: 3.0,
      note:      'Accent words in body copy at large sizes',
    },
  ];
}

// ─── Print one theme block ────────────────────────────────────────────────────

const COL_LABEL = 36;
const COL_RATIO = 8;

/**
 * Run and print the 5-pair contract for a named theme.
 * Returns { passCount, failCount, results }.
 */
function runTheme(title, tokens) {
  const pairs = buildPairs(tokens);

  console.log('');
  console.log(`${title}`);
  console.log('─'.repeat(70));
  console.log(
    padRight('Pair', COL_LABEL) +
    padRight('Ratio', COL_RATIO) +
    padRight('Required', 10) +
    'Result'
  );
  console.log('─'.repeat(70));

  let passCount = 0;
  let failCount = 0;
  const results = [];

  for (const pair of pairs) {
    const { ratio, alphaNote } = checkPair(pair.fg, pair.bg);
    const pass = ratio >= pair.threshold;
    if (pass) passCount++; else failCount++;

    results.push({ ...pair, ratio, pass, alphaNote });

    console.log(
      padRight(pair.label, COL_LABEL) +
      padRight(ratio.toFixed(2) + ':1', COL_RATIO) +
      padRight('>= ' + pair.threshold.toFixed(1), 10) +
      (pass ? 'PASS' : 'FAIL')
    );

    if (alphaNote) {
      console.log('  ' + alphaNote);
    }
  }

  console.log('─'.repeat(70));

  const lowestResult  = results.reduce((a, b) => a.ratio < b.ratio ? a : b);
  const lowestFormatted = lowestResult.ratio.toFixed(2);

  if (failCount === 0) {
    console.log(
      `${title.split('|')[0].trim()} | ${pairs.length} pairs checked | ` +
      `all >= ${Math.min(...pairs.map(p => p.threshold)).toFixed(1)} ` +
      `(lowest: ${lowestResult.label.trim()} = ${lowestFormatted}:1)`
    );
  } else {
    const failing = results.filter(r => !r.pass);
    const names = failing.map(r => `"${r.label.trim()}" (${r.ratio.toFixed(2)}:1 < ${r.threshold})`).join(', ');
    console.log(`${title.split('|')[0].trim()} | FAILING — ${names}`);
  }

  return { passCount, failCount, results };
}

// ─── Parse market themes from src/data/size-data.ts ──────────────────────────

/**
 * Extract SIZE_MARKETS entries from the TypeScript source file using text
 * regex.  We deliberately avoid compiling or requiring the TS file because
 * this script must remain pure Node with no third-party deps.
 *
 * The regex targets the `theme` sub-object inside each market object literal.
 * It captures id, primary, secondary, bg, and ink — the five values we need
 * for the 5-pair contract.
 *
 * Returns an array of { id, primary, secondary, bg, ink } objects.
 * Aborts with a clear message if the count is not exactly 12.
 */
function parseMarkets() {
  const dataPath = path.resolve(__dirname, '../src/data/size-data.ts');
  let src;
  try {
    src = fs.readFileSync(dataPath, 'utf8');
  } catch (e) {
    console.error(`ERROR: Cannot read ${dataPath}: ${e.message}`);
    process.exit(1);
  }

  // Match each market object block: from { id: '...' up to services: [...] }
  // We use a non-greedy match on the whole object.
  // Pattern: id:'cpg', n:'01', ..., theme:{ primary:'#...', secondary:'#...', bg:'#...', ink:'#...', ... }
  const marketBlockRe = /\{\s*id:\s*'([^']+)'[\s\S]*?theme:\s*\{([^}]+)\}/g;
  const hexFieldRe = (field) => new RegExp(`${field}:\\s*'(#[0-9A-Fa-f]{3,8})'`);

  const markets = [];
  let m;
  while ((m = marketBlockRe.exec(src)) !== null) {
    const id         = m[1];
    const themeBlock = m[2];

    const get = (field) => {
      const match = hexFieldRe(field).exec(themeBlock);
      if (!match) {
        console.error(`ERROR: Cannot find '${field}' in theme block for market '${id}'`);
        process.exit(1);
      }
      return match[1];
    };

    markets.push({
      id,
      primary:   get('primary'),
      secondary: get('secondary'),
      bg:        get('bg'),
      ink:       get('ink'),
    });
  }

  if (markets.length !== 12) {
    console.error(
      `ERROR: Expected exactly 12 market entries in SIZE_MARKETS; ` +
      `found ${markets.length}. Check src/data/size-data.ts.`
    );
    process.exit(1);
  }

  return markets;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const markets = parseMarkets();

// Track per-theme pass/fail for the OVERALL line
const themeResults = [];

// ── M baseline block (skipped with --markets-only) ────────────────────────────
if (!MARKETS_ONLY) {
  // M uses a fixed MUTED token rather than the derived color-mix rule.
  // In html.level-m the global has-market rule does NOT apply because the
  // user is in level mode, not market mode — so we measure the literal MUTED
  // token from main.css, not the 55%-blend.
  const mPairs = [
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
      note:      'WCAG AA large text (>= 18pt / 14pt bold)',
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

  let mAllPass = true;
  let mLowest = Infinity;
  let mLowestLabel = '';
  const mResults = [];

  for (const pair of mPairs) {
    const { ratio, alphaNote } = checkPair(pair.fg, pair.bg);
    const pass = ratio >= pair.threshold;
    if (!pass) mAllPass = false;
    if (ratio < mLowest) { mLowest = ratio; mLowestLabel = pair.label.trim(); }
    mResults.push({ ...pair, ratio, pass, alphaNote });

    console.log(
      padRight(pair.label, COL_LABEL) +
      padRight(ratio.toFixed(2) + ':1', COL_RATIO) +
      padRight('>= ' + pair.threshold.toFixed(1), 10) +
      (pass ? 'PASS' : 'FAIL')
    );
    if (alphaNote) console.log('  ' + alphaNote);
  }

  console.log('─'.repeat(70));
  console.log('');

  const summaryPart = mAllPass
    ? `all >= ${Math.min(...mPairs.map(p => p.threshold)).toFixed(1)} (lowest: ${mLowestLabel.replace(/\s+/g, ' ')} = ${mLowest.toFixed(2)}:1)`
    : `FAILING — see details above`;

  console.log(`M Crafted dark-mode | ${mPairs.length} pairs checked | ${summaryPart}`);

  themeResults.push({ id: 'M', failCount: mAllPass ? 0 : mResults.filter(r => !r.pass).length });
}

// ── 12 market blocks ──────────────────────────────────────────────────────────

for (const mkt of markets) {
  const tokens = {
    BG:     mkt.bg,
    INK:    mkt.ink,
    ACCENT: mkt.primary,  // primary drives the CTA and inline accent pairs
  };

  const title = `SIZE — ${mkt.id.padEnd(12)} | WCAG AA contrast check`;
  const { failCount } = runTheme(title, tokens);

  themeResults.push({ id: mkt.id, failCount });
  console.log('');
}

// ── OVERALL summary line ───────────────────────────────────────────────────────

const totalThemes  = themeResults.length;
const passingCount = themeResults.filter(t => t.failCount === 0).length;
const failingThemes = themeResults.filter(t => t.failCount > 0);

if (failingThemes.length === 0) {
  console.log(`OVERALL  ${passingCount}/${totalThemes} themes pass WCAG AA at the required thresholds`);
} else {
  const failList = failingThemes.map(t => `${t.id}(${t.failCount})`).join(', ');
  console.log(`OVERALL  ${passingCount}/${totalThemes} themes pass — failing: ${failList}`);
  process.stderr.write(`WCAG AA check FAILED — failing themes: ${failList}\n`);
  process.exit(1);
}
