# Astrobox

The design system for the Trailblazers apps (Datapad, Lore Lexicon): Command Deck's construction lines and segmented bars with ASTRA's brass, Noto Serif and dashed orbits.

**Read the full README, with install and retrofit guides, on the project site:** `https://YOUR-USER.github.io/astrobox/` (source: [`docs/index.html`](docs/index.html)).
The live element library is at [`docs/library/`](docs/library/index.html).

## Quick start (Nuxt)

```bash
npm install github:YOUR-USER/astrobox#v1.0.0
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ extends: ['astrobox'] })
```

Then set `data-voice="mechanical"` or `data-voice="prose"` on each screen.

Other routes:

- **Template:** `npx giget gh:YOUR-USER/astrobox/templates/nuxt-starter my-app`
- **Any bundler:** import `astrobox/tokens.css`, `astrobox/astrobox.css`, `astrobox/astrobox.js`
- **Plain HTML:** link the three files in `dist/`; see `templates/example.html`

## Documents

| File | For |
|---|---|
| [`GUIDELINES.md`](GUIDELINES.md) | People: what each part means and when to use it |
| [`AGENTS.md`](AGENTS.md) | AI coding agents: hard rules, decision tables, snippets, API, checklist |
| [`CHANGELOG.md`](CHANGELOG.md) | What changed in each version |

## Changing Astrobox

Edit `src/`, run `npm run build`, check `docs/library/`, update the docs and changelog, bump the version and tag it. CI fails if `dist/` is out of date. Enable GitHub Pages on `main` → `/docs` to publish the site.

Replace `YOUR-USER` with your GitHub user or organisation. On GitHub Pages the site fills it in automatically.
