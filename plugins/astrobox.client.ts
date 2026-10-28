// Loads the Astrobox runtime in the browser. It initialises the document once hydration has finished,
// never during it, so Vue compares against the server's markup, and again after each client-side
// page change. Options are in app.config.ts under `astrobox`.
// For markup rendered later (lists, modals), call useNuxtApp().$astrobox.init(el) in onMounted.
declare global {
  interface Window { Astrobox: any; ASTROBOX_MANUAL?: boolean }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  window.ASTROBOX_MANUAL = true
  await import('../dist/astrobox.js')
  const Astrobox = window.Astrobox
  const opts = (useAppConfig() as any).astrobox || {}

  // Before the first init, so units render once, in the locale the server used.
  if (opts.locale) Astrobox.fmt.locale = opts.locale

  let started = false
  const init = () => { started = true; Astrobox.init(document) }
  // Hydration ends with app:suspense:resolve. Without server rendering there is nothing to hydrate.
  if (nuxtApp.isHydrating) nuxtApp.hooks.hookOnce('app:suspense:resolve', init)
  else nuxtApp.hooks.hookOnce('app:mounted', init)
  // page:finish also fires while the first page hydrates; only later page changes re-initialise.
  nuxtApp.hook('page:finish', () => { if (started && opts.initOnPageChange !== false) init() })

  return { provide: { astrobox: Astrobox } }
})
