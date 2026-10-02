// composables/useTheme.ts
export const useTheme = () => {
  // Shared state with SSR cookie persistence
  const theme = useCookie<'dark' | 'light'>('portfolio-theme', {
    default: () => 'dark',
    path: '/',
  })

  const isDark = computed(() => theme.value === 'dark')

  const syncThemeClass = () => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    syncThemeClass()
  }

  return {
    theme,
    isDark,
    toggleTheme,
    syncThemeClass,
  }
}
