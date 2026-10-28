// Astrobox as a Nuxt layer. The package's main entry ("." in package.json) points here,
// so after installing it:  export default defineNuxtConfig({ extends: ['astrobox'] })
// or without installing:   extends: ['github:GitVex/astrobox#v1.1.0']
// The browser runtime is the separate entry astrobox/astrobox.js.
import { fileURLToPath } from 'node:url'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineNuxtConfig({
  css: [here('./dist/astrobox.tokens.css'), here('./dist/astrobox.css')],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },
})
