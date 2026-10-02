// plugins/theme.ts
export default defineNuxtPlugin((nuxtApp) => {
  const { theme, syncThemeClass } = useTheme()

  // Set HTML class on server-side rendering to eliminate FOUC
  useHead({
    htmlAttrs: {
      class: computed(() => (theme.value === 'dark' ? 'dark' : '')),
    },
  })

  // Synchronize class immediately on client hydration
  if (import.meta.client) {
    nuxtApp.hook('app:mounted', () => {
      syncThemeClass()
    })

    watch(theme, () => {
      syncThemeClass()
    })
  }
})
