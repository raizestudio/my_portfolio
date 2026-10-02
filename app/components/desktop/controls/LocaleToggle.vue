<!-- components/desktop/controls/LocaleToggle.vue -->
<template>
  <button
    @click="toggleLocale"
    class="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 p-2 rounded-xl flex items-center space-x-2 text-left transition-colors focus:outline-none cursor-pointer w-full select-none"
  >
    <div class="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white shrink-0">
      <Icon name="lucide:languages" class="w-4 h-4" />
    </div>
    <div class="text-[11px] leading-tight min-w-0">
      <div class="font-semibold text-slate-900 dark:text-white truncate">Language</div>
      <div class="text-slate-500 dark:text-slate-400 font-mono truncate">{{ currentLocale.toUpperCase() }}</div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const i18n = useI18n()
const currentLocale = computed(() => i18n.locale.value)

const toggleLocale = () => {
  const nextLocale = i18n.locale.value === 'fr' ? 'en' : 'fr'
  if (typeof i18n.setLocale === 'function') {
    i18n.setLocale(nextLocale)
  } else {
    i18n.locale.value = nextLocale
  }
}
</script>
