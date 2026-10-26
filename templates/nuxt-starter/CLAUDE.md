# Project instructions

This app uses the Astrobox design system (installed as the `astrobox` Nuxt layer).
For all UI work, follow `node_modules/astrobox/AGENTS.md`: it holds the hard rules, decision tables,
markup snippets and the checklist to run before finishing. The full reasoning is in
`node_modules/astrobox/GUIDELINES.md`.

- Mechanical screens (operating, editing, status) set `data-voice="mechanical"`; reading pages set `data-voice="prose"`.
- After rendering new Astrobox markup outside a page change, call `useNuxtApp().$astrobox.init(el)`.
- Before finishing UI work, run `Astrobox.auditFrames()` and `Astrobox.auditOrbits()` in the browser console.
