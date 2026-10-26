// Astrobox as a Nuxt layer.
// In an app:  export default defineNuxtConfig({ extends: ['github:YOUR-USER/astrobox#v1.0.0'] })
// or, after `npm install github:YOUR-USER/astrobox#v1.0.0`:  extends: ['astrobox']
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
