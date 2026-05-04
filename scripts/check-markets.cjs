/**
 * scripts/check-markets.cjs
 *
 * Service-list integrity checker for all 12 SIZE markets.
 *
 * Parses `src/data/size-data.ts` as text (regex-based, no TS compiler needed)
 * and validates each market's `services` array against:
 *
 *   1. Service id validity   — every id exists in SIZE_SERVICES
 *   2. No duplicates         — no id repeated in the same market
 *   3. Length sanity         — 5 ≤ services.length ≤ 11
 *   4. Copy coverage         — % of services that have per-market copy in
 *                              SIZE_SERVICE_COPY[market.id]
 *                              PASS ≥ 80%, WARN 60–80%, FAIL < 60%
 *
 * Pure Node — no third-party dependencies.
 *
 * Usage:
 *   node scripts/check-markets.cjs
 *   pnpm check:markets
 *
 * Exit 0 if every market is PASS or WARN; non-zero if any market FAILs.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Read source file ─────────────────────────────────────────────────────────

const DATA_PATH = path.resolve(__dirname, '../src/data/size-data.ts');

let src;
try {
  src = fs.readFileSync(DATA_PATH, 'utf8');
} catch (e) {
  console.error(`ERROR: Cannot read ${DATA_PATH}: ${e.message}`);
  process.exit(1);
}

// ─── Parse SIZE_SERVICES keys ─────────────────────────────────────────────────

/**
 * Extract the set of valid ServiceId keys from the SIZE_SERVICES Record block.
 *
 * We look for the block:
 *   export const SIZE_SERVICES: Record<ServiceId, Service> = { ... }
 * and pull out the property keys (identifiers before ':').
 */
function parseServiceIds() {
  // Capture the content of the SIZE_SERVICES object literal.
  const blockRe = /export const SIZE_SERVICES[^=]+=\s*\{([\s\S]*?)\n\}/;
  const blockMatch = blockRe.exec(src);
  if (!blockMatch) {
    console.error('ERROR: Cannot locate SIZE_SERVICES block in size-data.ts');
    process.exit(1);
  }

  const block = blockMatch[1];
  // Each line looks like:  strategyId:  { name: '...', short: '...', n: '...' },
  const keyRe = /^\s+([a-z][a-zA-Z0-9]*):\s*\{/gm;
  const ids = new Set();
  let m;
  while ((m = keyRe.exec(block)) !== null) {
    ids.add(m[1]);
  }

  if (ids.size === 0) {
    console.error('ERROR: Found 0 service ids in SIZE_SERVICES — check the regex');
    process.exit(1);
  }

  return ids;
}

// ─── Parse SIZE_MARKETS array ─────────────────────────────────────────────────

/**
 * Extract each market's id and services[] from SIZE_MARKETS.
 *
 * Each market object looks like:
 *   { id: 'cpg', n: '01', ..., services: ['estrategia', 'diseno', ...] }
 *
 * Strategy:
 *   1. Find each market block by matching `{ id: 'xxx'` through the next
 *      `services: [...]` array.
 *   2. Extract the array content and split on commas/quotes.
 *
 * Returns an array of { id, services: string[] }.
 */
function parseMarkets() {
  // We match each market object: from { id: '...' to closing services array ] }
  // The regex captures id and the content of the services array.
  const marketRe =
    /\{\s*id:\s*'([^']+)'[\s\S]*?services:\s*\[([^\]]*)\]/g;

  const markets = [];
  let m;
  while ((m = marketRe.exec(src)) !== null) {
    const id = m[1];
    const rawServices = m[2];

    // Extract each quoted string inside the array
    const serviceIds = [];
    const entryRe = /'([^']+)'/g;
    let e;
    while ((e = entryRe.exec(rawServices)) !== null) {
      serviceIds.push(e[1]);
    }

    markets.push({ id, services: serviceIds });
  }

  if (markets.length !== 12) {
    console.error(
      `ERROR: Expected exactly 12 markets; found ${markets.length}. ` +
      `Check src/data/size-data.ts.`
    );
    process.exit(1);
  }

  return markets;
}

// ─── Parse SIZE_SERVICE_COPY keys per market ──────────────────────────────────

/**
 * Extract which service ids have copy entries for each market.
 *
 * The block looks like:
 *   export const SIZE_SERVICE_COPY: Record<string, ServiceCopy> = {
 *     cpg: { estrategia: '...', diseno: '...', ... },
 *     ...
 *   }
 *
 * Returns a Map<marketId, Set<serviceId>>.
 */
