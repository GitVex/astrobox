# Astrobox: instructions for coding agents

Astrobox is a design system: tokens, components, a browser runtime and a Nuxt layer. This file applies when you work on Astrobox itself or on an app that uses it. An app can point its own `CLAUDE.md` at `node_modules/astrobox/CLAUDE.md`.

## Read first

- **`AGENTS.md`** has the hard rules, and they are not optional. Read it before writing any UI. They cover type roles, voices, one accent, signals need words, frames by meaning, nesting, dashed means provisional, orbit budget, moods, glyphs, units, tooltips, secrets, states, motion tokens and progress. It also has the decision tables, markup snippets, the JavaScript API and the checklist to run before finishing.
- **`GUIDELINES.md`** explains what each part means and when to use it. Check it when a rule in `AGENTS.md` doesn't settle a case.
- **`templates/example.html`** is a complete page with correct markup.

## Working on Astrobox

- Source is `src/`: `tokens.config.mjs` (tokens), `palette.js` (colour derivation), `components.css` and `runtime.js`.
- `npm run build` (`scripts/build.mjs`) generates `dist/` and copies it to `docs/assets/`. **Never edit `dist/` or `docs/assets/` by hand.** Edit `src/` and rebuild. CI (`npm run check`) fails when they are out of date.
- Check changes in the element library, `docs/library/index.html`. It loads the built files.
- Keep `AGENTS.md`, `GUIDELINES.md`, `docs/index.html` and `CHANGELOG.md` in step with behaviour changes. Versions follow the semver rules at the top of `CHANGELOG.md`.
- Seeded output (orbits, glyphs) must stay deterministic: the same ID draws the same thing in every app.

## Using Astrobox in a Nuxt app

- Install a tagged version, then `extends: ['astrobox']` in `nuxt.config.ts`. That brings the stylesheets, fonts and runtime plugin. Without `git` (Alpine images), depend on `https://codeload.github.com/GitVex/astrobox/tar.gz/refs/tags/vX.Y.Z`.
- The plugin initialises the runtime once hydration has finished and again after each page change. Don't add your own `Astrobox.init(document)` in `app:mounted` or another hook that runs during hydration, because it causes hydration mismatches.
- Set `astrobox.locale` in `app.config.ts` to the server's locale. Set `astrobox.initOnPageChange: false` when components initialise their own markup with `useNuxtApp().$astrobox.init(el)`.
- A segmented control that Vue drives gets `data-seg="manual"`.
- Let Astrobox own the elements it draws (units, meters, glyphs, redaction bars). Update them through `$astrobox.count`, `setMood` and `init`, not by re-rendering their contents from Vue.
- Before finishing UI work, run `Astrobox.auditFrames()` and `Astrobox.auditOrbits()` in the browser console.
