<!-- components/fidelity/FidelityModal.vue -->
<template>
  <div class="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div class="w-full max-w-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-3xl p-6 space-y-5 shadow-2xl text-stone-900 dark:text-stone-100">
      <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h2 class="text-sm font-extrabold flex items-center gap-2">
            <Icon :name="cardToEdit ? 'lucide:pencil' : 'lucide:heart-handshake'" class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            {{ cardToEdit ? editLoyaltyCardText : issueLoyaltyCardText }}
          </h2>
          <p class="text-[11px] text-stone-500 dark:text-stone-400">
            {{ cardToEdit ? editLoyaltyCardDescriptionText : issueLoyaltyCardDescriptionText }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 p-1 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-bold mb-1">{{ customerIdentifyText }}</label>
          <input
            v-model="form.customer_name"
            type="text"
            required
            placeholder="e.g. Marie Laurent"
            class="w-full bg-stone-100 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
          />
        </div>

        <!-- Target Visit Goal -->
        <div>
          <label class="block text-xs font-bold mb-1.5">{{ targetGoalText }}</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="target in [5, 10, 20]"
              :key="target"
              type="button"
              @click="setTarget(target)"
              class="py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              :class="[
                form.target_visits === target
                  ? 'bg-amber-700 dark:bg-amber-600 border-amber-800 text-stone-50 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-950 border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              ]"
            >
              <span class="text-sm font-extrabold">{{ target }} {{ stampText }}s</span>
              <span class="text-[10px] font-medium opacity-80">
                {{ target === 5 ? 'Express' : target === 10 ? 'Standard' : 'VIP Pass' }}
              </span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold mb-1">{{ rewardDescriptionText }}</label>
          <input
            v-model="form.reward_title"
            type="text"
            required
            placeholder="e.g. Free Artisanal Coffee & Croissant"
            class="w-full bg-stone-100 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
          />
        </div>

        <!-- Card Style Theme -->
        <div>
          <label class="block text-xs font-bold mb-2">{{ cardThemeText }}</label>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="preset in colorPresets"
              :key="preset.id"
              type="button"
              @click="form.color_gradient = preset.id"
              class="h-9 rounded-2xl border flex items-center justify-center transition-all cursor-pointer"
              :class="[
                preset.class,
                form.color_gradient === preset.id ? 'ring-2 ring-amber-700 dark:ring-amber-400 scale-105 shadow-xs' : 'opacity-70 hover:opacity-100'
              ]"
            >
              <span class="text-[10px] font-bold">{{ preset.shortName }}</span>
            </button>
          </div>
        </div>

        <div class="pt-3 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
          >
            {{ cancelText }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-stone-50 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {{ cardToEdit ? saveChangesText : issueLoyaltyCardText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { LoyaltyCardData } from './FidelityCard.vue'

const props = defineProps<{
  isSubmitting: boolean
  cardToEdit?: LoyaltyCardData | null
}>()

const { t } = useI18n()

const editLoyaltyCardText = t('fidelity.editLoyaltyCard')
const issueLoyaltyCardText = t('fidelity.issueLoyaltyCard')
const editLoyaltyCardDescriptionText = t('fidelity.editLoyaltyCardDescription')
const issueLoyaltyCardDescriptionText = t('fidelity.issueLoyaltyCardDescription')
const customerIdentifyText = t('fidelity.customerIdentify')
const targetGoalText = t('fidelity.targetGoal')
const stampText = t('fidelity.stamp')
const rewardDescriptionText = t('fidelity.rewardDescription')
const cardThemeText = t('fidelity.cardTheme')
const cancelText = t('fidelity.cancel')
const saveChangesText = t('fidelity.saveChanges')
const defaultFreeRewardText = t('fidelity.defaultFreeReward')
const defaultFiveStampsRewardText = t('fidelity.defaultFiveStampsReward')
const defaultTenStampsRewardText = t('fidelity.defaultTenStampsReward')
const defaultTwentyStampsRewardText = t('fidelity.defaultTwentyStampsReward')

const emit = defineEmits(['close', 'save'])

const form = ref({
  customer_name: '',
  target_visits: 10,
  reward_title: defaultFreeRewardText,
  color_gradient: 'latte'
})

const colorPresets = [
  { id: 'latte', shortName: 'Latte', class: 'bg-stone-200 text-stone-900 border-stone-300' },
  { id: 'terracotta', shortName: 'Terra', class: 'bg-orange-200 text-orange-950 border-orange-300' },
  { id: 'caramel', shortName: 'Caramel', class: 'bg-amber-200 text-amber-950 border-amber-300' },
  { id: 'matcha', shortName: 'Matcha', class: 'bg-emerald-200 text-emerald-950 border-emerald-300' },
  { id: 'espresso', shortName: 'Mocha', class: 'bg-stone-800 text-stone-100 border-stone-700' }
]

const setTarget = (target: number) => {
  form.value.target_visits = target
  if (!props.cardToEdit) {
    if (target === 5) form.value.reward_title = defaultFiveStampsRewardText
    else if (target === 10) form.value.reward_title = defaultTenStampsRewardText
    else if (target === 20) form.value.reward_title = defaultTwentyStampsRewardText
  }
}

onMounted(() => {
  if (props.cardToEdit) {
    form.value = {
      customer_name: props.cardToEdit.customer_name,
      target_visits: props.cardToEdit.target_visits,
      reward_title: props.cardToEdit.reward_title,
      color_gradient: props.cardToEdit.color_gradient || 'latte'
    }
  }
})

const handleSubmit = () => {
  if (!form.value.customer_name.trim()) return
  emit('save', { ...form.value })
}
</script>
