import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "nuxt-ai-ready",
  ],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  routeRules: {
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
      ],
    },
  },
  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,

    public: {},
  },
});
