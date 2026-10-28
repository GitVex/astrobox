// Options for the Astrobox Nuxt layer. Override them in the app's own app.config.ts.
export default defineAppConfig({
  astrobox: {
    // Locale for units, for example 'en-US'. Set it to the locale the server rendered with,
    // so numbers don't change format after hydration. '' follows the browser.
    locale: '',
    // Run Astrobox.init(document) after each client-side page change. Turn it off when
    // components call $astrobox.init(el) for the markup they render.
    initOnPageChange: true,
  },
})
