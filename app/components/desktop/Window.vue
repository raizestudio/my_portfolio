<!-- components/desktop/Window.vue -->
<template>
  <div
    v-show="win.isOpen && !win.isMinimized"
    class="absolute flex flex-col bg-gray-50/50 dark:bg-slate-900/95 backdrop-blur-2xl border rounded-xl shadow-2xl overflow-hidden transition-shadow duration-200"
    :class="[
      win.isMaximized ? 'rounded-none border-none shadow-none' : 'border-slate-700/50',
      isActive ? 'shadow-black/60 ring-1 ring-white/10' : 'shadow-black/30 opacity-95',
      isDragging || isResizing ? 'select-none' : 'transition-[top,left,width,height] duration-200 ease-out'
    ]"
    :style="{
      top: win.isMaximized ? '28px' : `${win.position.y}px`,
      left: win.isMaximized ? '0px' : `${win.position.x}px`,
      width: win.isMaximized ? '100vw' : `${win.size.width}px`,
      height: win.isMaximized ? 'calc(100vh - 28px)' : `${win.size.height}px`,
      zIndex: win.zIndex,
      willChange: isDragging || isResizing ? 'top, left, width, height' : 'auto'
    }"
    @pointerdown="focusWindow(win.id)"
  >
    <!-- macOS Title Bar (Drag Handle) -->
    <div
      class="h-10 flex items-center px-4 cursor-move relative border-b border-white/5 transition-colors duration-200 select-none shrink-0"
      :class="isActive ? 'bg-gray-50/60 dark:bg-slate-900/60' : 'bg-slate-900/80'"
      @pointerdown="startDrag"
      @dblclick="toggleMaximize(win.id)"
    >
      <!-- Traffic Light Controls -->
      <div
        class="flex items-center gap-2 absolute left-4 z-10 group/traffic"
        :class="{ 'grayscale opacity-75': !isActive }"
      >
        <button
          @click.stop="closeWindow(win.id)"
          class="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center focus:outline-none shadow-sm cursor-pointer"
        >
          <span class="opacity-0 group-hover/traffic:opacity-100 text-[8px] font-bold text-[#4d0000] leading-none select-none">×</span>
        </button>

        <button
          @click.stop="toggleMinimize(win.id)"
          class="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center focus:outline-none shadow-sm cursor-pointer"
        >
          <span class="opacity-0 group-hover/traffic:opacity-100 text-[8px] font-bold text-[#654300] leading-none select-none">−</span>
        </button>

        <button
          @click.stop="toggleMaximize(win.id)"
          class="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center focus:outline-none shadow-sm cursor-pointer"
        >
          <span class="opacity-0 group-hover/traffic:opacity-100 text-[7px] font-bold text-[#003200] leading-none select-none">+</span>
        </button>
      </div>

      <!-- Window Title -->
      <div
        class="w-full text-center text-[13px] font-medium pointer-events-none transition-colors duration-200"
        :class="isActive ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'"
      >
        {{ win.title }}
      </div>
    </div>

    <!-- Window Content -->
    <div class="flex-1 bg-gray-50 dark:bg-slate-900 text-white overflow-auto relative">
      <!-- Overlay block during drag/resize to prevent mouse events from getting trapped inside child elements -->
      <div v-if="isDragging || isResizing" class="absolute inset-0 z-50 pointer-events-auto" />
      <slot />
    </div>

    <!-- Resize Handles -->
    <template v-if="!win.isMaximized">
      <div class="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize" @pointerdown.stop="startResize($event, 'n')" />
      <div class="absolute bottom-0 left-0 right-0 h-1.5 cursor-ns-resize" @pointerdown.stop="startResize($event, 's')" />
      <div class="absolute top-0 bottom-0 left-0 w-1.5 cursor-ew-resize" @pointerdown.stop="startResize($event, 'w')" />
      <div class="absolute top-0 bottom-0 right-0 w-1.5 cursor-ew-resize" @pointerdown.stop="startResize($event, 'e')" />
      <div class="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-10" @pointerdown.stop="startResize($event, 'nw')" />
      <div class="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-10" @pointerdown.stop="startResize($event, 'ne')" />
      <div class="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-10" @pointerdown.stop="startResize($event, 'sw')" />
      <div class="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-10" @pointerdown.stop="startResize($event, 'se')" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'

