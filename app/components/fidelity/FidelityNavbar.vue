<!-- components/fidelity/FidelityNavbar.vue -->
<template>
  <header
    class="sticky top-0 z-40 bg-stone-100/90 dark:bg-stone-900/90 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 px-4 py-3 sm:px-8 transition-colors"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Left Header Brand -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="flex items-center p-2.5 bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl transition-all hover:scale-105 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100"
          title="Back to Desktop"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5" />
        </NuxtLink>

        <div>
          <div class="flex items-center gap-2">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
            >
              ☕ {{ titleText }}
            </span>
            <h1
              class="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 tracking-tight"
            >
              {{ descriptionText }}
            </h1>
          </div>
          <p class="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
            {{ descriptionLongText }}
          </p>
        </div>
      </div>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2.5">
        <!-- Segmented Locale Switcher (FR / EN) -->
        <div
          class="flex items-center bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl p-1 text-xs font-bold"
        >
          <button
            @click="switchLocale('fr')"
            class="px-2.5 py-1 rounded-xl transition-all cursor-pointer select-none"
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
            class="px-2.5 py-1 rounded-xl transition-all cursor-pointer select-none"
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
          class="flex items-center p-2 bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-2xl text-stone-700 dark:text-amber-400 hover:scale-105 transition-all cursor-pointer"
          :title="
            isDark
              ? 'Switch to Warm Light Mode'
              : 'Switch to Dark Espresso Mode'
          "
        >
          <Icon
            :name="isDark ? 'lucide:sun' : 'lucide:moon'"
            class="w-4 h-4"
          />
        </button>

        <!-- New Card Trigger Button -->
        <button
          @click="$emit('open-modal')"
          class="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-stone-50 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Icon name="lucide:heart-handshake" class="w-4 h-4" />
          <span>{{ newCardText }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { isDark, toggleTheme } = useTheme();
const { t, locale, setLocale } = useI18n();

// 1. Wrap i18n calls in computed() so text updates reactively when switching languages
const titleText = computed(() => t("fidelity.title"));
const descriptionText = computed(() => t("fidelity.description"));
const descriptionLongText = computed(() => t("fidelity.descriptionLong"));
const newCardText = computed(() => t("fidelity.newCard"));

const switchLocale = (lang: "fr" | "en") => {
  if (locale.value === lang) return;
  if (typeof setLocale === "function") {
    setLocale(lang);
  } else {
    locale.value = lang;
  }
};

defineEmits(["open-modal"]);
</script>
