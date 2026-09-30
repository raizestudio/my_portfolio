<!-- components/desktop/DesktopIcon.vue -->
<template>
  <div class="w-20 flex flex-col items-center p-2 rounded hover:bg-white/20 cursor-pointer select-none text-white">
    <Icon :name="icon" class="w-10 h-10 mb-1" />
    <span class="text-xs text-center drop-shadow-md">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps(['icon', 'label'])
</script>
