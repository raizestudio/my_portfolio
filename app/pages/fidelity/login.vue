<!-- pages/fidelity/login.vue -->
<template>
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300 flex flex-col items-center justify-center p-4 selection:bg-amber-700 selection:text-stone-50"
    >
      <div
        class="w-full max-w-md p-6 sm:p-8 bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xl backdrop-blur-xl"
      >
        <!-- Header -->
        <div class="text-center space-y-2 mb-6">
          <div class="inline-flex p-3 bg-amber-100 dark:bg-stone-800 rounded-2xl text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-stone-700">
            <Icon name="lucide:store" class="w-6 h-6" />
          </div>
          <h1 class="text-xl font-black tracking-tight text-stone-900 dark:text-stone-100">
            {{ isSignUp ? 'Create Merchant Account' : 'Merchant Sign In' }}
          </h1>
          <p class="text-xs text-stone-500 dark:text-stone-400">
            Sign in to access your merchant dashboard and loyalty cards.
          </p>
        </div>

        <!-- Auth Error Alert -->
        <div
          v-if="authError"
          class="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
        >
          <Icon name="lucide:alert-circle" class="w-4 h-4 shrink-0" />
          <span>{{ authError }}</span>
        </div>

        <!-- Auth Form -->
        <form @submit.prevent="handleAuth" class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="merchant@cafe.com"
              class="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 dark:focus:border-amber-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 dark:focus:border-amber-500 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="isAuthLoading"
            class="w-full py-2.5 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 disabled:opacity-50 text-stone-50 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Icon v-if="isAuthLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <span>{{ isSignUp ? 'Sign Up' : 'Sign In' }}</span>
          </button>
        </form>

        <!-- Toggle Sign In / Sign Up -->
        <div class="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-center text-xs">
          <button
            @click="isSignUp = !isSignUp; authError = ''"
            class="text-amber-800 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
          >
            {{ isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

definePageMeta({ layout: false });

const { isDark } = useTheme();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const email = ref("");
const password = ref("");
const isSignUp = ref(false);
const isAuthLoading = ref(false);
const authError = ref("");

// Automatically redirect to /fidelity if already authenticated
watchEffect(() => {
  if (user.value) {
    navigateTo("/fidelity");
  }
});

const handleAuth = async () => {
  isAuthLoading.value = true;
  authError.value = "";

  try {
    if (isSignUp.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
    }
    navigateTo("/fidelity");
  } catch (err: any) {
    authError.value = err.message || "Authentication failed.";
  } finally {
    isAuthLoading.value = false;
  }
};

useHead({
  title: "Merchant Sign In | Loyalty Card Manager",
});
</script>