function parseServiceCopy() {
  // Locate the SIZE_SERVICE_COPY block
  const blockStartRe = /export const SIZE_SERVICE_COPY[^=]+=\s*\{/;
  const startMatch = blockStartRe.exec(src);
  if (!startMatch) {
    console.error('ERROR: Cannot locate SIZE_SERVICE_COPY block in size-data.ts');
    process.exit(1);
  }

  // Extract from the opening brace to the matching closing brace at depth 0.
  let depth = 0;
  let i = startMatch.index + startMatch[0].length - 1; // position of opening '{'
  const start = i;
  while (i < src.length) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
    i++;
  }

  const block = src.slice(start, i + 1);

  // Now parse market sub-blocks:  marketId: { serviceId: '...', ... }
  const copyMap = new Map();
  const marketRe = /\b([a-z][a-z0-9]*):\s*\{([^}]+)\}/g;
  let m;
  while ((m = marketRe.exec(block)) !== null) {
    const marketId = m[1];
    const serviceBlock = m[2];

    // Skip the outer object match itself (i === start block)
    if (marketId === 'const' || marketId === 'export') continue;

    const serviceRe = /\b([a-z][a-zA-Z0-9]*):\s*'/g;
    const services = new Set();
    let s;
    while ((s = serviceRe.exec(serviceBlock)) !== null) {
      services.add(s[1]);
    }

    copyMap.set(marketId, services);
  }

  return copyMap;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(str, width) {
  return String(str).padEnd(width, ' ');
}

// ─── Main validation ──────────────────────────────────────────────────────────

const VALID_IDS = parseServiceIds();
const markets   = parseMarkets();
const copyMap   = parseServiceCopy();

const TOTAL_SERVICES = VALID_IDS.size; // 11

let overallFail = 0;
let overallWarn = 0;
let overallPass = 0;

console.log('');
console.log('SIZE — Market service-list integrity check');
console.log('─'.repeat(72));
console.log(
  pad('Market', 16) +
  pad('Services', 14) +
  pad('Copy', 18) +
  'Result'
);
console.log('─'.repeat(72));

const marketResults = [];

for (const market of markets) {
  const { id, services } = market;
  const errors = [];
  const warnings = [];

  // 1. Service id validity
  const invalidIds = services.filter(s => !VALID_IDS.has(s));
  if (invalidIds.length > 0) {
    errors.push(`unknown service id(s): ${invalidIds.join(', ')}`);
  }

  // 2. No duplicates
  const seen = new Set();
  const dupes = [];
  for (const s of services) {
    if (seen.has(s)) dupes.push(s);
    seen.add(s);
  }
  if (dupes.length > 0) {
    errors.push(`duplicate id(s): ${dupes.join(', ')}`);
  }

  // 3. Length sanity (5–11)
  if (services.length < 5 || services.length > TOTAL_SERVICES) {
    errors.push(
      `service count ${services.length} is out of range [5, ${TOTAL_SERVICES}]`
    );
  }

  // 4. Copy coverage
  const copySet = copyMap.get(id) || new Set();
  const validServices = services.filter(s => VALID_IDS.has(s));
  const coveredCount = validServices.filter(s => copySet.has(s)).length;
  const totalCount = validServices.length;
  const coveragePct = totalCount > 0
    ? Math.round((coveredCount / totalCount) * 100)
    : 0;

  let copyLabel;
  let copyFail = false;
  if (coveragePct >= 80) {
    copyLabel = `${coveredCount}/${totalCount} (${coveragePct}%)`;
  } else if (coveragePct >= 60) {
    copyLabel = `${coveredCount}/${totalCount} (${coveragePct}%) WARN`;
    warnings.push(`copy coverage ${coveragePct}% < 80%`);
  } else {
    copyLabel = `${coveredCount}/${totalCount} (${coveragePct}%) LOW`;
    errors.push(`copy coverage ${coveragePct}% < 60%`);
    copyFail = true;
  }

  // Determine result
  let result;
  if (errors.length > 0) {
    result = 'FAIL';
    overallFail++;
  } else if (warnings.length > 0) {
    result = 'WARN';
    overallWarn++;
  } else {
    result = 'PASS';
    overallPass++;
  }

  const servicesLabel = `${services.length}/${TOTAL_SERVICES}`;

  console.log(
    pad(id, 16) +
    pad('services ' + servicesLabel, 14) +
    pad('copy ' + copyLabel, 18) +
    result
  );

  // Print error details indented
  for (const e of errors) {
    console.log(`  ERROR: ${e}`);
  }
  for (const w of warnings) {
    console.log(`  WARN: ${w}`);
  }

  marketResults.push({ id, result, errors, warnings });
}

console.log('─'.repeat(72));
console.log('');

// ─── OVERALL line ─────────────────────────────────────────────────────────────

const total = markets.length;
if (overallFail === 0) {
  console.log(
    `OVERALL  ${overallPass + overallWarn}/${total} markets pass` +
    (overallWarn > 0 ? ` · ${overallWarn} warn` : '') +
    (overallFail > 0 ? ` · ${overallFail} fail` : '')
  );
} else {
  const failList = marketResults
    .filter(r => r.result === 'FAIL')
    .map(r => r.id)
    .join(', ');
  console.log(
    `OVERALL  ${overallPass}/${total} markets pass · ${overallWarn} warn · ${overallFail} fail — failing: ${failList}`
  );
  process.stderr.write(
    `Market integrity check FAILED — failing markets: ${failList}\n`
  );
  process.exit(1);
}
