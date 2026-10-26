// Loads the Astrobox runtime in the browser and re-initialises it after every page change.
// For markup rendered later (lists, modals), call useNuxtApp().$astrobox.init(el) in onMounted.
declare global {
  interface Window { Astrobox: any; ASTROBOX_MANUAL?: boolean }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  window.ASTROBOX_MANUAL = true
  await import('../dist/astrobox.js')
  const Astrobox = window.Astrobox

  nuxtApp.hook('app:mounted', () => Astrobox.init(document))
  nuxtApp.hook('page:finish', () => Astrobox.init(document))

  return { provide: { astrobox: Astrobox } }
})
