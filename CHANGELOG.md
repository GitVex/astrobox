# Changelog

All notable changes to Astrobox. Versions follow semver: a major version changes class names, attributes or token names; a minor version adds components or tokens; a patch fixes values or behaviour.

## 1.1.0 · 2026-10-28

- **Nuxt layer entry (#1):** the package's main entry is now the layer (`nuxt.config.ts`), so `extends: ['astrobox']` no longer crashes `nuxt prepare` with `window is not defined`. Import the runtime from `astrobox/astrobox.js` (unchanged). The docs show a tarball install for images without `git`.
- **Nuxt hydration (#2):** the layer's plugin starts the runtime on `app:suspense:resolve`, after hydration, and re-initialises only on later page changes. New `app.config.ts` options: `astrobox.locale` and `astrobox.initOnPageChange`.
- `Astrobox.fmt.locale` re-renders units only after the first `init`, so it can be set before anything renders.
- `data-seg="manual"` opts a segmented control out of the automatic click handler; Astrobox only places its indicator. Buttons with `role="radio"` get `aria-checked` instead of `aria-pressed`.
- **Glyphs (#4):** more variation per record: each ring has its own tilt and openness, a second ring crosses the first (or is broken by a gap) and has its own front arc, one to three satellites in two sizes (only the first takes the mood), and seeded core details from 40px. Small sizes keep one ring and one satellite. Every glyph changes shape. Card orbits share the glyph's second ring and satellite count. New `Astrobox.auditGlyphs(ids, kind)` lists look-alike pairs.
- `CLAUDE.md` for coding agents (#3), shipped in the package.

## 1.0.0 · 2026-10-26

First release.

- Tokens for night, day and both high-contrast modes, derived in OKLCH from one accent (signal brass `#f5a524`); presets for Command orange and ASTRA brass.
- Type: Space Grotesk for running text and interface, Noto Serif for titles, values, quotes and the accent word, IBM Plex Mono for labels and units.
- Voices (`data-voice="mechanical" | "prose"`) setting type, density and motion tempo.
- Frames with fixed meanings: cross-frame, brackets, orbit card, hairline cells, plain border. Line grammar: dashed means provisional.
- Seeded orbits with moods, image modes (behind, over, ring, plain) and hover reveal.
- Identity glyphs for records, seeded by ID.
- Units kit with locale formatting and information-only tooltips.
- States: empty, loading, error, stale and no-access, with word-length redaction.
- Motion tokens per voice, draw-once frames, drift only while visible, counting values, reduced-motion fallbacks.
- Nuxt layer, runtime, W3C tokens JSON, GUIDELINES.md and AGENTS.md.
