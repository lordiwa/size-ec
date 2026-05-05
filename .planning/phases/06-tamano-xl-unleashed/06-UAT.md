# Phase 6 — Tamaño XL (Unleashed): Operator UAT Checklist

**Generated:** 2026-05-05
**Phase:** 06-tamano-xl-unleashed
**Plans covered:** 06-01 (extend `pnpm check:contrast` to XL tokens, 17/17 via the default 5-pair contract — DEC-062/063), 06-02 (WebGL2 capability gate + Pinia auto-fallback to L + educational toast — DEC-064/065/066/067), 06-03 (HomeView XL branch — verbatim port of prototype 00021082_04 lines 62-76, DEC-068/069/070), 06-04 (this UAT)

Before walking the XL Home view + WebGL2 fallback path, confirm the automated gates pass:

```
pnpm check:contrast   # exits 0 — all 17 themes (M + 12 markets + S + L + XS + XL) pass WCAG AA
pnpm check:markets    # exits 0 — all 12 market service lists are valid
pnpm type-check       # exits 0 — no TypeScript errors
pnpm build            # exits 0 — clean production bundle, zero XL-stack chunks
pnpm dev              # vite dev server up at http://localhost:5173
```

WCAG AA audit results for XL (Unleashed) — including the **DEC-062** zero-override
result (XL clears all 5 pairs on the default 5-pair contract: body 20.38:1, muted
8.77:1, large heading 20.38:1, accent CTA 15.42:1, accent inline 15.42:1) and the
**DEC-063** `--accent-2` decorative-only rationale (consumed only inside the
animated `xl-grad-text` gradient, never as a flat fill) — are documented in:

[`06-CONTRAST-RESULTS.md`](06-CONTRAST-RESULTS.md)

The capability-gate contract (WebGL2 probe → Pinia store auto-fallback to L →
educational toast → 3.5 s auto-dismiss) is summarised in:

[`06-02-SUMMARY.md`](06-02-SUMMARY.md)

The contrast contract is already auto-verified — this walk-through is a **visual
sanity check** that the prototype-fidelity XL Home view (DEC-068/069/070) reads
correctly on a WebGL2-capable browser, plus a **deterministic negative-path
test** (DevTools → disable WebGL2 → pick XL → confirm L fallback + toast)
verifying REQ-xl-capability-detection end-to-end.

**XL personality cheat-sheet** (what the operator should expect to see):

| token / surface | value | feel |
|-----------------|-------|------|
| `--bg` / `--ink` / `--muted` | `#050505` / `#ffffff` / `#aaaaaa` | near-black void, white type, neutral grey hierarchy |
| `--accent` | `#00ffaa` (neon green) | runtime-label colour + CTA + inline accent text |
| `--accent-2` | `#ff00ff` (magenta) | decorative-only — consumed inside the `xl-grad-text` gradient, never flat (DEC-063) |
| display font | **Geist** (`var(--font-display)`) | unchanged from M; XL personality lives in colour + animation, not type |
| SIZE wordmark + rotator | `xl-grad-text` class — `linear-gradient(90deg, #00ffaa, #ff00ff, #00ffaa)` clipped to text glyphs, animated 6s linear infinite via `@keyframes xl-grad` | the XL signature: glyphs cycle slowly through neon green → magenta → neon green |
| runtime label | `[ home.scene · runtime ]` in `mono upper`, neon green, top-left | placeholder for the future Three.js scene (DEC-070; deferred to Phase 7 per DEC-060) |
| MarketSelect dropdown | inherits `var(--bg)` / `var(--ink)` / `var(--accent)` | sits below the rotator, fully accessible |

Pick **XL** from the **footer mini-slider** (XS · S · M · L · XL). Reconfigurando
overlay should play on every level switch (DEC-016). After Phase 6, all 5 levels
are visually functional; XL's actual JS-driven content (Three.js scene + Phaser
mini-game + Tone.js generative audio) is **intentionally deferred to Phase 7**
per **DEC-060** — see footnote [^1] at the bottom of this document.

---

## A. Home-XL visual check

**Goal:** Confirm the XL Home branch (DEC-068 — `v-else-if="style.code === 'xl'"`
between S and XS) renders the prototype-fidelity look from `00021082_04` lines
62-76, that the animated `xl-grad-text` gradient cycles correctly, and that the
runtime-scene placeholder reads as neon-green decorative HUD.

