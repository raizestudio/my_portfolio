<!-- pages/fidelity/index.vue -->
<template>
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300 pb-16 selection:bg-amber-700 selection:text-stone-50"
    >
      <!-- Navbar -->
      <FidelityNavbar
        :user="user"
        @open-modal="openCreateModal"
        @logout="handleLogout"
      />

      <main class="max-w-7xl mx-auto px-4 py-6 sm:px-8 space-y-8">
        <!-- Dashboard Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs">
          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Icon name="lucide:trending-up" class="w-6 h-6 text-amber-700 dark:text-amber-500" />
              Merchant Analytics & Performance
            </h1>
            <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Overview of customer retention, active stamp programs, and total reward redemptions.
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <button
              @click="openCreateModal"
              class="px-4 py-2 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-stone-50 text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="lucide:plus" class="w-4 h-4" />
              <span>Issue Card</span>
            </button>
            <NuxtLink
              to="/fidelity/cards"
              class="px-4 py-2 bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-2xl border border-stone-300 dark:border-stone-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="lucide:credit-card" class="w-4 h-4" />
              <span>Manage Cards</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Primary KPI Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Customers -->
          <div class="p-5 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span class="text-xs font-bold uppercase tracking-wider">Total Customers</span>
              <Icon name="lucide:users" class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            </div>
            <div class="text-2xl font-black text-stone-900 dark:text-stone-100">
              {{ cards.length }}
            </div>
            <p class="text-[11px] text-stone-500 dark:text-stone-400">Active digital pass holders</p>
          </div>

          <!-- Total Stamps Issued -->
          <div class="p-5 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span class="text-xs font-bold uppercase tracking-wider">Stamps Issued</span>
              <Icon name="lucide:stamp" class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            </div>
            <div class="text-2xl font-black text-stone-900 dark:text-stone-100">
              {{ totalVisitsStamped }}
            </div>
            <p class="text-[11px] text-stone-500 dark:text-stone-400">Cumulative store visits logged</p>
          </div>

          <!-- Total Redemptions -->
          <div class="p-5 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span class="text-xs font-bold uppercase tracking-wider">Rewards Claimed</span>
              <Icon name="lucide:gift" class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            </div>
            <div class="text-2xl font-black text-stone-900 dark:text-stone-100">
              {{ totalRedemptionsCount }}x
            </div>
            <p class="text-[11px] text-stone-500 dark:text-stone-400">Total completed rewards given</p>
          </div>

          <!-- Average Completion -->
          <div class="p-5 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-2">
            <div class="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span class="text-xs font-bold uppercase tracking-wider">Avg Progress</span>
              <Icon name="lucide:pie-chart" class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            </div>
            <div class="text-2xl font-black text-stone-900 dark:text-stone-100">
              {{ averageCompletion }}%
            </div>
            <p class="text-[11px] text-stone-500 dark:text-stone-400">Average card completion rate</p>
          </div>
        </div>

        <!-- Program Breakdown & Readiness Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Reward Program Tiers Distribution -->
          <div class="p-6 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <Icon name="lucide:layers" class="w-4 h-4 text-amber-700 dark:text-amber-400" />
              Program Tier Breakdown
            </h3>

            <div class="space-y-3">
              <!-- Express (5 Stamps) -->
              <div>
                <div class="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>Express Pass (5 Stamps)</span>
                  <span class="font-mono text-stone-500">{{ expressTiersCount }} Cards</span>
                </div>
                <div class="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-amber-700 dark:bg-amber-500 transition-all duration-500"
                    :style="{ width: cards.length ? `${(expressTiersCount / cards.length) * 100}%` : '0%' }"
                  />
                </div>
              </div>

              <!-- Standard (10 Stamps) -->
              <div>
                <div class="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>Standard Pass (10 Stamps)</span>
                  <span class="font-mono text-stone-500">{{ standardTiersCount }} Cards</span>
                </div>
                <div class="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-amber-700 dark:bg-amber-500 transition-all duration-500"
                    :style="{ width: cards.length ? `${(standardTiersCount / cards.length) * 100}%` : '0%' }"
                  />
                </div>
              </div>

              <!-- VIP (20 Stamps) -->
              <div>
                <div class="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>VIP Pass (20 Stamps)</span>
                  <span class="font-mono text-stone-500">{{ vipTiersCount }} Cards</span>
                </div>
                <div class="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-amber-700 dark:bg-amber-500 transition-all duration-500"
                    :style="{ width: cards.length ? `${(vipTiersCount / cards.length) * 100}%` : '0%' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Reward Claims Alert Box -->
          <div class="p-6 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Icon name="lucide:sparkles" class="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  Pending Rewards Status
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                  {{ rewardsReadyCount }} Ready
                </span>
              </div>
              <p class="text-xs text-stone-500 dark:text-stone-400">
                Customers who have reached their visit target are ready to claim their rewards in-store.
              </p>
            </div>

            <!-- List of cards ready to claim -->
            <div v-if="readyToClaimCards.length > 0" class="space-y-2 my-2 max-h-36 overflow-y-auto pr-1">
              <div
                v-for="readyCard in readyToClaimCards"
                :key="readyCard.id"
                class="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs"
              >
                <div>
                  <span class="font-bold block text-stone-900 dark:text-stone-100">{{ readyCard.customer_name }}</span>
                  <span class="text-[10px] font-mono text-stone-500">{{ readyCard.reward_title }}</span>
                </div>
                <NuxtLink
                  to="/fidelity/cards"
                  class="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl text-[10px] font-bold transition-all shrink-0"
                >
                  Redeem
                </NuxtLink>
              </div>
            </div>

            <div v-else class="py-6 text-center text-xs text-stone-400 font-mono">
              No rewards are currently awaiting redemption.
            </div>

            <NuxtLink
              to="/fidelity/cards"
              class="w-full py-2 bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-2xl text-center block transition-all"
            >
              View All Loyalty Cards →
            </NuxtLink>
          </div>
        </div>
      </main>

      <!-- Issue / Edit Card Modal -->
      <FidelityModal
        v-if="isModalOpen"
        :is-submitting="isSubmitting"
        :card-to-edit="cardToEdit"
        @close="isModalOpen = false"
        @save="handleSaveCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { LoyaltyCardData } from "~/components/fidelity/FidelityCard.vue";

