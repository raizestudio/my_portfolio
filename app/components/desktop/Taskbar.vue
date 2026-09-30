<!-- components/desktop/Taskbar.vue -->
<template>
  <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-50">
    <div
      ref="dockRef"
      class="flex items-end gap-1 px-3 pb-2 pt-2.5 bg-slate-900/40 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <button
        v-for="(win, index) in windows"
        :key="win.id"
        :ref="(el) => (iconRefs[index] = el)"
        @click="handleDockClick(win)"
        class="group relative flex flex-col items-center justify-end focus:outline-none origin-bottom transition-all duration-75 ease-out"
        :class="{ 'animate-bounce-dock': bouncingId === win.id }"
        :style="getIconStyle(index)"
      >
        <!-- Dynamic Tooltip -->
        <div class="absolute -top-11 px-3 py-1 bg-slate-900/90 border border-white/15 text-white text-[12px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl backdrop-blur-md whitespace-nowrap z-50">
          {{ win.title }}
        </div>

        <!-- Dock Icon Tile -->
        <div
          class="w-12 h-12 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-200 group-hover:border-white/40 group-active:scale-95"
          :class="activeWindowId === win.id ? 'ring-2 ring-white/30 shadow-sky-500/20' : ''"
        >
          <Icon :name="win.icon" class="w-7 h-7 text-white drop-shadow-md" />
        </div>

        <!-- Active / Running Indicator -->
        <div class="h-1.5 flex items-center justify-center mt-1">
          <span
            v-if="win.isOpen"
            class="w-1 h-1 rounded-full transition-all duration-300"
            :class="[
              activeWindowId === win.id
                ? 'w-3 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                : 'bg-white/60'
            ]"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'

const { windows, activeWindowId, openWindow, toggleMinimize, focusWindow } = useWindowManager()

const dockRef = ref(null)
const iconRefs = ref([])
const mouseX = ref(null)
const bouncingId = ref(null)

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
}

const handleMouseLeave = () => {
  mouseX.value = null
}

const getIconStyle = (index) => {
  const defaultStyle = {
    transform: 'scale(1) translateY(0px)',
    margin: '0 4px',
    zIndex: 1
  }

  if (mouseX.value === null || !iconRefs.value[index]) {
    return defaultStyle
  }

  const el = iconRefs.value[index]
  const rect = el.getBoundingClientRect()
  const iconCenterX = rect.left + rect.width / 2

  const distance = Math.abs(mouseX.value - iconCenterX)
  const maxDistance = 160 // Mouse distance sensitivity radius

  if (distance > maxDistance) {
    return defaultStyle
  }

  // Scale factor (1.0 to 1.45)
  const scale = 1 + 0.45 * Math.cos((distance / maxDistance) * (Math.PI / 2))
  const translateY = -12 * ((scale - 1) / 0.45)

  // Dynamic horizontal margin pushes adjacent items away dynamically as scale increases
  const dynamicMargin = 4 + (scale - 1) * 14

  return {
    transform: `scale(${scale}) translateY(${translateY}px)`,
    margin: `0 ${dynamicMargin}px`,
    zIndex: Math.round(scale * 10) // Higher scale gets higher z-index stacking
  }
}

const handleDockClick = (win) => {
  if (!win.isOpen) {
    triggerBounce(win.id)
    openWindow(win.id)
  } else if (win.isMinimized) {
    openWindow(win.id)
  } else if (activeWindowId.value === win.id) {
    toggleMinimize(win.id)
  } else {
    focusWindow(win.id)
  }
}

const triggerBounce = (id) => {
  bouncingId.value = id
  setTimeout(() => {
    bouncingId.value = null
  }, 800)
}
</script>

<style scoped>
@keyframes dock-bounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-18px) scale(1.08);
  }
  50% {
    transform: translateY(0) scale(0.95);
  }
  75% {
    transform: translateY(-6px) scale(1.02);
  }
}

.animate-bounce-dock {
  animation: dock-bounce 0.8s ease-in-out infinite;
}
</style>
