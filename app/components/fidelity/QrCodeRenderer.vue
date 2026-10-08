<!-- components/fidelity/QrCodeRenderer.vue -->
<template>
  <div class="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-inner">
    <canvas ref="canvasRef" class="w-28 h-28 sm:w-32 sm:h-32" />
    <span class="text-[10px] font-mono font-semibold text-slate-800 tracking-wider mt-1">
      {{ value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps<{
  value: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const renderQrCode = () => {
  if (canvasRef.value && props.value) {
    QRCode.toCanvas(
      canvasRef.value,
      props.value,
      {
        width: 128,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      },
      (err) => {
        if (err) console.error('Error generating QR code:', err)
      }
    )
  }
}

onMounted(renderQrCode)
watch(() => props.value, renderQrCode)
</script>
