<!-- components/desktop/NotificationCenter.vue -->
<template>
  <Transition name="nc-slide">
    <div
      v-if="isOpen"
      class="fixed top-8 right-2 sm:right-3 w-80 sm:w-[360px] max-h-[calc(100vh-3rem)] overflow-y-auto  p-3 text-slate-100 z-[150] space-y-3 font-sans transition-colors duration-200 custom-scrollbar transform-gpu"
    >
      <!-- Header Title -->
      <div class="flex items-center justify-between px-1 text-slate-100 font-semibold text-xs">
        <span>Centre de notifications</span>
        <button
          @click="$emit('close')"
          class="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Top Notification Banner -->
      <div class="bg-white/10 dark:bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 text-xs text-slate-200 space-y-1">
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <div class="flex items-center gap-1.5 font-medium">
            <Icon name="logos:instagram-icon" class="w-3.5 h-3.5" />
            <span>Instagram</span>
          </div>
          <span class="text-[10px]">Hier, 21:38</span>
        </div>
        <div class="font-medium text-[11px] text-slate-300">via www.instagram.com</div>
        <div class="text-[11px] text-slate-400">Vous avez des notifications en attente.</div>
      </div>

      <!-- Row 1: Calendar (1x1) + Weather (1x1) -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Calendar Widget -->
        <div class="bg-slate-900/90 border border-white/10 rounded-[22px] p-3.5 flex flex-col justify-between aspect-square">
          <div>
            <div class="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{{ currentDayName }}</div>
            <div class="text-3xl font-extrabold text-white leading-none mt-0.5">{{ currentDayNumber }}</div>
          </div>
          <div class="text-[11px] text-slate-400">Aucun évènement</div>
        </div>

        <!-- Weather Widget -->
        <div class="bg-slate-300/80 dark:bg-slate-700/60 backdrop-blur-md border border-white/10 rounded-[22px] p-3.5 flex flex-col justify-between aspect-square text-slate-900 dark:text-slate-100">
          <div>
            <div class="text-xs font-medium opacity-80">Nantes</div>
            <div class="text-3xl font-extrabold leading-none mt-0.5">18°</div>
          </div>
          <div>
            <div class="flex items-center gap-1 text-[11px] font-medium opacity-90">
              <Icon name="lucide:cloud" class="w-3.5 h-3.5" />
              <span>Nuageux</span>
            </div>
            <div class="text-[10px] opacity-70 font-mono mt-0.5">↑ 21° ↓ 12°</div>
          </div>
        </div>
      </div>

      <!-- Row 2: Screen Time Widget (2x1 Wide) -->
      <div class="bg-slate-900/80 border border-white/10 rounded-[22px] p-3.5 text-slate-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">🐙</span>
            <span class="text-base font-bold">14h 55min</span>
          </div>
          <div class="space-y-1 text-[10px] text-slate-400">
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-amber-500"></span> 2h 12min</div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-rose-500"></span> 1h 42min</div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-sm bg-sky-500"></span> 1h 08min</div>
          </div>
        </div>
        <div class="flex items-end gap-1 h-12 pt-3 px-1 border-b border-white/10 pb-1">
          <div v-for="(h, i) in [20, 35, 45, 10, 25, 60, 80, 95, 40, 65, 50, 30]" :key="i" class="flex-1 bg-sky-500/80 rounded-t" :style="{ height: `${h}%` }"></div>
        </div>
        <div class="flex justify-between text-[9px] text-slate-500 font-mono pt-1">
          <span>00 h</span><span>06 h</span><span>12 h</span>
        </div>
      </div>

      <!-- Row 3: Batteries (1x1) + BoursOBank / Finance (1x1) -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Batteries 4 Rings Widget -->
        <div class="bg-slate-900/80 border border-white/10 rounded-[22px] p-3 grid grid-cols-2 gap-2 aspect-square items-center justify-items-center">
          <div class="relative w-9 h-9 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-emerald-400" stroke-width="3.5" stroke-dasharray="88, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <Icon name="lucide:laptop" class="w-3.5 h-3.5 text-white absolute" />
          </div>
          <div class="relative w-9 h-9 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-emerald-400" stroke-width="3.5" stroke-dasharray="100, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <Icon name="lucide:headphones" class="w-3.5 h-3.5 text-white absolute" />
          </div>
          <div class="relative w-9 h-9 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-emerald-400" stroke-width="3.5" stroke-dasharray="75, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <Icon name="lucide:disc" class="w-3.5 h-3.5 text-white absolute" />
          </div>
          <div class="relative w-9 h-9 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-800" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-[#27c93f]" stroke-width="3.5" stroke-dasharray="90, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <Icon name="lucide:mouse" class="w-3.5 h-3.5 text-white absolute" />
          </div>
        </div>

        <!-- BoursOBank Widget -->
        <div class="bg-slate-900/80 border border-white/10 rounded-[22px] p-3.5 flex flex-col justify-between aspect-square text-slate-200">
          <div class="flex justify-between items-start">
            <span class="text-[11px] font-semibold text-slate-400">BoursoBank</span>
            <Icon name="lucide:navigation" class="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <div class="text-xl font-bold text-emerald-400 font-mono">3152,85 €</div>
            <div class="text-[9px] text-slate-500 font-mono mt-1">au {{ formattedShortDate }} à {{ formattedTimeNoSec }}</div>
          </div>
        </div>
      </div>

      <!-- Row 4: GitHub Contribution Heatmap (2x1 Wide) -->
      <div class="bg-slate-900/80 border border-white/10 rounded-[22px] p-3 space-y-1.5">
        <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span class="flex items-center gap-1.5 text-slate-200 font-semibold">
            <Icon name="lucide:github" class="w-3.5 h-3.5 text-emerald-400" />
            GitHub Contributions
          </span>
          <span class="text-[10px] text-emerald-400">428 commits</span>
        </div>
        <div class="grid grid-rows-5 grid-flow-col gap-1 pt-1 justify-between overflow-hidden">
          <div v-for="n in 110" :key="n" class="w-2.5 h-2.5 rounded-xs" :class="getHeatmapColor(n)"></div>
        </div>
      </div>

      <!-- Row 5: Strava Fitness Activity (2x1 Wide) -->
      <div class="bg-slate-900/80 border border-white/10 rounded-[22px] p-3.5 flex items-center justify-between text-slate-200">
        <div class="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path class="text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="text-[#FC4C02]" stroke-width="3" stroke-dasharray="78, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="absolute text-center leading-tight">
            <div class="text-base font-extrabold font-mono">31,26</div>
            <div class="text-[9px] text-slate-400 font-mono">km</div>
          </div>
        </div>

        <div class="flex-1 ml-4 space-y-2">
          <div class="flex justify-between items-center text-[10px] text-slate-400">
            <span>Cette semaine</span>
            <Icon name="lucide:flame" class="w-3.5 h-3.5 text-[#FC4C02]" />
          </div>
          <!-- Bar Chart Container -->
          <div class="flex items-end gap-1.5 h-10 pt-1">
            <div
              v-for="(day, idx) in ['L','M','M','J','V','S','D']"
              :key="idx"
              class="flex-1 h-full flex flex-col justify-end items-center gap-1"
            >
              <div class="w-full flex-1 flex items-end bg-white/5 rounded-xs overflow-hidden">
                <div
                  class="w-full bg-[#FC4C02] rounded-xs transition-all"
                  :style="{ height: `${[40, 80, 20, 60, 90, 15, 5][idx]}%` }"
                ></div>
              </div>
              <span class="text-[9px] text-slate-400 font-mono leading-none">{{ day }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Pill Action -->
      <div class="pt-1 flex items-center justify-center gap-2">
        <button class="bg-white/10 hover:bg-white/20 text-slate-200 px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border border-white/10 transition-colors cursor-pointer">
          Modifier les widgets
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(["close"]);

const currentDayName = ref("VENDREDI");
const currentDayNumber = ref(2);
const formattedTimeNoSec = ref("");
const formattedShortDate = ref("");
let timer: ReturnType<typeof setInterval>;

const getHeatmapColor = (n: number) => {
  const colors = [
    "bg-slate-800",
    "bg-emerald-900/60",
    "bg-emerald-700/80",
    "bg-emerald-500",
    "bg-emerald-400"
  ];
  return colors[n % colors.length];
};

const updateWidgetTimes = () => {
  const now = new Date();
  currentDayNumber.value = now.getDate();
  currentDayName.value = now.toLocaleDateString("fr-FR", { weekday: "long" }).toUpperCase();

  formattedTimeNoSec.value = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  formattedShortDate.value = now.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });
};

onMounted(() => {
  updateWidgetTimes();
  timer = setInterval(updateWidgetTimes, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.nc-slide-enter-active,
.nc-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.nc-slide-enter-from,
.nc-slide-leave-to {
  opacity: 0;
  transform: translateX(16px) scale(0.96);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.2);
  border-radius: 9999px;
}
</style>