const props = defineProps({
  win: {
    type: Object,
    required: true
  }
})

const { activeWindowId, focusWindow, closeWindow, toggleMinimize, toggleMaximize } = useWindowManager()

const isActive = computed(() => activeWindowId.value === props.win.id)

const isDragging = ref(false)
const isResizing = ref(false)

const MIN_WIDTH = 320
const MIN_HEIGHT = 200

let activeAnimationFrame = null

// Window Dragging Logic
const startDrag = (event) => {
  // Ignore right clicks, maximized windows, or clicks on traffic light buttons
  if (props.win.isMaximized || event.button !== 0 || event.target.closest('button')) return

  focusWindow(props.win.id)
  isDragging.value = true

  const startX = event.clientX - props.win.position.x
  const startY = event.clientY - props.win.position.y

  let currentX = event.clientX
  let currentY = event.clientY

  const onPointerMove = (e) => {
    currentX = e.clientX
    currentY = e.clientY

    if (!activeAnimationFrame) {
      activeAnimationFrame = requestAnimationFrame(() => {
        const maxX = window.innerWidth - 80
        const maxY = window.innerHeight - 40

        // Keep position inside viewport bounds (28px minimum top offset for MenuBar)
        props.win.position.x = Math.max(-props.win.size.width + 80, Math.min(maxX, currentX - startX))
        props.win.position.y = Math.max(28, Math.min(maxY, currentY - startY))

        activeAnimationFrame = null
      })
    }
  }

  const onPointerUp = () => {
    isDragging.value = false
    if (activeAnimationFrame) cancelAnimationFrame(activeAnimationFrame)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

// Window Resizing Logic
const startResize = (event, direction) => {
  if (event.button !== 0) return

  focusWindow(props.win.id)
  isResizing.value = true

  const startX = event.clientX
  const startY = event.clientY
  const startWidth = props.win.size.width
  const startHeight = props.win.size.height
  const startPosX = props.win.position.x
  const startPosY = props.win.position.y

  let currentX = event.clientX
  let currentY = event.clientY

  const onPointerMove = (e) => {
    currentX = e.clientX
    currentY = e.clientY

    if (!activeAnimationFrame) {
      activeAnimationFrame = requestAnimationFrame(() => {
        const deltaX = currentX - startX
        const deltaY = currentY - startY

        if (direction.includes('e')) {
          props.win.size.width = Math.max(MIN_WIDTH, startWidth + deltaX)
        }
        if (direction.includes('s')) {
          props.win.size.height = Math.max(MIN_HEIGHT, startHeight + deltaY)
        }
        if (direction.includes('w')) {
          const possibleWidth = startWidth - deltaX
          if (possibleWidth >= MIN_WIDTH) {
            props.win.size.width = possibleWidth
            props.win.position.x = startPosX + deltaX
          }
        }
        if (direction.includes('n')) {
          const possibleHeight = startHeight - deltaY
          if (possibleHeight >= MIN_HEIGHT) {
            const newY = startPosY + deltaY
            if (newY >= 28) {
              props.win.size.height = possibleHeight
              props.win.position.y = newY
            }
          }
        }

        activeAnimationFrame = null
      })
    }
  }

  const onPointerUp = () => {
    isResizing.value = false
    if (activeAnimationFrame) cancelAnimationFrame(activeAnimationFrame)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

onUnmounted(() => {
  if (activeAnimationFrame) cancelAnimationFrame(activeAnimationFrame)
})
</script>
