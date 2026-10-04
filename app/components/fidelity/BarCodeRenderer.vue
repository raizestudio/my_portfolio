<!-- components/fidelity/BarcodeRenderer.vue -->
<template>
  <div class="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner">
    <svg ref="barcodeRef" class="max-w-full h-20 sm:h-24"></svg>
    <span class="text-xs font-mono font-semibold text-slate-800 tracking-wider mt-1">
      {{ value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import JsBarcode from 'jsbarcode'

const props = defineProps({
  value: { type: String, required: true },
  format: { type: String, default: 'CODE128' }
})

const barcodeRef = ref<SVGSVGElement | null>(null)

const renderBarcode = () => {
  if (barcodeRef.value && props.value) {
    try {
      JsBarcode(barcodeRef.value, props.value, {
        format: props.format,
        width: 2,
        height: 70,
        displayValue: false,
        margin: 0,
        background: 'transparent',
        lineColor: '#0f172a'
      })
    } catch (e) {
      console.warn('Invalid barcode format:', e)
    }
  }
}

onMounted(renderBarcode)
watch(() => [props.value, props.format], renderBarcode)
</script>
