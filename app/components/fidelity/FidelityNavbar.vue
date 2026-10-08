<!-- components/fidelity/FidelityNavbar.vue -->
<template>
  <header
    class="sticky top-0 z-40 bg-stone-100/90 dark:bg-stone-900/90 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 px-3 py-2.5 sm:px-8 sm:py-3 transition-colors"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
      <!-- Left Header Brand & Navigation Links -->
      <div class="flex items-center gap-2 sm:gap-4 min-w-0">
        <NuxtLink
          to="/"
          class="flex items-center p-2 sm:p-2.5 bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl transition-all hover:scale-105 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 shrink-0"
          title="Back to Desktop"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4 sm:w-5 sm:h-5" />
        </NuxtLink>

        <!-- Navigation Tabs (Dashboard / Cards) -->
        <nav class="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl text-xs font-bold">
          <NuxtLink
            to="/fidelity"
            exact
            class="px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            :class="
              route.path === '/fidelity'
                ? 'bg-amber-700 dark:bg-amber-600 text-stone-50 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
            "
          >
            <Icon name="lucide:layout-dashboard" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/fidelity/cards"
            class="px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            :class="
              route.path.startsWith('/fidelity/cards')
                ? 'bg-amber-700 dark:bg-amber-600 text-stone-50 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
            "
          >
            <Icon name="lucide:credit-card" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Cards</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <!-- Segmented Locale Switcher (FR / EN) -->
        <div
          class="flex items-center bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl p-0.5 sm:p-1 text-[11px] sm:text-xs font-bold"
        >
          <button
            @click="switchLocale('fr')"
            class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl transition-all cursor-pointer select-none"
            :class="
              locale === 'fr'
                ? 'bg-amber-700 dark:bg-amber-600 text-stone-50 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
            "
          >
            FR
          </button>
          <button
            @click="switchLocale('en')"
            class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl transition-all cursor-pointer select-none"
            :class="
              locale === 'en'
                ? 'bg-amber-700 dark:bg-amber-600 text-stone-50 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
            "
          >
            EN
          </button>
        </div>

        <!-- Global Theme Toggle Button -->
        <button
          @click="toggleTheme"
          class="flex items-center p-2 bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl text-stone-700 dark:text-amber-400 hover:scale-105 transition-all cursor-pointer shrink-0"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" class="w-4 h-4" />
        </button>

        <!-- New Card Trigger Button -->
        <button
          @click="$emit('open-modal')"
          class="flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-stone-50 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
          :title="newCardText"
        >
          <Icon name="lucide:heart-handshake" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ newCardText }}</span>
        </button>

        <!-- Logout Button -->
        <button
          v-if="user"
          @click="$emit('logout')"
          class="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-stone-200/80 hover:bg-rose-500/10 dark:bg-stone-800/80 dark:hover:bg-rose-500/20 text-stone-700 hover:text-rose-600 dark:text-stone-300 dark:hover:text-rose-400 border border-stone-300 dark:border-stone-700 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0"
          :title="`Sign Out (${user.email || ''})`"
        >
          <Icon name="lucide:log-out" class="w-4 h-4" />
          <span class="hidden md:inline">{{ user.email?.split('@')[0] }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineProps<{
  user?: any;
}>();

const route = useRoute();
const { isDark, toggleTheme } = useTheme();
const { t, locale, setLocale } = useI18n();

const newCardText = computed(() => t("fidelity.newCard"));

const switchLocale = (lang: "fr" | "en") => {
  if (locale.value === lang) return;
  if (typeof setLocale === "function") {
    setLocale(lang);
  } else {
    locale.value = lang;
  }
};

defineEmits(["open-modal", "logout"]);
</script>
