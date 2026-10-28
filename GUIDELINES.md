# Astrobox guidelines

Astrobox is the design system for the Trailblazers apps: the Datapad, which you operate, and the Lore Lexicon, which you read. It merges two languages. From Command Deck it takes construction lines, plus marks, segmented bars and tables drawn like technical drawings. From ASTRA it takes brass, a serif voice and dashed orbits.

This document explains what each part means and when to use it. For installation, see `README.md`. For the condensed rule set given to AI agents, see `AGENTS.md`. The living reference is the Astrobox library page, where every element can be tried.

---

## 1. Principles

1. **One accent.** Brass is the only accent colour. Every other hue is a signal, and a signal always travels with a word.
2. **The edge says what it holds.** Cross-frame, brackets, orbit card, hairline cells and plain border each have one meaning (section 5).
3. **Solid is confirmed, dashed is provisional.** Dashed lines mean derived, estimated, unverified, hidden or draft. Nothing else.
4. **Every number carries its unit.** Values are set by the units kit, never typed by hand.
5. **Nothing moves the reader.** Motion settles things into place; it never shifts text that is being read.
6. **Secrets never reach the browser.** Withheld content is sent as lengths and drawn as bars.

---

## 2. Colour

### The accent and what is derived from it

Pick one accent. Everything else is calculated from it in OKLCH, separately for each mode:

- **Neutrals** take the accent's opposite hue at very low chroma, so greys lean cool against a warm accent.
- **Signals** keep their meaning (green is good, rose is bad) but match the accent's weight. A signal that lands within 30° of the accent's hue steps aside by 36°. With an orange accent, for example, the warning colour moves to amber.
- **Every mode** (night, day, and both high-contrast variants) gets its own lightness for each token, so contrast holds whatever accent is picked.

| Preset | Accent | Character |
|---|---|---|
| Signal brass (default) | `#f5a524` | Brass hue with an orange's saturation |
| Command orange | `#ff6a33` | The original Command Deck accent |
| ASTRA brass | `#d3b777` | Soft, desaturated brass |

Overrides are allowed for the neutral tint and the four signals. An override keeps its hue and saturation but still follows each mode's lightness rules, so it stays legible.

### Tokens

| Token | Role |
|---|---|
| `--bg` | Ground. Use with `.astro-grid` for the 56px survey grid |
| `--panel`, `--panel2` | Frames and cells; insets and raised cells |
| `--hov` | Hover fill |
| `--ln` | Construction lines (frame edges) |
| `--ln2` | Hairlines and segment gaps |
| `--txt`, `--dim`, `--faint` | Primary, secondary and tertiary text |
| `--brass`, `--brass-txt`, `--on-brass` | Accent fill, accent as text, text on accent fill |
| `--pc` | Plus-mark colour |
| `--jade` | Signal: nominal, valid, active |
| `--ember` | Signal: strained, low, scrambled |
| `--oxide` | Signal: damaged, anomaly, denied (rose) |
| `--iris` | Signal: predicted, unverified |
| `--orb`, `--orb2`, `--orbf` | Orbit strokes |
| `--bar` | Redaction bars |
| `--on-img`, `--scrim`, `--under-img` | Text and halos over full-bleed images |

### Modes

- **Theme:** `data-theme="light"` or `"dark"` on `<html>`. When it isn't set, the theme follows the system. Night is the designed default.
- **High contrast:** `data-contrast="high"` on `<html>`. Lines go near black or white, text goes to full contrast, and orbits get brighter. Offer it as a visible toggle.
- **Rev 01** was the original lower-contrast palette. It exists only in the library for comparison and is not part of the package.

### Rules

- Brass fill is reserved for **the single primary action** on a screen.
- Never use a signal colour as decoration. Never let colour be the only carrier of meaning: chips, moods and deltas always say it in words too.
- Never write a literal colour in a component; always use a token.

---

## 3. Type

| Register | Face | Used for |
|---|---|---|
| Serif | Noto Serif | Names and values: entry and card titles, values in readouts, pull quotes, the italic accent word |
| Grotesk | Space Grotesk | Reading and doing: all running text in both voices, interface text, headings on mechanical screens |
| Mono | IBM Plex Mono | Measuring: labels (uppercase, tracked), units, codes, coordinates |

The serif is never used for running text, controls or labels; if a sentence needs reading, it is grotesk.

Labels (`.lbl`) are 10.5px mono, uppercase, with 0.16em tracking. Numbers that line up in columns use tabular figures.

---

## 4. Voices

Every screen speaks one of two voices. Set `data-voice` once, on the screen's outermost element.