**Procedure:**

1. Run `pnpm dev` on a **WebGL2-capable browser** (Chrome / Firefox / Safari current versions all qualify by default).
2. Navigate to `http://localhost:5173`.
3. Pick **XL** from the footer mini-slider (XS · S · M · L · XL — last slot).
4. Visually verify each cell below; tick once confirmed.

**Per-cell pass criteria:**

- [ ] **Reconfigurando overlay played on entry** — the ~900ms swap mask covered the M → XL transition (DEC-016 status feedback).
- [ ] **Runtime label `[ home.scene · runtime ]` visible top-left** — rendered in `mono upper` (uppercase monospace, `var(--font-mono)`), neon green (`var(--accent)` = `#00ffaa`). This is the visible placeholder for the future Three.js scene (DEC-070; the scene itself lands in Phase 7 per DEC-060 — its absence is **expected, not a bug**).
- [ ] **SIZE wordmark renders with the animated gradient** — the large `<h1 class="size-wordmark huge xl-grad-text">SIZE</h1>` glyphs cycle slowly through neon green → magenta → neon green via `@keyframes xl-grad` (6s linear infinite). The cycle is **continuous and fluid** under non-reduced-motion; `background-clip: text` clips the gradient to the glyph shapes so the negative space stays the dark `#050505` body bg.
- [ ] **Tagline "Publicidad a tu medida." readable in the display font** — rendered below the wordmark in `var(--font-display)` (Geist) at `clamp(28px, 4vw, 56px)`, white on near-black (`#ffffff` on `#050505` = 20.38:1 — large-heading pair PASS).
- [ ] **Rotating word "Somos tu [palabra]." picks up the gradient effect** — the `<span class="xl-grad-text">` wrapping `<RotatingWord/>` inside the `.home-xl-rotator` paragraph means each rotated word also cycles green/magenta/green. The word itself swaps on the standard ~2.5–3s cadence with `<Transition mode="out-in">` (DEC-019 / DEC-020 — `aria-live="polite"` on the parent `<p>` for screen readers).
- [ ] **MarketSelect dropdown renders below, accessible** — the `<MarketSelect/>` component sits inside `.home-xl-cta` (40px top margin, flex-centered). Keyboard-focusable, screen-reader-labeled, and inherits the level-xl token block so the dropdown chrome reads correctly on the dark body.

---

## B. WebGL2 fallback test (REQ-xl-capability-detection negative path)

**Goal:** Confirm that picking XL on a non-WebGL2 environment is a **survivable,
dismissible, accessible event** — the Pinia store rewrites the level to L
atomically (DEC-064), the educational toast appears with WebGL2-specific copy
(DEC-066), the toast is keyboard-dismissible (DEC-067), and there is no crash,
black screen, or console error.

**Procedure (Chrome / Edge):**

1. Open DevTools (F12 or Cmd+Opt+I).
2. Open the **Rendering** panel (Cmd/Ctrl+Shift+P → type "Show Rendering" → Enter).
3. Scroll to the bottom: **WebGL: → "disabled"**.
   - Alternative: chrome://flags → search "WebGL 2.0" → "Disabled" → Relaunch. (Heavier — Rendering panel is faster.)
4. Hard-reload the page (Ctrl+Shift+R / Cmd+Shift+R).
5. Pick **XL** from the footer mini-slider.
6. Verify each cell below; tick once confirmed.

**Procedure (Firefox alternative):**

1. Open `about:config`.
2. Set `webgl.disabled` → `true`.
3. Reload the dev server tab.
4. Pick **XL** from the footer mini-slider.

**Per-cell pass criteria:**

