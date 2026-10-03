import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "nuxt-ai-ready",
    "@nuxt/fonts",
    "@vercel/analytics",
    "@vercel/speed-insights",
    "@nuxtjs/supabase",
  ],
  css: ["~/assets/css/main.css"],
  features: {
    inlineStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // drop: ["console", "debugger"],
      rolldownOptions: {
        output: {
          minify: true,
          codeSplitting: true,
        },
      },
      cssCodeSplit: true,
      target: "esnext",
    },
    optimizeDeps: {
      include: ["vue", "highlight.js", "tslib"],
    },
  },
  build: {
    transpile: ["tslib"],
  },
  nitro: {
    externals: {
      inline: ["tslib", "@supabase/auth-js"],
    },
  },
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true,
    buildCache: true,
  },
  icon: {
    mode: "css",
    serverBundle: {
      collections: ["lucide", "simple-icons", "ri"], // Pre-bundle these on the server
    },
  },
  routeRules: {
    "/": { isr: 3600 },
    "/api/export-pdf": {
      isr: false,
    },
  },
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "fr", language: "fr-FR", file: "fr.json" },
    ],
    defaultLocale: "fr",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
    },
    langDir: "locales/",
    strategy: "prefix_except_default",
  },
  site: {
    url: "https://joelpinho.fr",
    name: "Joel PINHO | Portfolio",
  },
  aiReady: {
    contentSignal: {
      aiTrain: true,
      search: true,
      aiInput: true,
    },
    runtimeSync: true,
    llmsTxt: {
      markdownLinks: true,

      sections: [
        {
          title: "Portfolio",
          description:
            "Portfolio interactif de Joel PINHO, développeur Full-stack, présentant son parcours, son CV, ses compétences, ses projets et ses informations de contact.",

          links: [
            {
              title: "Portfolio interactif",
              description:
                "Interface de portfolio conçue comme un environnement de bureau inspiré de macOS. Les contenus sont accessibles via des fenêtres et applications interactives.",
              href: "https://joelpinho.fr",
            },
          ],
        },

        {
          title: "Interactive IDE",
          description:
            "Le portfolio contient un éditeur de code inspiré de Zed, intégré directement dans l'interface.",

          links: [
            {
              title: "Éditeur Python",
              description:
                "Éditeur de code exécutant Python directement dans le navigateur avec Pyodide et WebAssembly.",
              href: "https://joelpinho.fr",
            },
          ],
        },

        {
          title: "Interactive tools",
          description:
            "Le portfolio contient également des outils interactifs, notamment un lanceur de dés, en complément des applications dédiées au CV, aux projets et au contact.",

          links: [
            {
              title: "Portfolio",
              href: "https://joelpinho.fr",
            },
          ],
        },
      ],
    },
  },
  supabase: {
    redirect: false,
  },
  app: {
    head: {
      // htmlAttrs: {
      //   lang: "fr",
      // },
      // title: "Joel PINHO | Portfolio",
      meta: [
        {
          name: "description",
          content: "Portfolio de Joel PINHO, développeur Full-stack.",
        },
        {
          name: "og:title",
          content: "Joel PINHO | Portfolio",
        },
        {
          name: "og:description",
          content: "Portfolio de Joel PINHO, développeur Full-stack.",
        },
        {
          property: "og:image",
          content: "https://joelpinho.fr/assets/images/profile.webp",
        },
        // { property: "og:url", content: "https://joelpinho.fr" },
        {
          name: "twitter:title",
          content: "Joel PINHO | Portfolio",
        },
        {
          name: "twitter:description",
          content: "Portfolio de Joel PINHO, développeur Full-stack.",
        },
        {
          name: "twitter:image",
          content: "https://joelpinho.fr/assets/images/profile.webp",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/favicon-192x192.png",
        },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "preconnect", href: "https://cdn.jsdelivr.net" },
      ],
    },
  },
  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,

    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
});
