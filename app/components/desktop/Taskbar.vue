<!-- components/desktop/Taskbar.vue -->
<template>
  <div class="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-[100] max-w-full px-2 touch-manipulation">
    <!-- Mobile Draggable Floating Toggle Button -->
    <div
      v-if="isMobile && !isMobileDockOpen"
      ref="floatingBtnRef"
      class="fixed bottom-3 z-[100] left-1/2 touch-none select-none"
      :class="isDragging ? 'transition-none' : 'transition-transform duration-300 ease-out'"
      :style="{
        transform: `translate3d(calc(-50% + ${dragX}px), 0, 0)`
      }"
      @pointerdown="handlePointerDown"
      @click="handleFloatingClick"
    >
      <button
        class="flex items-center justify-center bg-slate-900/85 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl text-white text-xs font-medium active:scale-95 transition-all duration-300 ease-in-out shrink-0 cursor-pointer"
        :class="[
          showButtonLabel ? 'px-3.5 h-10 gap-2' : 'w-10 h-10 px-0 gap-0',
          isDragging ? 'transition-none' : ''
        ]"
      >
        <Icon name="lucide:layout-grid" class="w-4 h-4 text-sky-400 shrink-0" />

        <!-- Animated Collapsing Label -->
        <span
          class="whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden pointer-events-none"
          :class="showButtonLabel ? 'max-w-28 opacity-100' : 'max-w-0 opacity-0'"
        >
          Applications
        </span>
      </button>
    </div>

    <!-- macOS Translucent Dock Container -->
    <div
      v-else
      ref="dockRef"
      class="flex items-end gap-0.5 sm:gap-1 px-1.5 sm:px-3 pb-1.5 sm:pb-2 pt-2 sm:pt-2.5 max-w-[calc(100vw-1rem)] sm:max-w-max overflow-x-auto sm:overflow-visible custom-scrollbar-none bg-slate-900/80 sm:bg-slate-900/60 backdrop-blur-3xl backdrop-saturate-180 border border-white/20 ring-1 ring-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-2 duration-200"
      style="-webkit-backdrop-filter: blur(24px) saturate(180%);"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- Mobile Close Dock Arrow -->
      <button
        v-if="isMobile"
        @click="closeMobileDock"
        class="sm:hidden p-2 text-slate-400 hover:text-white shrink-0 my-auto cursor-pointer"
        aria-label="Close dock"
      >
        <Icon name="lucide:chevron-down" class="w-4 h-4" />
      </button>

      <!-- Application Windows Dock Buttons -->
      <button
        v-for="(win, index) in windows"
        :key="win.id"
        :ref="(el) => (iconRefs[index] = el)"
        @click="handleDockClick(win)"
        @contextmenu.prevent="handleContextMenu($event, win)"
        class="group relative flex flex-col items-center justify-end focus:outline-none origin-bottom transition-all duration-75 ease-out select-none cursor-pointer shrink-0"
        :class="{ 'animate-bounce-dock': bouncingId === win.id }"
        :style="getIconStyle(index)"
      >
        <!-- Dynamic Tooltip (Desktop Only) -->
        <div
          class="hidden sm:block absolute -top-11 px-3 py-1 bg-slate-900/90 border border-white/20 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-2xl backdrop-blur-xl whitespace-nowrap z-50"
        >
          {{ win.title }}
        </div>

        <!-- Icon Glass Tile -->
        <div
          class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/20 via-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-200 group-hover:border-white/40 group-active:scale-95"
          :class="activeWindowId === win.id ? 'ring-2 ring-white/40 shadow-sky-500/30' : ''"
        >
          <Icon :name="win.icon" class="w-5 h-5 sm:w-7 sm:h-7 text-white drop-shadow-md" />
        </div>

        <!-- Active / Running Dot Indicator -->
        <div class="h-1 sm:h-1.5 flex items-center justify-center mt-0.5 sm:mt-1">
          <span
            v-if="win.isOpen"
            class="w-1 h-1 rounded-full transition-all duration-300"
            :class="[
              activeWindowId === win.id
                ? 'w-2.5 sm:w-3 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                : 'bg-white/60'
            ]"
          />
        </div>
      </button>

      <!-- Dock Divider Line -->
      <div class="w-px h-7 sm:h-9 bg-white/20 my-auto mx-0.5 sm:mx-1 shrink-0" />

      <!-- System Items (Downloads, Trash) -->
      <button
        v-for="(sys, sIdx) in systemItems"
        :key="sys.id"
        :ref="(el) => (iconRefs[windows.length + sIdx] = el)"
        @click="sys.action()"
        class="group relative flex flex-col items-center justify-end focus:outline-none origin-bottom transition-all duration-75 ease-out select-none cursor-pointer shrink-0"
        :style="getIconStyle(windows.length + sIdx)"
      >
        <div
          class="hidden sm:block absolute -top-11 px-3 py-1 bg-slate-900/90 border border-white/20 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-2xl backdrop-blur-xl whitespace-nowrap z-50"
        >
          {{ sys.title }}
        </div>

        <div
          class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-b border flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-200 group-hover:border-white/40 group-active:scale-95"
          :class="sys.bgClass"
        >
          <Icon :name="sys.icon" :class="sys.iconColor" class="w-4 h-4 sm:w-6 sm:h-6" />
        </div>

        <div class="h-1 sm:h-1.5 mt-0.5 sm:mt-1" />
      </button>
    </div>

    <!-- macOS Right-Click Context Menu -->
    <div
      v-if="contextMenu.visible"
      class="fixed z-[200] w-44 p-1.5 bg-slate-900/90 backdrop-blur-2xl border border-white/20 ring-1 ring-white/10 rounded-xl shadow-2xl text-slate-100 text-[12px] space-y-0.5 transform-gpu"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
    >
      <button
        @click="handleContextAction('open')"
        class="w-full text-left px-2.5 py-1 rounded-lg hover:bg-sky-600 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
      >
        <span>{{ contextMenu.win?.isOpen ? 'Show Window' : 'Open' }}</span>
      </button>
      <button
        v-if="contextMenu.win?.isOpen"
        @click="handleContextAction('minimize')"
        class="w-full text-left px-2.5 py-1 rounded-lg hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
      >
        <span>{{ contextMenu.win?.isMinimized ? 'Unminimize' : 'Minimize' }}</span>
      </button>
      <div v-if="contextMenu.win?.isOpen" class="my-1 border-t border-white/10 mx-1" />
      <button
        v-if="contextMenu.win?.isOpen"
        @click="handleContextAction('quit')"
        class="w-full text-left px-2.5 py-1 rounded-lg hover:bg-rose-600 hover:text-white text-rose-300 transition-colors cursor-pointer"
      >
        <span>Quit</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'

