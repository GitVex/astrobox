/* Astrobox token configuration: the single place to change fonts, sizes, motion and the default accent.
   Colour tokens are derived from `accent` by src/palette.js; run `npm run build` after editing. */
export default {
 accent: { acc: '#f5a524', tint: null, ok: null, warn: null, bad: null, pre: null },
 presets: { signal: '#f5a524', command: '#ff6a33', astra: '#d3b777' },
 fontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
 fonts: {
  display: "'Noto Serif', Georgia, 'Times New Roman', serif",
  body: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace"
 },
 sizes: { label: '10.5px', small: '13.5px', mech: '14.5px', body: '15px', prose: '16.5px', lead: '20px', h4: '22px', h3: '21px', h2: '30px', value: '24px', display: 'clamp(54px, 9vw, 104px)' },
 structure: { ext: '10px', gutter: '16px', hair: '1px', radius: '0', 'v-row': '11px', 'v-pad': '16px', 'grid-size': '56px' },
 motion: {
  prose: { ease: 'cubic-bezier(.2,.7,.2,1)', 't-press': '120ms', 't-swap': '240ms', 't-settle': '450ms', 't-draw': '800ms', 't-pop': '380ms', 't-count': '600ms' },
  mechanical: { ease: 'cubic-bezier(.2,0,0,1)', 't-press': '80ms', 't-swap': '160ms', 't-settle': '300ms', 't-draw': '530ms', 't-pop': '250ms', 't-count': '400ms' },
  shared: { 'ease-pop': 'cubic-bezier(.3,1.25,.5,1)', 't-drift': '40s', 't-drift-slow': '60s', 't-drift-over': '90s', 't-wait': '300ms' }
 },
 density: { mechanical: { 'v-row': '7px', 'v-pad': '10px' }, prose: { 'v-row': '12px', 'v-pad': '18px' } },
 imageOverlay: { 'on-img': 'rgba(255,246,226,.94)', 'on-img-dim': 'rgba(255,246,226,.74)', 'under-img': 'rgba(4,6,9,.6)', 'scrim': 'rgba(4,6,9,.84)' },
 roles: {
  '--bg': 'Ground', '--grid': 'Survey grid lines', '--panel': 'Frames and cells', '--panel2': 'Insets and raised cells', '--hov': 'Hover fill',
  '--ln': 'Construction lines', '--ln2': 'Hairlines and segment gaps', '--txt': 'Body text', '--dim': 'Secondary text', '--faint': 'Tertiary text and placeholders',
  '--brass': 'Accent fill: primary action, focus, plus marks, orbits', '--brass-txt': 'Accent as text', '--on-brass': 'Text on accent fill', '--pc': 'Plus-mark colour',
  '--jade': 'Signal: nominal, valid, active', '--ember': 'Signal: strained, low, scrambled', '--oxide': 'Signal: damaged, anomaly, denied', '--iris': 'Signal: predicted, unverified',
  '--orb': 'Orbit stroke', '--orb2': 'Secondary orbit stroke', '--orbf': 'Faint orbit stroke', '--flash': 'Accent wash for highlights',
  '--planet-hi': 'Planet highlight', '--planet-lo': 'Planet shadow', '--bar': 'Redaction bars'
 }
};
