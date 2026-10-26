# Changelog

All notable changes to Astrobox. Versions follow semver: a major version changes class names, attributes or token names; a minor version adds components or tokens; a patch fixes values or behaviour.

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
