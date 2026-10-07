<!-- pages/fidelity/index.vue -->
<template>
    <div :class="{ dark: isDark }">
        <div
            class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300 pb-16 selection:bg-amber-700 selection:text-stone-50"
        >
            <!-- Navbar -->
            <FidelityNavbar @open-modal="openCreateModal" />

            <main class="max-w-7xl mx-auto px-4 py-6 sm:px-8 space-y-6">
                <!-- Metrics Dashboard -->
                <FidelityMetrics
                    :total-customers="cards.length"
                    :total-stamped="totalVisitsStamped"
                    :rewards-count="rewardsReadyCount"
                    :avg-completion="averageCompletion"
                />

                <!-- Search & Filter Bar -->
                <div
                    class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-100 dark:bg-stone-900/90 p-3 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm"
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

                <!-- Empty State -->
                <div
                    v-if="filteredCards.length === 0"
                    class="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-3xl"
                >
                    <div
                        class="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center text-amber-800 dark:text-amber-400"
                    >
                        <Icon name="lucide:coffee" class="w-8 h-8" />
                    </div>
                    <h3
                        class="text-sm font-bold text-stone-900 dark:text-stone-100"
                    >
                        {{ noCardsText }}
                    </h3>
                    <p
                        class="text-xs text-stone-500 dark:text-stone-400 max-w-xs"
                    >
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
import { ref, computed, onMounted } from "vue";
import type { LoyaltyCardData } from "~/components/fidelity/FidelityCard.vue";

const { t } = useI18n();

const allText = t("fidelity.all");
const activeText = t("fidelity.active");
const readyText = t("fidelity.ready");
const rewardReadyText = t("fidelity.rewardReady");
const noCardsText = t("fidelity.noCards");
const noCardsIssueNewText = t("fidelity.noCardsIssueNew");
const createCardText = t("fidelity.createCard");
const searchCardsText = t("fidelity.searchCards");

definePageMeta({ layout: false });

const { isDark } = useTheme();
const searchQuery = ref("");
const activeFilter = ref("all");
const cards = ref<LoyaltyCardData[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const cardToEdit = ref<LoyaltyCardData | null>(null);

let supabase: any = null;

const filterOptions = [
    { value: "all", text: allText },
    { value: "active", text: activeText },
    { value: "ready", text: readyText },
];

const totalVisitsStamped = computed(() => {
    return cards.value.reduce((acc, c) => acc + (c.current_visits || 0), 0);
});

const rewardsReadyCount = computed(() => {
    return cards.value.filter((c) => c.current_visits >= c.target_visits)
        .length;
});

const averageCompletion = computed(() => {
    if (cards.value.length === 0) return 0;
    const sumPercent = cards.value.reduce(
        (acc, c) => acc + c.current_visits / c.target_visits,
        0,
    );
    return Math.round((sumPercent / cards.value.length) * 100);
});

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
                (c.card_code || "").toLowerCase().includes(q),
        );
    }

    return list;
});

const fetchCards = async () => {
    isLoading.value = true;
    if (supabase) {
        const { data, error } = await supabase
            .from("fidelity_cards")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            cards.value = data;
        }
    } else {
        cards.value = [
            {
                id: "1",
                customer_name: "Camille Bernard",
                card_code: "FC-1082",
                target_visits: 5,
                current_visits: 4,
                reward_title: "Free Artisanal Cookie",
                color_gradient: "terracotta",
            },
            {
                id: "2",
                customer_name: "Lucas Dupont",
                card_code: "FC-4921",
                target_visits: 10,
                current_visits: 10,
                reward_title: "Free Oat Milk Latte & Croissant",
                color_gradient: "latte",
            },
            {
                id: "3",
                customer_name: "Sophie Moreau",
                card_code: "FC-8830",
                target_visits: 20,
                current_visits: 12,
                reward_title: "VIP Gift & Free Brunch Combo",
                color_gradient: "caramel",
            },
        ];
    }
    isLoading.value = false;
};

const stampVisit = async (card: LoyaltyCardData) => {
    if (card.current_visits >= card.target_visits) return;
    card.current_visits++;

    if (supabase) {
        await supabase
            .from("fidelity_cards")
            .update({ current_visits: card.current_visits })
            .eq("id", card.id);
    }
};

const unstampVisit = async (card: LoyaltyCardData) => {
    if (card.current_visits <= 0) return;
    card.current_visits--;

    if (supabase) {
        await supabase
            .from("fidelity_cards")
            .update({ current_visits: card.current_visits })
            .eq("id", card.id);
    }
};

const claimReward = async (card: LoyaltyCardData) => {
    card.current_visits = 0;

    if (supabase) {
        await supabase
            .from("fidelity_cards")
            .update({ current_visits: 0 })
            .eq("id", card.id);
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
    isSubmitting.value = true;

    if (cardToEdit.value) {
        // EDIT EXISTING CARD
        const updatedPayload = {
            customer_name: formData.customer_name,
            target_visits: formData.target_visits,
            reward_title: formData.reward_title,
            color_gradient: formData.color_gradient,
            // Clamp current visits if target was reduced below current
            current_visits: Math.min(
                cardToEdit.value.current_visits,
                formData.target_visits,
            ),
        };

        if (supabase) {
            await supabase
                .from("fidelity_cards")
                .update(updatedPayload)
                .eq("id", cardToEdit.value.id);
        }

        Object.assign(cardToEdit.value, updatedPayload);
    } else {
        // CREATE NEW CARD
        const cardCode = `FC-${Math.floor(1000 + Math.random() * 9000)}`;
        const newPayload = {
            customer_name: formData.customer_name,
            card_code: cardCode,
            target_visits: formData.target_visits,
            current_visits: 0,
            reward_title: formData.reward_title,
            color_gradient: formData.color_gradient,
        };

        if (supabase) {
            const { data, error } = await supabase
                .from("fidelity_cards")
                .insert([newPayload])
                .select();

            if (!error && data) {
                cards.value.unshift(data[0]);
            }
        } else {
            cards.value.unshift({ id: `demo_${Date.now()}`, ...newPayload });
        }
    }

    isSubmitting.value = false;
    isModalOpen.value = false;
};

const deleteCard = async (id: string) => {
    if (supabase) {
        await supabase.from("fidelity_cards").delete().eq("id", id);
    }
    cards.value = cards.value.filter((c) => c.id !== id);
};

onMounted(() => {
    if (import.meta.client) {
        try {
            supabase = useSupabaseClient();
        } catch {}
        fetchCards();
    }
});

useHead({
    title: "Joel Pinho - Loyalty Card Manager | Merchant Demo",
    titleTemplate: "%s",
    meta: [
        {
            name: "description",
            content:
                "Explore the demo loyalty card manager for merchants by Joel Pinho. Streamline customer retention, digital stamps, and rewards with a modern web interface.",
        },
    ],
});
</script>
