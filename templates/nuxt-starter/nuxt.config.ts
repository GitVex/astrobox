// One line brings in tokens, components, fonts and the runtime plugin.
export default defineNuxtConfig({
  extends: ['astrobox'],
  app: { head: { htmlAttrs: { lang: 'en' }, bodyAttrs: { class: 'astro-grid' } } },
})