const { windows, activeWindowId, openWindow, closeWindow, toggleMinimize, focusWindow } = useWindowManager()

const dockRef = ref<HTMLElement | null>(null)
const floatingBtnRef = ref<HTMLElement | null>(null)
const iconRefs = ref<any[]>([])
const mouseX = ref<number | null>(null)
const bouncingId = ref<string | null>(null)

const isMobile = ref(false)
const isMobileDockOpen = ref(false)

// Floating button label collapse timer
const showButtonLabel = ref(true)
let labelTimer: ReturnType<typeof setTimeout> | null = null

const startLabelTimer = () => {
  showButtonLabel.value = true
  if (labelTimer) clearTimeout(labelTimer)
  labelTimer = setTimeout(() => {
    showButtonLabel.value = false
  }, 3200)
}

// Dragging state for mobile floating button
const dragX = ref(0)
const isDragging = ref(false)
let startPointerX = 0
let initialDragX = 0
let hasDragged = false

const handlePointerDown = (e: PointerEvent) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return

  isDragging.value = true
  hasDragged = false
  startPointerX = e.clientX
  initialDragX = dragX.value

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerup', handlePointerUp)
  window.addEventListener('pointercancel', handlePointerUp)
}

const clampDragX = () => {
  if (!floatingBtnRef.value) return
  const btnWidth = floatingBtnRef.value.offsetWidth
  const screenWidth = window.innerWidth
  const padding = 12
  const maxOffset = Math.max(0, (screenWidth - btnWidth) / 2 - padding)
  dragX.value = Math.max(-maxOffset, Math.min(maxOffset, dragX.value))
}

const handlePointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  const deltaX = e.clientX - startPointerX

  if (Math.abs(deltaX) > 4) {
    hasDragged = true
  }

  const btnWidth = floatingBtnRef.value ? floatingBtnRef.value.offsetWidth : 40
  const screenWidth = window.innerWidth
  const padding = 12

  const maxOffset = Math.max(0, (screenWidth - btnWidth) / 2 - padding)
  const rawX = initialDragX + deltaX

  dragX.value = Math.max(-maxOffset, Math.min(maxOffset, rawX))
}

