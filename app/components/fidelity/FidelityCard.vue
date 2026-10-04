<!-- components/fidelity/FidelityCard.vue -->
<template>
  <div
    class="group relative overflow-hidden rounded-xl p-5 border-2 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[220px] select-none"
    :class="getCardTheme(card.color_gradient)"
  >
    <!-- Paper Texture Fiber Overlay -->
    <div class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] dark:opacity-[0.08] pointer-events-none" />

    <!-- Card Header -->
    <div class="relative z-10 flex items-start justify-between gap-3 border-b border-stone-900/10 dark:border-stone-100/10 pb-3">
      <div>
        <span class="text-[9px] font-mono font-bold uppercase tracking-widest opacity-60 block">
          {{ cardTitleText }}
        </span>
        <h3 class="text-base font-black tracking-tight truncate max-w-[180px] text-stone-900 dark:text-stone-100 mt-0.5">
          {{ card.customer_name }}
        </h3>
        <p class="text-[10px] font-mono opacity-60">
          {{ cardText.toUpperCase() }} #{{ card.card_code }}
        </p>
      </div>

      <!-- Stamp Counter & Completed Badge -->
      <div class="flex flex-col items-end gap-1">
        <div class="px-2.5 py-0.5 rounded-md bg-stone-900/10 dark:bg-stone-100/10 border border-stone-900/10 dark:border-stone-100/10 text-[10px] font-mono font-bold">
          {{ card.current_visits }} / {{ card.target_visits }}
        </div>
        <span
          v-if="card.current_visits >= card.target_visits"
          class="px-2 py-0.5 rounded-md bg-amber-800 text-stone-50 dark:bg-amber-500 dark:text-stone-950 font-bold text-[9px] uppercase tracking-wider animate-pulse"
        >
          {{ completedText.toUpperCase() }}!
        </span>
      </div>
    </div>

    <!-- Middle: Reward Milestone & Printed Paper Stamp Circles -->
    <div class="relative z-10 my-3">
      <div class="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between opacity-80">
        <span class="truncate pr-2 flex items-center gap-1.5">
          <Icon name="lucide:gift" class="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
          {{ card.reward_title }}
        </span>
        <span class="font-mono text-[9px]">{{ Math.round((card.current_visits / card.target_visits) * 100) }}%</span>
      </div>

      <!-- Printed Cardstock Stamp Grid -->
      <div
        class="grid gap-2 p-3 rounded-lg border border-dashed border-stone-900/20 dark:border-stone-100/20 bg-stone-900/[0.03] dark:bg-stone-100/[0.03]"
        :class="getGridColsClass(card.target_visits)"
      >
        <div
          v-for="index in card.target_visits"
          :key="index"
          class="aspect-square rounded-full flex items-center justify-center text-[10px] font-bold transition-all relative border"
          :class="[
            index <= card.current_visits
              ? 'bg-amber-900/90 text-amber-50 dark:bg-amber-400 dark:text-stone-950 border-amber-950 dark:border-amber-300 shadow-xs rotate-[-8deg] scale-105'
              : 'border-dashed border-stone-900/30 dark:border-stone-100/30 text-stone-400 dark:text-stone-600'
          ]"
        >
          <template v-if="index <= card.current_visits">
            <Icon name="lucide:stamp" class="w-3.5 h-3.5 opacity-90 stroke-[2.5]" />
          </template>
          <template v-else>
            <span class="text-[9px] font-mono opacity-50">{{ index }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Actions Row -->
    <div class="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-stone-900/10 dark:border-stone-100/10">
      <!-- Edit & Delete Buttons -->
      <div class="flex items-center gap-1">
        <button
          @click="$emit('edit', card)"
          class="p-1.5 text-stone-500 hover:text-amber-800 dark:text-stone-400 dark:hover:text-amber-400 hover:bg-stone-900/10 dark:hover:bg-stone-100/10 rounded-md transition-colors cursor-pointer"
          title="Edit Card Details"
        >
          <Icon name="lucide:pencil" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', card.id)"
          class="p-1.5 text-stone-500 hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-400 hover:bg-stone-900/10 dark:hover:bg-stone-100/10 rounded-md transition-colors cursor-pointer"
          title="Delete Card"
        >
          <Icon name="lucide:trash-2" class="w-4 h-4" />
        </button>
      </div>

      <!-- Stamp Control Buttons (+1 / -1 / Claim) -->
      <div class="flex items-center gap-1.5">
        <button
          v-if="card.current_visits >= card.target_visits"
          @click="$emit('claim', card)"
          class="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 text-stone-50 dark:text-stone-950 font-bold rounded-lg text-xs transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
          <span>{{ claimAndResetText }}</span>
        </button>

        <template v-else>
          <!-- Decrement (-1 Stamp) Button -->
          <button
            @click="$emit('unstamp', card)"
            :disabled="card.current_visits <= 0"
            class="px-2.5 py-1.5 bg-stone-900/10 hover:bg-stone-900/20 dark:bg-stone-100/15 dark:hover:bg-stone-100/25 disabled:opacity-30 font-bold rounded-lg text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 border border-stone-900/10 dark:border-stone-100/15"
            title="Remove 1 Stamp"
          >
            <Icon name="lucide:minus" class="w-3.5 h-3.5" />
          </button>

          <!-- Increment (+1 Stamp) Button -->
          <button
            @click="$emit('stamp', card)"
            class="px-3 py-1.5 bg-stone-900/10 hover:bg-stone-900/20 dark:bg-stone-100/15 dark:hover:bg-stone-100/25 font-bold rounded-lg text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border border-stone-900/10 dark:border-stone-100/15"
          >
            <Icon name="lucide:stamp" class="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>+1 {{ stampText }}</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const cardTitleText = t('fidelity.cardTitle')
const cardText = t('fidelity.card')
const stampText = t('fidelity.stamp')
const completedText = t('fidelity.completed')
const claimAndResetText = t('fidelity.claimAndReset')

export interface LoyaltyCardData {
  id: string
  customer_name: string
  card_code: string
  target_visits: number
  current_visits: number
  reward_title: string
  color_gradient: string
}

defineProps<{
  card: LoyaltyCardData
}>()

defineEmits(['stamp', 'unstamp', 'claim', 'edit', 'delete'])

const getGridColsClass = (targetVisits: number) => {
  return targetVisits === 20 ? 'grid-cols-10' : 'grid-cols-5'
}

const getCardTheme = (preset: string) => {
  switch (preset) {
    case 'terracotta':
      return 'bg-orange-100/80 dark:bg-stone-900 border-orange-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
    case 'caramel':
      return 'bg-amber-100/80 dark:bg-stone-900 border-amber-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
    case 'matcha':
      return 'bg-emerald-100/70 dark:bg-stone-900 border-emerald-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
    case 'espresso':
      return 'bg-stone-800 dark:bg-stone-900 border-stone-700 text-stone-100'
    case 'latte':
    default:
      return 'bg-stone-200/80 dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100'
  }
}
</script>