- [ ] **Style flips to L automatically (no XL render)** — the page renders the **L (Bold)** brutalist treatment (yellow `#ffee00` body, Archivo Black, magenta accents, marquee on Home) instead of the XL dark+gradient look. The footer mini-slider's active slot reads **L**, not XL — the user's intent (5) became the actual level (4) atomically, per DEC-064. Views never observed an intermediate XL state.
- [ ] **Toast appears bottom-right with educational copy** — the `XlFallbackToast` component renders inside the `App.vue` Teleport-to-body block (DEC-066), with `role="status"` and `aria-live="polite"`. Copy explicitly mentions WebGL2 and the L (Bold) fallback (e.g. "XL no disponible. Tu navegador no soporta WebGL2 — caímos a L (Bold) automáticamente.").
- [ ] **Toast has a `×` close button that dismisses immediately** — clicking the dismiss button calls `style.dismissXlFallback()` which clears the `xlFallback.active` flag AND cancels the auto-dismiss timer atomically (DEC-067 — no dangling `setTimeout` left to re-clear an already-cleared flag).
- [ ] **No console errors / no black screen** — DevTools console is clean (no red entries). The page chrome is fully painted (no white flash, no blank canvas, no aborted render). Body background reads as the L yellow `#ffee00`, not as a stalled XL `#050505`.
- [ ] **After ~3.5 s without manual dismiss, toast auto-fades** — if the operator does not click the `×`, the store's 3500 ms `setTimeout` (DEC-067, `XL_FALLBACK_MS = 3500`) fires and clears the flag automatically. The toast fades out (or unmounts, depending on the component's transition) and the page settles into pure L without further intervention.

**Cleanup:** After the test, re-enable WebGL2 (DevTools Rendering panel → "WebGL: → default" / `about:config` → toggle back to `false`) and hard-reload. Confirm picking XL again now renders the XL Home branch from Section A — round-trips cleanly.

---

## C. Bundle audit (REQ-progressive-loading scaffold)

**Goal:** Confirm the lazy-load **contract** Phase 6 establishes — Phase 6 ships
zero XL-stack code into the bundle by definition (none of the libraries are
installed yet; per **DEC-060**, Three.js / Phaser / Tone.js / postprocessing /
physics land in **Phase 7**). The actual chunk-splitting verification (dynamic
imports, route-split bundles, XL chunks load only when XL is active) runs in
Phase 7 once those libraries are installed.

**Procedure:**

1. Run `pnpm build` from the project root.
2. Inspect `dist/assets/` (use `ls dist/assets/` or any file browser).

**Per-cell pass criteria:**

- [ ] **No chunk filename contains `three`, `phaser`, `tone`, or `postprocessing`** — `git grep -rn "three\\|phaser\\|tone\\|postprocessing\\|@tresjs\\|cannon-es\\|@dimforge/rapier" dist/assets/` returns nothing. `package.json` is also clean of these dependencies — they will be added in Phase 7. Phase 6 ships the contract (composable + store fallback + toast); Phase 7 will install these and re-run this check with full bundle-splitting verification (XS / S / M visitors must never download any of them; L and XL visitors get them lazily on demand).

---

## D. Reduced-motion sweep

**Goal:** Confirm the global `@media (prefers-reduced-motion: reduce)` rule in
`src/styles/main.css` (lines 387-398) correctly mutes XL's only motion-heavy
surface (the animated `xl-grad-text` gradient on the SIZE wordmark + rotator
span) while preserving status feedback (Reconfigurando is communication, not
decoration) and text-level rotation (the rotating word swaps via Vue
`<Transition>` text replacement, not pixel motion). XL has no Three.js scene
yet, so per-feature reduced-motion handling is irrelevant in Phase 6 — when
Phase 7 lands the actual scene + Phaser mini-game, those libraries get their
own per-feature reduced-motion handling.

**Procedure:** Toggle OS-level reduced motion (macOS: System Settings →
Accessibility → Display → Reduce motion; Windows: Settings → Accessibility →
Visual effects → Animation effects OFF). Refresh the page. Pick XL.

> [ ] With OS-level reduced motion ON and `prefers-reduced-motion: reduce` honored: the XL gradient animation **freezes** — the global `* { animation-duration: 0.01ms !important }` rule collapses the `xl-grad` 6s linear infinite keyframes to effectively 0, so the SIZE wordmark and rotator span render with the gradient stop frozen at its starting position (a still cycle through neon green / magenta), no visible motion. The **rotating word still swaps** — it's text replacement (`<Transition mode="out-in">` on the rotator span content), not motion, and stays alive. The **Reconfigurando overlay still flashes** on level switches (status feedback per DEC-016). The neon-green runtime label `[ home.scene · runtime ]` is static text, unaffected.

---

## E. Transition smoke

**Goal:** Confirm M ↔ XL round-trips feel instant-but-not-jarring, that the
Reconfigurando overlay carries the gap, that the `~600ms` body bg/ink fade
holds (M dark editorial → XL near-black + neon → back), and that there is no
full reload or flash beyond the overlay.