definePageMeta({
  layout: false,
  middleware: [
    () => {
      const user = useSupabaseUser();
      if (!user.value) return navigateTo("/fidelity/login");
    },
  ],
});

const { isDark } = useTheme();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const cards = ref<LoyaltyCardData[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const cardToEdit = ref<LoyaltyCardData | null>(null);

const getValidUserId = async () => {
  if (user.value?.id) return user.value.id;
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  cards.value = [];
  navigateTo("/fidelity/login");
};

const fetchCards = async () => {
  const userId = await getValidUserId();
  if (!userId) return;

  isLoading.value = true;
  const { data, error } = await supabase
    .from("fidelity_cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && data) {
    cards.value = data;
  }
  isLoading.value = false;
};

const openCreateModal = () => {
  cardToEdit.value = null;
  isModalOpen.value = true;
};

const handleSaveCard = async (formData: any) => {
  const userId = await getValidUserId();
  if (!userId) {
    navigateTo("/fidelity/login");
    return;
  }

  isSubmitting.value = true;

  const payload = {
    customer_name: formData.customer_name?.trim(),
    customer_email: formData.customer_email?.trim() || null,
    customer_phone: formData.customer_phone?.trim() || null,
    target_visits: Number(formData.target_visits) || 10,
    reward_title: formData.reward_title?.trim() || "Free Reward",
    color_gradient: formData.color_gradient || "latte",
  };

  try {
    const cardCode = `FC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCardRecord = {
      ...payload,
      card_code: cardCode,
      current_visits: 0,
      redemptions_count: 0,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("fidelity_cards")
      .insert([newCardRecord])
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      cards.value.unshift(data[0]);
    } else {
      cards.value.unshift({ id: `card_${Date.now()}`, ...newCardRecord });
    }

    isModalOpen.value = false;
  } catch (err: any) {
    alert(`Could not save card: ${err.message || 'Database error'}`);
  } finally {
    isSubmitting.value = false;
  }
};

// Computed KPI Calculations
const totalVisitsStamped = computed(() =>
  cards.value.reduce((acc, c) => acc + (c.current_visits || 0), 0)
);

const totalRedemptionsCount = computed(() =>
  cards.value.reduce((acc, c) => acc + (c.redemptions_count || 0), 0)
);

const rewardsReadyCount = computed(
  () => cards.value.filter((c) => c.current_visits >= c.target_visits).length
);

const readyToClaimCards = computed(() =>
  cards.value.filter((c) => c.current_visits >= c.target_visits)
);

const averageCompletion = computed(() => {
  if (cards.value.length === 0) return 0;
  const sumPercent = cards.value.reduce(
    (acc, c) => acc + c.current_visits / c.target_visits,
    0
  );
  return Math.round((sumPercent / cards.value.length) * 100);
});

const expressTiersCount = computed(() => cards.value.filter((c) => c.target_visits === 5).length);
const standardTiersCount = computed(() => cards.value.filter((c) => c.target_visits === 10).length);
const vipTiersCount = computed(() => cards.value.filter((c) => c.target_visits === 20).length);

watch(user, (newUser) => {
  if (!newUser) navigateTo("/fidelity/login");
  else fetchCards();
});

onMounted(() => {
  fetchCards();
});

useHead({
  title: "Merchant Analytics Dashboard | Loyalty Card Manager",
});
</script>