| | Mechanical (Datapad) | Prose (Lexicon) |
|---|---|---|
| Body | Space Grotesk 14.5 / 1.5 | Space Grotesk 16.5 / 1.7, about 64 characters per line |
| Headings | Grotesk 600, tight tracking | Noto Serif 400 with mono section numbers |
| Numbers | Tabular everywhere | Proportional in text, tabular in tables |
| Density | Compact: 7px rows, 10px padding | Open: 12px rows, 18px padding |
| Frames | Full-weight lines and plus marks | Hairline lines, smaller plus marks |
| Orbits | Hidden unless opted in | Allowed under the orbit rules |
| Motion | About a third faster, crisper curve | Soft ease-out |

**Insets.** The other voice may appear only as an inset, inside a frame, one level deep:

- On a mechanical screen, lore text goes in a prose inset: `.inset[data-voice="prose"]`, a plain border with open spacing and a "Read the entry →" link.
- On a prose page, a stat block goes in a mechanical inset: `.xf.inset-m[data-voice="mechanical"]`. Its frame softens because it sits inside prose.

---

## 5. Frames

### Vocabulary

| Edge | Class | Meaning | Test |
|---|---|---|---|
| Cross-frame | `.xf` with four `.pl` plus marks | A system: something read or operated as a whole | Do you work it as one thing? |
| Brackets | `.cb` | Attention: the featured object, or the current selection | Is it the one thing to look at? |
| Orbit card | `.oc.orbit` | An entity with an identity in the setting | Does it exist in the world? |
| Hairline cells | A 1px-gap grid | Peers: members of one set | Is it one of many alike? |
| Plain border | `.oc`, `.inset`, `.inp` | A container with no further meaning | None of the above |

### Rules

- **Nesting:** cross-frames nest one level deep. A table may sit inside a panel; nothing goes deeper. Use hairline cells for structure inside that.
- **Mixing:** brackets and orbits may sit inside a cross-frame. A cross-frame never sits inside an orbit card or a bracket.
- **Brackets mean attention**, and a screen has one pair. While something is selected (`.att`), the featured plate gives up its brackets.
- Leave about 10px of room around a cross-frame, because its lines overshoot the edges by that much.

### Line grammar

| Line | Means |
|---|---|
| Solid | Structure and confirmed fact. Every divider, frame and underline by default |
| Dashed | Provisional: derived, estimated, unverified, hidden or draft (`.chip.c-pre`, `.chip.hol`, `.prov`, stale frames) |
| Dotted orbit | Illustration only. Orbits never carry state on their own |

---

## 6. Orbits

Orbits are what make Astrobox recognisable, and also what wears out fastest. They are rationed.

### Where

- **Allowed:** entity cards (worlds, factions, ships, people), the one featured object on a screen (bracket plate, image plate, hero), and pull quotes.
- **Never:** tables, forms, controls, navigation, toasts, lists, thumbnails, or anything inside a cross-frame table.
- **Mechanical screens:** hidden by default. Opt an element in with `data-orbit-optin`.

### Budget

- One visible orbit field per viewport: one featured orbit, or one row of entity cards, never both.
- At most two rings and one satellite per element.
- **To go beyond the budget**, define orbits on as many elements as needed but add `data-orbit-reveal="hover"`. Only the element under the pointer or keyboard focus shows its orbit, and on touch screens the card nearest the middle of the screen lights up.
- During development, `Astrobox.auditOrbits()` warns when more than one always-on orbit field is visible.

### Seeding

