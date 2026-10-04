<!-- components/fidelity/FidelityMetrics.vue -->
<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
    <div class="p-4 sm:p-5 bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm transition-colors">
      <div class="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
        <span class="text-xs font-semibold">{{ activeCustomersText }}</span>
        <div class="p-1.5 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400">
          <Icon name="lucide:users" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">{{ totalCustomers }}</div>
    </div>

    <div class="p-4 sm:p-5 bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm transition-colors">
      <div class="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
        <span class="text-xs font-semibold">{{ stampsGivenText }}</span>
        <div class="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
          <Icon name="lucide:stamp" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">{{ totalStamped }}</div>
    </div>

    <div class="p-4 sm:p-5 bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm transition-colors">
      <div class="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
        <span class="text-xs font-semibold">{{ rewardsClaimableText }}</span>
        <div class="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-400">
          <Icon name="lucide:gift" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">{{ rewardsCount }}</div>
    </div>

    <div class="p-4 sm:p-5 bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm transition-colors">
      <div class="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1">
        <span class="text-xs font-semibold">{{ overallProgressText }}</span>
        <div class="p-1.5 rounded-xl bg-amber-200/50 dark:bg-stone-800 text-amber-900 dark:text-amber-300">
          <Icon name="lucide:sparkles" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">{{ avgCompletion }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const activeCustomersText = t('fidelity.activeCustomers')
const stampsGivenText = t('fidelity.stampsGiven')
const rewardsClaimableText = t('fidelity.rewardsClaimable')
const overallProgressText = t('fidelity.overallProgress')

defineProps<{
  totalCustomers: number
  totalStamped: number
  rewardsCount: number
  avgCompletion: number
}>()
</script>
