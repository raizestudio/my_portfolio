<!-- components/desktop/controls/ThemeToggle.vue -->
<template>
  <button
    @click="toggleTheme"
    class="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 p-2 rounded-xl flex items-center space-x-2 text-left transition-colors focus:outline-none cursor-pointer w-full select-none"
  >
    <div
      class="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 transition-colors"
      :class="theme === 'dark' ? 'bg-indigo-600' : 'bg-amber-500'"
    >
      <Icon
        :name="theme === 'dark' ? 'lucide:moon' : 'lucide:sun'"
        class="w-4 h-4"
      />
    </div>
    <div class="text-[11px] leading-tight min-w-0">
      <div class="font-semibold text-slate-900 dark:text-white truncate">Theme</div>
      <div class="text-slate-500 dark:text-slate-400 capitalize truncate">{{ theme }}</div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'

// Auto-imported by @vueuse/nuxt module
const theme = useLocalStorage<'dark' | 'light'>('portfolio-theme', 'dark')

const syncHtmlClass = (currentTheme: 'dark' | 'light') => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', currentTheme === 'dark')
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

watch(theme, (newTheme) => {
  syncHtmlClass(newTheme)
})

onMounted(() => {
  syncHtmlClass(theme.value)
})
</script>
