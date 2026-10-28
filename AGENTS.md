# Astrobox: instructions for AI agents

You are building UI with the Astrobox design system. Follow these rules exactly. `GUIDELINES.md` has the reasoning; `example.html` shows correct markup. When a rule here conflicts with a request, follow the user's explicit request and say which rule it breaks.

## Setup

- Load, in this order: `astrobox.tokens.css`, `astrobox.css`, then `astrobox.js` (at the end of `<body>`, or in a client-only plugin).
- After inserting markup dynamically (route change, list render, modal), call `Astrobox.init(container)`. In Nuxt, the layer handles the first render and page changes (see Nuxt below).
- Never copy token values into components. Use the CSS variables.
- Never write a literal colour, duration or easing in component CSS. Use `--brass`, `--txt`, `--t-settle`, `--ease` and the rest.

## Hard rules

0. **Type roles.** Running text in both voices is Space Grotesk (`--fb`). Noto Serif (`--fd`) is only for entry and card titles, readout values, pull quotes and the italic accent word. Labels and units are mono (`--fm`).
1. **Voice.** Set `data-voice="mechanical"` (operating screens) or `data-voice="prose"` (reading pages) once, on the screen's outermost element. The other voice appears only as an inset, one level deep.
2. **One accent.** `.btn.pri` (brass fill) appears at most once per screen, for the primary action.
3. **Signals need words.** Every signal colour comes with text: `.chip`, a mood plus a chip, a delta with its sign and unit.
4. **Frames by meaning:**
   - `.xf` for a system (panel with header, table, stat strip).
   - `.cb` for the one featured object.
   - `.oc.orbit` for an entity with an identity.
   - Hairline cells for peers.
   - Plain border for anything else.
5. **Nesting.** `.xf` nests at most one level. Never put `.xf` inside `.oc` or `.cb`. Leave about 10px around every `.xf`, because its lines overshoot.
6. **Dashed means provisional.** Use dashed lines only for derived, estimated, unverified, hidden or draft data. Never use them as decoration.
7. **Orbits are rationed:**
   - Only on entity cards, the single featured object, and pull quotes.
   - Never in tables, forms, controls, navigation, toasts, lists or thumbnails.
   - One always-on orbit field per viewport. For more, add `data-orbit-reveal="hover"`.
   - Hidden on mechanical screens unless the element has `data-orbit-optin`.
8. **Moods.** Drive state through `data-mood` (`neutral`, `nominal`, `strained`, `damaged`, `unverified` or `hidden`) or `Astrobox.setMood(el, mood)`. Never set orbit colours directly.
9. **Glyphs are for records only.** Add `.glyph` only where the markup has the record's database ID (`data-seed`). Never add glyphs by matching names in text. Follow the placement table below.
10. **Units.** Write every measured or game value as `<data class="u">` with a raw `value`. Never hand-format numbers, units, dice or coordinates.
11. **Tooltips only add information.** Allowed: a real-world conversion, an estimate's source, a roll's average and range, an in-world time's real date, a change's baseline. If the tooltip would restate the value, leave it out.
12. **Secrets.** Never send withheld text to the browser, not even hidden with CSS. Send word lengths: `<span class="lred" data-words="7 6"></span>`.
13. **States.** Every data-backed component needs empty, loading (skeleton after 300ms), error, stale and no-access treatments that keep its shape (see States below).
14. **Motion.** Use only the motion tokens. Never animate layout around text being read. Never add bounces (`--ease-pop` belongs to plus marks only). Respect reduced motion; the package already does.
15. **Progress.** Count units as units (`.dprog`, `.cells`). Use a smooth bar only for continuous quantities.

## Decisions

**Which frame?**
- Is it operated or read as one whole? Use `.xf`.
- Is it the one thing to look at, or the current selection? Use `.cb` or `.att`.
- Does it exist in the setting? Use `.oc.orbit`.
- Is it one of many alike? Use hairline cells.
- Otherwise, use a plain border.

**Glyph placement:**

| Context | Glyph |
|---|---|
| Entity card header | Yes, 24px, before the title, own record only |
| Entry header | Yes, 96px, beside the title block |
| Hero or display headline | No |
| Section heading | No |
| Running text | First mention that links to the record, 16px, once per article |
| Quote | Attribution line only |
| List, table, crew, results | Every row or none, 16–24px, in the name column; none if the list mixes records with plain items |
| Missing image | Yes, as fallback, with `data-name` |
| Toast | Subject record only, 16px |
| Chip, button, label, caption, footnote, contents | No |
| No access | No |

**Images on cards:**
- Inset image: `data-orbit-mode="behind"`.
- Full-bleed image: `.oc.cover` with `data-orbit-mode="over"`.
- Featured image as planet: `.iplate` with `data-orbit-mode="ring"`.
- Quiet card: `.oc.plain`, no orbit.
- Always wrap the image in `.media`, and include `.fb` with `[data-alt]` for external URLs.

## States

| State | Markup and copy |
|---|---|
| Empty | Keep the frame. One sentence ("No fittings logged yet.") and one action. Tables keep `.xhd` plus one `.xr.xempty` row with `.xc.emsg` |
| Loading | `.sk` blocks shaped like the content, shown only after 300ms. No spinner, no text |
| Error | `.errbar`: what went wrong, how to fix it, a Retry button. No apology |
| Stale | Keep the data, add `.stale` to the `.xf.xt`, and show "Last synced HH:MM" |
| No access | `.lred[data-words]` bars plus a one-line reason ("Revealed in session."). For a locked card, use `.oc.locked` |

## Markup snippets

