<!-- components/desktop/DesktopIcon.vue -->
<template>
  <div
    class="absolute flex flex-col items-center w-24 p-2 rounded-xl cursor-pointer select-none group transition-shadow duration-150"
    :class="[
      isSelected ? 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg' : 'hover:bg-white/10',
      isDragging ? 'opacity-80 scale-105 z-40' : 'z-10'
    ]"
    :style="{
      top: `${win.iconPosition.y}px`,
      left: `${win.iconPosition.x}px`,
      touchAction: 'none'
    }"
    @pointerdown="startDrag"
    @dblclick="handleDblClick"
  >
    <!-- Icon Tile -->
    <div class="w-14 h-14 rounded-2xl bg-slate-900/40 border border-white/15 flex items-center justify-center shadow-lg backdrop-blur-md group-hover:scale-105 transition-transform">
      <Icon :name="win.icon" class="w-8 h-8 text-white drop-shadow-md" />
    </div>

    <!-- Label -->
    <span class="mt-1.5 text-[12px] font-medium text-white text-center leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] line-clamp-2 px-1 rounded">
      {{ win.title }}
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  win: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'open'])

const isDragging = ref(false)
let hasMoved = false

const startDrag = (event) => {
  if (event.button !== 0) return // Only primary mouse click

  emit('select', props.win.id)
  isDragging.value = true
  hasMoved = false

  const startX = event.clientX - props.win.iconPosition.x
  const startY = event.clientY - props.win.iconPosition.y

  let animationFrameId = null

  const onPointerMove = (e) => {
    hasMoved = true

    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(() => {
        // Clamp bounds inside screen (keep standard top menu bar offset at 32px and dock offset at bottom)
        const maxX = window.innerWidth - 96
        const maxY = window.innerHeight - 120

        props.win.iconPosition.x = Math.max(12, Math.min(maxX, e.clientX - startX))
        props.win.iconPosition.y = Math.max(36, Math.min(maxY, e.clientY - startY))

        animationFrameId = null
      })
    }
  }

  const onPointerUp = () => {
    isDragging.value = false
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

const handleDblClick = () => {
  if (!hasMoved) {
    emit('open', props.win.id)
  }
}
</script>
