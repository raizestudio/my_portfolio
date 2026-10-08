<!-- pages/fidelity/cards.vue -->
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

      <main class="max-w-7xl mx-auto px-4 py-6 sm:px-8 space-y-6">
        <!-- Search & Filter Controls -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-100 dark:bg-stone-900/90 p-3 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs"
        >
          <div class="relative w-full sm:w-80">
            <Icon
              name="lucide:search"
              class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="searchCardsText"
              class="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 focus:border-amber-700 dark:focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 transition-all"
            />
          </div>

          <!-- Filter Tabs -->
          <div
            class="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto p-1 bg-stone-200/80 dark:bg-stone-950 rounded-2xl border border-stone-300 dark:border-stone-800"
          >
            <button
              v-for="filter in filterOptions"
              :key="filter.value"
              @click="activeFilter = filter.value"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap"
              :class="
                activeFilter === filter.value
                  ? 'bg-amber-700 dark:bg-amber-600 text-stone-50 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
              "
            >
              {{
                filter.value === "ready"
                  ? "🎁 " + rewardReadyText
                  : filter.text
              }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center py-20 text-stone-400 space-y-2"
        >
          <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-amber-700 dark:text-amber-500" />
          <p class="text-xs font-mono">Loading loyalty cards...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredCards.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-3xl"
        >
          <div
            class="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center text-amber-800 dark:text-amber-400"
          >
            <Icon name="lucide:coffee" class="w-8 h-8" />
          </div>
          <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100">
            {{ noCardsText }}
          </h3>
          <p class="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
            {{ noCardsIssueNewText }}
          </p>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-amber-700/10 hover:bg-amber-700/20 border border-amber-700/30 rounded-2xl text-xs font-bold text-amber-800 dark:text-amber-400 transition-all cursor-pointer"
          >
            {{ createCardText }}
          </button>
        </div>

        <!-- Cards Grid -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <FidelityCard
            v-for="card in filteredCards"
            :key="card.id"
            :card="card"
            @stamp="stampVisit"
            @unstamp="unstampVisit"
            @claim="claimReward"
            @edit="openEditModal"
            @delete="deleteCard"
          />
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
const { t } = useI18n();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const searchQuery = ref("");
const activeFilter = ref("all");
const cards = ref<LoyaltyCardData[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const cardToEdit = ref<LoyaltyCardData | null>(null);

const allText = computed(() => t("fidelity.all"));
const activeText = computed(() => t("fidelity.active"));
const readyText = computed(() => t("fidelity.ready"));
const rewardReadyText = computed(() => t("fidelity.rewardReady"));
const noCardsText = computed(() => t("fidelity.noCards"));
const noCardsIssueNewText = computed(() => t("fidelity.noCardsIssueNew"));
const createCardText = computed(() => t("fidelity.createCard"));
const searchCardsText = computed(() => t("fidelity.searchCards"));

const filterOptions = computed(() => [
  { value: "all", text: allText.value },
  { value: "active", text: activeText.value },
  { value: "ready", text: readyText.value },
]);

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

const stampVisit = async (card: LoyaltyCardData) => {
  if (card.current_visits >= card.target_visits) return;

  const userId = await getValidUserId();
  if (!userId) return;

  card.current_visits++;

  const { error } = await supabase
    .from("fidelity_cards")
    .update({ current_visits: card.current_visits })
    .eq("id", card.id);

  if (error) {
    card.current_visits--;
    alert(`Could not add stamp: ${error.message}`);
  }
};

const unstampVisit = async (card: LoyaltyCardData) => {
  if (card.current_visits <= 0) return;

  const userId = await getValidUserId();
  if (!userId) return;

  card.current_visits--;

  const { error } = await supabase
    .from("fidelity_cards")
    .update({ current_visits: card.current_visits })
    .eq("id", card.id);

  if (error) {
    card.current_visits++;
    alert(`Could not remove stamp: ${error.message}`);
  }
};

const claimReward = async (card: LoyaltyCardData) => {
  const userId = await getValidUserId();
  if (!userId) return;

  const previousVisits = card.current_visits;
  const previousRedemptions = card.redemptions_count || 0;
  const newRedemptions = previousRedemptions + 1;

  card.current_visits = 0;
  card.redemptions_count = newRedemptions;

  const { error } = await supabase
    .from("fidelity_cards")
    .update({
      current_visits: 0,
      redemptions_count: newRedemptions,
    })
    .eq("id", card.id);

  if (error) {
    card.current_visits = previousVisits;
    card.redemptions_count = previousRedemptions;
    alert(`Could not claim reward: ${error.message}`);
  }
};

const openCreateModal = () => {
  cardToEdit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (card: LoyaltyCardData) => {
  cardToEdit.value = card;
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
    if (cardToEdit.value) {
      const updatedPayload = {
        ...payload,
        current_visits: Math.min(
          cardToEdit.value.current_visits,
          payload.target_visits
        ),
      };

      const { error } = await supabase
        .from("fidelity_cards")
        .update(updatedPayload)
        .eq("id", cardToEdit.value.id);

      if (error) throw error;

      Object.assign(cardToEdit.value, updatedPayload);
      isModalOpen.value = false;
    } else {
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
    }
  } catch (err: any) {
    alert(`Could not save card: ${err.message || 'Database error occurred.'}`);
  } finally {
    isSubmitting.value = false;
  }
};

const deleteCard = async (id: string) => {
  const userId = await getValidUserId();
  if (!userId) return;

  const { error } = await supabase
    .from("fidelity_cards")
    .delete()
    .eq("id", id);

  if (!error) {
    cards.value = cards.value.filter((c) => c.id !== id);
  } else {
    alert(`Could not delete card: ${error.message}`);
  }
};

const filteredCards = computed(() => {
  let list = cards.value;

  if (activeFilter.value === "active") {
    list = list.filter((c) => c.current_visits < c.target_visits);
  } else if (activeFilter.value === "ready") {
    list = list.filter((c) => c.current_visits >= c.target_visits);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (c) =>
        (c.customer_name || "").toLowerCase().includes(q) ||
        (c.card_code || "").toLowerCase().includes(q) ||
        (c.customer_email || "").toLowerCase().includes(q) ||
        (c.customer_phone || "").includes(q)
    );
  }

  return list;
});

watch(user, (newUser) => {
  if (!newUser) navigateTo("/fidelity/login");
  else fetchCards();
});

onMounted(() => {
  fetchCards();
});

useHead({
  title: "All Loyalty Cards | Merchant Manager",
});
</script>