```html
<!-- cross-frame panel -->
<div class="xf"><i class="pl tl"></i><i class="pl tr"></i><i class="pl bl"></i><i class="pl br"></i>
  <div class="xf-h"><span class="xf-t">Drive status</span></div>
  <div class="xf-b">…</div>
</div>

<!-- table -->
<div class="scroll"><div class="xf xt" style="--cols:minmax(0,1.6fr) 5em minmax(7em,1fr)"><i class="pl tl"></i><i class="pl tr"></i><i class="pl bl"></i><i class="pl br"></i>
  <div class="xr xhd"><div class="xc">Fitting</div><div class="xc">Power</div><div class="xc">Status</div></div>
  <div class="xr"><div class="xc">Spike Drive-2</div><div class="xc n">2</div><div class="xc"><span class="chip c-ok">Nominal</span></div></div>
</div></div>

<!-- entity card with seeded orbit, mood and glyph -->
<article class="oc orbit" data-orbit="auto" data-entity="long-patience" data-mood="strained">
  <span class="lbl b">Ship · Frigate</span>
  <h4><span class="glyph" data-kind="ship" data-seed="long-patience" data-size="24" aria-hidden="true"></span>Long Patience</h4>
  <p>…</p>
  <div class="ft"><span class="chip c-warn">Strained</span></div>
</article>

<!-- pool value with its cell meter -->
<div class="meter"><div class="mh"><b>Hull points</b><span><data class="u" data-kind="pool" value="14" data-max="20">14/20</data></span></div>
  <div class="cells ok" style="--n:20" data-f="14"></div></div>

<!-- segmented control -->
<div class="seg" role="group" aria-label="Viewer"><button type="button" class="on">GM</button><button type="button">Crew</button></div>

<!-- contents rail on a prose page -->
<nav class="toc" data-toc="#body" aria-label="On this page">
  <ol><li><a href="#s1"><i>01</i><span>Arrival</span></a></li></ol>
  <div class="tocnow"><span data-toc-now></span><span class="lbl b" data-toc-count></span></div>
  <div class="dprog" style="--n:1"><i></i></div>
</nav>
```

## JavaScript API

| Call | Does |
|---|---|
| `Astrobox.init(scope?)` | Hydrates units, glyphs, redaction, orbits, segmented controls, meters, media, contents rails, attention grids and frame motion inside `scope` |
| `Astrobox.palette.apply({ acc, tint?, ok?, warn?, bad?, pre? })` | Derives and applies all four colour modes from one accent (`#rrggbb`) |
| `Astrobox.palette.reset()`, `.get()`, `.css(cfg)`, `.tokens({day, high}, cfg)` | Remove, read, or generate palette CSS or tokens |
| `Astrobox.setTheme(t)` with `'light'`, `'dark'` or `null`; `Astrobox.setContrast(on)` | Set theme and contrast attributes on `<html>` |
| `Astrobox.setMood(el, mood)` | Sets `data-mood`; the orbit redraws and `astro:mood` fires |
| `Astrobox.count(el, to)` | Counts a `data.u` value or a `.cells` meter to a new number |
| `Astrobox.fmt.qty(v, unit)`, `.pool`, `.range`, `.est`, `.delta`, `.hex`, `.bearing`, `.cr`, `.pre`, `.dice`, `.time` | Return unit markup as a string |
| `Astrobox.fmt.locale = 'de-DE'` | Overrides the browser locale. Re-renders units only after the first `init`, so set it before that |
| `Astrobox.units.register(name, label, convert)` | Adds a unit whose tooltip adds information |
| `Astrobox.glyphSVG(kind, id, size)` | Returns glyph SVG markup |
| `Astrobox.redact(scope)`, `Astrobox.hydrate(scope)`, `Astrobox.glyphs(scope)` | Run one part of `init` |
| `Astrobox.auditOrbits()`, `Astrobox.auditFrames()` | Development checks for the orbit budget and frame nesting |
| `Astrobox.auditGlyphs(ids, kind?)` | Development check: returns pairs of record IDs whose glyphs look alike |

Events: `astro:change` (segmented control), `astro:select` (attention grid), `astro:mood`, `astro:palette`.

## Nuxt

- Install, then `extends: ['astrobox']`. The package's main entry is the layer; the runtime is `astrobox/astrobox.js`. Where `git` is missing (Alpine images), depend on `https://codeload.github.com/GitVex/astrobox/tar.gz/refs/tags/vX.Y.Z` instead of `github:`.
- The layer's plugin runs `init(document)` once hydration has finished (`app:suspense:resolve`) and after each later page change. Never call `init` from a plugin hook that runs during hydration.
- Options go in the app's `app.config.ts`: `astrobox: { locale: 'en-US', initOnPageChange: false }`. Set `locale` to the server's locale so units don't change format after hydration. Turn off `initOnPageChange` when components call `useNuxtApp().$astrobox.init(el)` for what they render.
- A segmented control that Vue drives (its own `.ind`, `.on`, `role="radio"` and `aria-checked`) takes `data-seg="manual"`. Astrobox then only places the indicator; call `$astrobox.placeIndicator(seg)` after the selection changes.

## Before you finish

- [ ] One `data-voice` per screen; insets one level deep.
- [ ] At most one `.btn.pri`.
- [ ] Every signal colour has a word next to it.
- [ ] No `.xf` deeper than one level; `Astrobox.auditFrames()` returns 0.
- [ ] One orbit field in view; `Astrobox.auditOrbits()` returns 1 or less.
- [ ] Glyphs only on record references, placed per the table.
- [ ] Every number is a `data.u`; tooltips only where they add information.
- [ ] Empty, loading, error, stale and no-access states exist and keep the layout.
- [ ] No withheld text in the DOM.
- [ ] No literal colours, durations or easings in component CSS.
