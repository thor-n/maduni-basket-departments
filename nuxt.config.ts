export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    // Pre-render all pages statically
    '/**': { prerender: true },
    // Proxy API routes
    '/api/v3/**': { 
      proxy: 'https://cphapp.rema1000.dk/api/v3/**',
      cors: true 
    }
  },
  ssr: false,
  // Add Tailwind module
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Ensure CSS is loaded
  css: [
    '~/assets/css/main.css'
  ],

  // Tailwind configuration
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config.ts',
    viewer: true
  },

  // PostCSS configuration
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },

  runtimeConfig: {
    public: {
      // Full external URL as fallback
      apiBase: 'https://cphapp.rema1000.dk/api/v3',
      apiKey: 'N6a8Vzkb9SrPGxw5WDDv7yGYGceakC9Y'
    }
  },

  // Nitro configuration for API proxy and CORS
  nitro: {
    // Explicitly set up API proxy
    routeRules: {
      '/api/v3/**': { 
        proxy: 'https://cphapp.rema1000.dk/api/v3/**',
        cors: true
      }
    },
    // Add a fallback for static generation
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/departments'
      ]
    }
  },

  compatibilityDate: '2025-02-05'
})