`data-orbit="auto"` generates the orbit from a seed. The seed is `data-entity` (the record's ID) when present; otherwise it is the element's text. The same seed always draws the same orbit, on every device. The card orbit and the record's glyph share their tilt.

### Mood

`data-mood` is the interface between app state and the visuals: `neutral`, `nominal`, `strained`, `damaged`, `unverified` or `hidden`. It colours the satellite and tints the rings. Set the attribute directly or call `Astrobox.setMood(el, mood)`; either way an `astro:mood` event fires. A mood outside the set can be given a colour through `--mood`. The mood must also appear in words, for example as a chip.

### With images

| Mode | Attribute | Use for |
|---|---|---|
| Behind | `data-orbit-mode="behind"` (default) | Cards with an inset image. A 5px knockout ring lets the dashes tuck under the picture |
| Over | `data-orbit-mode="over"` | Full-bleed images. Light dash over a dark halo, half-speed drift |
| Ring | `data-orbit-mode="ring"` | A featured image as the planet. The orbit passes behind it, then in front |
| Plain | no orbit, `.oc.plain` | Galleries, handouts, long lists. The image sits flush and nothing decorates it |

---

## 7. Glyphs

A glyph is a small identity mark for a **record**: anything with an ID in the database.

- **Kind sets the shape:** world is a disc, ship a chevron, station a square, person a ring, faction a hexagon.
- **The ID seeds the rest:** the tilt and openness of each ring, a second ring that crosses the first (sometimes broken by a gap), one to three satellites of different sizes, and a small detail on the core. Renaming a record keeps its glyph. The name is only a fallback seed.
- **Small glyphs simplify:** at 16–18px a glyph keeps one ring and one satellite; under 40px, two of each; core details appear from 40px. A record keeps its shape at every size.
- **Mood colours the orbits and the first satellite**; the core and the other satellites stay ink or dim, so one colour carries the state and the kind always reads. A glyph inherits its card's mood.
- **Card and glyph match:** a card's seeded orbit shares the glyph's tilt, crosses a second orbit when the glyph has a second ring, and carries a second satellite when the glyph does. To check a campaign's IDs for look-alikes, run `Astrobox.auditGlyphs(ids, kind)`.
- **Records only:** never add glyphs by matching names in rendered text. Only markup that references the record gets one.

### Placement

| Context | Glyph | Rule |
|---|---|---|
| Entity card header | Yes, 24px | Only the card's own record, before the title. Exactly one |
| Entry header | Yes, 96px | A standalone mark beside the title block, never inside the heading |
| Hero lines, display headlines | Never | Display type makes a statement |
| Section headings | Never | Headings name topics, not records |
| Prose and mechanical text | First linked mention, 16px | Only where the name links to its record. Once per record per article |
| Quotes | Attribution only | Never inside the quote |
| Lists, tables, crews, results | Every row, 16–24px | In the name column, on every row or none. A list mixing records with plain items shows none |
| Image slots | Fallback | Stands in when a record's picture is missing, labelled with its name |
| Toasts, notifications | Subject, 16px | The record the message is about, at the start |
| Chips, buttons, labels, captions, footnotes, contents | Never | They already carry state or structure |
| No access | Never | A seeded glyph would let players link withheld mentions |

Next to a name, a glyph is hidden from screen readers (`aria-hidden`). Standing in for an image, it carries the name (`data-name`).

---

## 8. Units

Write the raw value once in a `<data class="u">` element and the kit sets it: tabular digits, a narrow no-break space, the unit in small mono, in the viewer's locale. A German reader sees `12.400 cr` and `1,6 AU`.

| Kind | Markup | Renders |
|---|---|---|
| Quantity | `value="1.6" data-unit="AU"` | 1.6 AU |
| Pool | `data-kind="pool" value="14" data-max="20"` | 14/20 |
| Range | `data-kind="range" value="2" data-to="4" data-unit="days"` | 2–4 days |
| Estimate | `data-kind="est" value="40000" data-source="…"` | ≈ 40,000, dashed underline |
| Delta | `data-kind="delta" value="-1" data-unit="strain" data-since="…"` | −1 strain, coloured, true minus sign |
| Hex | `data-kind="hex" value="0405"` | Hex 0405 |
| Bearing | `data-kind="bearing" value="41"` | 041° |
| Credits | `data-kind="cr" value="12400"` | 12,400 cr |
| Prefix unit | `data-kind="pre" data-unit="TL" value="4"` | TL4 |
| Dice | `data-kind="dice" value="2d6+1"` | 2d6+1 |
| Time | `data-kind="time" value="14" data-day="212" data-real="2026-10-23"` | Day 212 · Session 14 |

### Tooltip rule

A value gets a tooltip **only when it adds information the reader can't already see**: a real-world conversion (AU to km), the source of an estimate, a roll's average and range, the real date of an in-world time, or the baseline of a change. Never restate what the value already says ("Between 2 and 4 days"). If there is nothing to add, leave the tooltip out. Register app-specific units with `Astrobox.units.register(name, label, convert)` only when `convert` adds something.

---

## 9. Components

| Group | Classes |
|---|---|
| Labels and utility | `.lbl`, `.lbl.b`, `.cap`, `.mono`, `.serif`, `.dim`, `.num`, `.hatch` |
| Frames | `.xf`, `.xf-h`, `.xf-t`, `.xf-b`, `.pl.tl/.tr/.bl/.br`, `.cb`, `.oc`, `.oc.orbit`, `.ov` |
| Buttons | `.btn`, `.btn.pri` (one per screen), `.btn.q` (quiet), `.btn.danger`, `.key` with `aria-pressed` |
| Inputs | `.field`, `label`, `.inp`, `.selw` around `select.inp`, `textarea.inp`, `.hint` |
| Choices | `.seg` (sliding indicator), `.ck` checkbox, `.swt` switch, `input.sl` slider, `.tabs` |
| Status | `.chip` with `.c-ok`, `.c-warn`, `.c-bad`, `.c-pre`, `.c-acc`, `.c-dim`; `.chip.hol` for hidden |
| Feedback | `.toast`, `.errbar`, `.errbar.ok` |
| Progress | `.dprog` (discrete), `.cells` meter, `.stp` stepper, `.gauge` |
| Tables | `.xf.xt` with `.xr`, `.xhd`, `.xc`, `.xc.n` (numeric); `.acc` matrix with `.lv-E/A/V/N` |
| Readouts | `.stats`, `.dos` dossier, `.kv`, `.kvm`, `.spec` trace |
| Media | `.media`, `.oc.mc`, `.oc.cover`, `.oc.plain`, `.ifig`, `.iplate`, `.tlist` with `.ti` |
| Prose | `.prose` with `.toc`, `.body`, `.marg`; `.lead`, `.drop`, `.pq`, `.lex`, `.exit`, `.path`, `.ledger` |
| Selection | `.att` with `.att-i` (attention brackets) |

**Progress rule:** count things that come in units as units. A smooth bar is for quantities, never for steps.

---

## 10. Prose pages

- **Contents rail:** `nav.toc[data-toc="#body"]` follows the reader. Passed sections get a brass edge, the current one a highlight, and a segmented bar tracks progress. On phones it becomes a sticky strip.
- **Footnotes** sit in the right margin (`.marg`) on wide screens and below the text on narrow ones.
- **Figures** float beside the text (`.ifig`) with a mono caption.
- **Redaction** (section 11) is how secrets appear in running text.

---

## 11. States

Every component keeps its shape in every state, so nothing jumps when data arrives, fails or is withheld.

| State | Treatment | Copy pattern |
|---|---|---|
| Empty | The frame stays. One sentence names what will appear, one action adds the first item. Orbit cards keep the rings but lose the satellite. Tables keep the header row | "No fittings logged yet." + "Log a fitting →" |
| Loading | Hatched skeleton (`.sk`) in the shape of the coming content, only after 300ms, swapped in without moving anything | No text, no spinner |
| Error | Rose edge (`.errbar`). What went wrong, how to fix it, Retry. No apology, no error code up front | "Couldn't reach the Datapad server. Check the connection, then retry." |
| Stale | When a refresh fails but older data exists, keep it and mark it provisional: `.xf.stale` turns lines dashed. Show the last good sync time | "Last synced 19:42." |
| No access | Existence and length, never content. The server sends word lengths (`data-words="7 6"`); each word becomes a bar and real spaces stay, so withheld text wraps like text. One line gives the reason | "Revealed in session." |

**Security:** the real words of withheld text must never be sent to a viewer who may not see them. Not in the HTML, not hidden by CSS, not in a search index.

---

## 12. Motion

| Token | Prose | Mechanical | For |
|---|---|---|---|
| `--t-press` | 120ms | 80ms | Button and key press |
| `--t-swap` | 240ms | 160ms | Content replacing content: toasts, tooltips, skeleton to data |
| `--t-settle` | 450ms | 300ms | Moving to a resting place: indicators, brackets, accordions |
| `--t-draw` | 800ms | 530ms | Construction lines drawing in, once |
| `--t-pop` | 380ms | 250ms | Plus marks after the lines. The only overshoot |
| `--t-count` | 600ms | 400ms | A live value stepping to its new number |
| `--t-drift` | 40–90s | 40–90s | Orbits, linear, paused offscreen |
| `--t-wait` | 300ms | 300ms | Delay before any loading state |

Curves: `--ease` is `cubic-bezier(.2,.7,.2,1)` in prose and `cubic-bezier(.2,0,0,1)` in mechanical. `--ease-pop` belongs to plus marks only.

- **May move:** frames drawing in once (the first time they enter the viewport), indicators settling, content swapping in place, live values counting, orbits drifting.
- **Never moves:** layout around the reader, text being read, anything on hover except a tooltip, parallax, any bounce other than plus marks.
- **Counting:** a changed value steps one unit at a time and its cell meter fills or empties in step. A large jump takes the same total time, so it never drags (`Astrobox.count(el, to)`).
- **Reduced motion:** movement, scaling and drift stop. Frames and indicators appear in place, values change at once, and short opacity fades remain.

---

## 13. Accessibility checklist

- Every colour signal is also a word.
- Focus is always visible (2px brass outline).
- Glyphs next to names are `aria-hidden`; glyphs standing in for images have a name.
- Orbits are decorative and hidden from screen readers.
- Redaction bars announce "withheld, N words".
- Tooltips open on keyboard focus as well as hover.
- High-contrast mode is offered, not hidden.
- Reduced motion is respected everywhere.

## 14. Writing

- Name things by what people recognise, not how the system is built.
- Use active voice. A control says what happens ("Plot course"), and the confirmation says it happened ("Course plotted").
- Errors say what went wrong and how to fix it, without apology.
- Labels are short mono nouns; values are specific. Prefer "6 / 11 jumps" to "In progress".