**Procedure:** From Home, use the footer mini-slider to walk M → XL → M. Time
each transition with the devtools Performance tab open if needed. Stay on a
WebGL2-capable browser so XL actually renders (no fallback mid-test).

> [ ] Pick **M → XL → M** from the footer mini-slider in order. Each transition: ~600ms body bg/ink fade (`background 600ms ease, color 600ms ease` from `main.css` — `#0e0e10` ↔ `#050505` for bg, `#fafafa` ↔ `#ffffff` for ink), Reconfigurando overlay covers the swap for ~900ms, then the new layout commits. **No full page reload** (URL stays the same, no white flash beyond the overlay), no flicker between the overlay's lift and the next layout's commit. The XL branch swaps in (`HomeView v-else-if="style.code === 'xl'"`; the 4 protected views — Servicios / Quiénes / Cliente / Contacto — fall back to the M-default branch under XL per **DEC-061**, see footnote [^2]) and the M-default branch returns cleanly.

**Transition timing contract:** Body `background` and `color` transition in
600ms. The Reconfigurando overlay masks the swap for ~900ms. Net effect: the
user sees the overlay appear, content reconfigures beneath it, overlay fades —
total perceived switch time ≤ 1 second.

---

## F. Sign-off

All checks above must be complete before Phase 7 (Contenido — Three.js +
Phaser + Tone.js installation + team photos + client cases + final rotating-
words list) planning begins.

| Reviewer | Date | All cells PASS? | Notes |
|----------|------|-----------------|-------|
| | | [ ] yes [ ] no | |

**Automated gates (must be green before sign-off):**

- [ ] `pnpm check:contrast` exits 0 — OVERALL **17/17 themes** pass WCAG AA (M + 12 markets + S + L + XS + XL — the entire SIZE catalog; the 17-style contrast contract is closed)
- [ ] `pnpm check:markets` exits 0 — OVERALL 12/12 markets pass
- [ ] `pnpm type-check` exits 0
- [ ] `pnpm build` exits 0 — bundle clean of Three.js / Phaser / Tone.js / postprocessing / physics chunks (all to be installed in Phase 7 per DEC-060)

---

## Footnotes

[^1]: **DEC-060 — Three.js scene + Phaser mini-game intentionally deferred to Phase 7.** Phase 6 is the **infrastructure phase** for XL: visual identity (CSS gradient prototype port), WebGL2 capability detection, L-fallback hook, and WCAG AA verification. The actual Three.js scene rendering (`@tresjs/core` + Three.js installed + a runtime scene under `<section class="home-xl">`), Phaser 3 mini-game (DECISION-XL-PHASER), Tone.js generative audio (default OFF), `postprocessing`, and a physics library (Cannon-es or Rapier) all land in **Phase 7 (Contenido)** alongside team photos, client cases, and final content. This resolves the apparent contradiction between PROJECT.md DECISION-XL-PHASER ("Phase 7") and ROADMAP §Phase 6 success criterion #6 ("Phaser locked to DECISION-XL-PHASER"): **Phase 6 LOCKS the contract; Phase 7 ships the implementation.** When walking this UAT, the absence of an animated 3D scene under the runtime label is **expected, not a bug** — the runtime label `[ home.scene · runtime ]` is the visible placeholder for that future scene per DEC-070.

[^2]: **DEC-061 — Servicios / Quiénes / Cliente / Contacto inherit M-default in XL.** Phase 6 does NOT add per-view `.xl-bold` treatments for the 4 protected views — they inherit the M-default branch when XL is active because (a) the prototype only specifies XL for Home (00021082_04 lines 62-76), and (b) any XL-specific per-view chrome is bound to the actual content of Phase 7 (team photos, client cases, mini-game). The existing `<section v-else>` wrapping established in Phase 5 (DEC-053) already accepts XL cleanly into the M-default branch, which is fine because XL's body text uses the same dark-mode tokens as M (just with neon `#00ffaa` accents instead of M's `#c9a961`). **This is an explicit decision, not a missing piece.** When walking this UAT, the 4 protected views rendering in M (dark editorial) under an active XL flag is **expected, not a bug**. Phase 7 will revisit per-view XL treatments if the content warrants it (e.g. a Phaser mini-game embedded in Servicios), but Phase 6 closes here.
