import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxtjs/i18n", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "fr", language: "fr-FR", file: "fr.json" },
    ],
    defaultLocale: 'fr',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
  },
  app: {
    head: {
      title: "Joel PINHO | Portfolio",
      meta: [
        {
          name: "description",
          content: "Portfolio de Joel PINHO, développeur Full-stack.",
        },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
});
