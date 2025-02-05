export default defineNuxtConfig({

  // Add this for GitHub Pages deployment
  app: {
    baseURL: '/maduni-basket-departments/', // Replace with your repo name
  },
  
  // Other existing configurations...
  ssr: false, // Important for static site generation
  
  // Ensure static generation
  nitro: {
    preset: 'github-pages'
  },

  devtools: { enabled: true },

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

  runtimeConfig: {
    public: {
      apiBase: 'https://cphapp.rema1000.dk/api/v3',
      apiKey: 'N6a8Vzkb9SrPGxw5WDDv7yGYGceakC9Y'
    }
  },

  // Nitro configuration for API proxy
  nitro: {
    preset: 'github-pages',
    routeRules: {
      '/api/v3/**': { 
        proxy: 'https://cphapp.rema1000.dk/api/v3/**',
        cors: true
      }
    }
  },

  compatibilityDate: '2025-02-05'
})