const handlePointerUp = () => {
  if (!isDragging.value) return
  isDragging.value = false

  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
  window.removeEventListener('pointercancel', handlePointerUp)

  clampDragX()
}

watch(showButtonLabel, () => {
  nextTick(() => clampDragX())
})

const handleFloatingClick = () => {
  if (hasDragged) return
  isMobileDockOpen.value = true
}

const closeMobileDock = () => {
  isMobileDockOpen.value = false
  startLabelTimer()
}

const checkMobile = () => {
  if (import.meta.client) {
    isMobile.value = window.innerWidth < 640
    if (isMobile.value && !isMobileDockOpen.value) {
      startLabelTimer()
    }
  }
}

const systemItems = [
  {
    id: 'downloads',
    title: 'Downloads',
    icon: 'lucide:download',
    iconColor: 'text-emerald-300',
    bgClass: 'from-emerald-500/20 to-emerald-700/10 border-emerald-400/30',
    action: () => {
      openWindow('projects')
      if (isMobile.value) closeMobileDock()
    }
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: 'lucide:trash-2',
    iconColor: 'text-slate-300',
    bgClass: 'from-white/15 to-white/5 border-white/20',
    action: () => {
      openWindow('projects')
      if (isMobile.value) closeMobileDock()
    }
  }
]

const contextMenu = ref<{ visible: boolean; x: number; y: number; win: any | null }>({
  visible: false,
  x: 0,
  y: 0,
  win: null,
})

const handleMouseMove = (e: MouseEvent) => {
  if (!isMobile.value) mouseX.value = e.clientX
}

const handleMouseLeave = () => {
  mouseX.value = null
}

const getIconStyle = (index: number) => {
  const defaultStyle = {
    transform: 'scale(1) translateY(0px)',
    margin: isMobile.value ? '0 1px' : '0 3px',
    zIndex: 1,
  }

  if (isMobile.value || mouseX.value === null || !iconRefs.value[index]) {
    return defaultStyle
  }

  const el = iconRefs.value[index]
  if (!el || typeof el.getBoundingClientRect !== 'function') return defaultStyle

  const rect = el.getBoundingClientRect()
  const iconCenterX = rect.left + rect.width / 2

  const distance = Math.abs(mouseX.value - iconCenterX)
  const maxDistance = 150

  if (distance > maxDistance) return defaultStyle

  const scale = 1 + 0.45 * Math.cos((distance / maxDistance) * (Math.PI / 2))
  const translateY = -14 * ((scale - 1) / 0.45)
  const dynamicMargin = 3 + (scale - 1) * 12

  return {
    transform: `scale(${scale}) translateY(${translateY}px)`,
    margin: `0 ${dynamicMargin}px`,
    zIndex: Math.round(scale * 10),
  }
}

const handleDockClick = (win: any) => {
  closeContextMenu()
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

  if (isMobile.value) {
    closeMobileDock()
  }
}

const triggerBounce = (id: string) => {
  bouncingId.value = id
  setTimeout(() => {
    bouncingId.value = null
  }, 800)
}

const handleContextMenu = (e: MouseEvent, win: any) => {
  const x = Math.min(e.clientX, window.innerWidth - 180)
  const y = Math.max(10, e.clientY - 110)

  contextMenu.value = { visible: true, x, y, win }
}

const handleContextAction = (action: 'open' | 'minimize' | 'quit') => {
  if (!contextMenu.value.win) return

  const win = contextMenu.value.win
  if (action === 'open') openWindow(win.id)
  else if (action === 'minimize') toggleMinimize(win.id)
  else if (action === 'quit') closeWindow(win.id)

  closeContextMenu()
  if (isMobile.value) closeMobileDock()
}

const closeContextMenu = () => {
  contextMenu.value.visible = false
}

const handleOutsideClick = () => {
  if (contextMenu.value.visible) closeContextMenu()
}

onMounted(() => {
  if (import.meta.client) {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('click', handleOutsideClick)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', checkMobile)
    window.removeEventListener('click', handleOutsideClick)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
    if (labelTimer) clearTimeout(labelTimer)
  }
})
</script>

<style scoped>
@keyframes dock-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-16px) scale(1.08); }
  50% { transform: translateY(0) scale(0.95); }
  75% { transform: translateY(-6px) scale(1.02); }
}

.animate-bounce-dock {
  animation: dock-bounce 0.8s ease-in-out infinite;
}

.custom-scrollbar-none::-webkit-scrollbar { display: none; }
.custom-scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
