<!-- pages/index.vue -->
<template>
  <div
    class="fixed inset-0 overflow-hidden font-sans select-none bg-slate-100 dark:bg-slate-950 transition-colors duration-500 touch-manipulation"
    @pointerdown="handleGlobalPointerDown"
  >
    <!-- Ambient CSS Gradient Overlay -->
    <div
      class="absolute inset-0 -z-10 pointer-events-none opacity-70 dark:opacity-80 transition-opacity duration-700 bg-[radial-gradient(at_0%_0%,_rgba(56,189,248,0.3)_0px,_transparent_50%),_radial-gradient(at_100%_0%,_rgba(244,63,94,0.3)_0px,_transparent_50%),_radial-gradient(at_100%_100%,_rgba(168,85,247,0.3)_0px,_transparent_50%),_radial-gradient(at_0%_100%,_rgba(16,185,129,0.3)_0px,_transparent_50%)]"
    />

    <!-- Lazy-Loaded WebGL Background -->
    <ClientOnly>
      <FluidBackground ref="fluidBgRef" />
    </ClientOnly>

    <MenuBar />

    <!-- Desktop Icons -->
    <div class="hidden sm:block">
      <DesktopIcon
        v-for="win in windows"
        :key="win.id"
        :win="win"
        :is-selected="selectedIconId === win.id"
        @select="selectedIconId = $event"
        @open="openWindow"
      />
    </div>

    <!-- Windows Layer -->
    <template v-for="win in windows" :key="win.id">
      <Window v-if="win.isOpen" v-show="!win.isMinimized" :win="win">
        <component :is="getComponent(win.component)" />
      </Window>
    </template>

    <Spotlight />
    <Taskbar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useWindowManager } from "~/composables/useWindowManager"

import DesktopIcon from "~/components/desktop/DesktopIcon.vue"
import Window from "~/components/desktop/Window.vue"
import Taskbar from "~/components/desktop/Taskbar.vue"
import MenuBar from "~/components/desktop/MenuBar.vue"
import Spotlight from "~/components/desktop/Spotlight.vue"

const FluidBackground = defineAsyncComponent(
  () => import("~/components/desktop/FluidBackground.vue")
)

// Async App Imports
const FinderApp = defineAsyncComponent(() => import("~/components/apps/FinderApp.vue"))
const AboutApp = defineAsyncComponent(() => import("~/components/apps/AboutApp.vue"))
const TerminalApp = defineAsyncComponent(() => import("~/components/apps/TerminalApp.vue"))
const ContactApp = defineAsyncComponent(() => import("~/components/apps/ContactApp.vue"))
const DiceApp = defineAsyncComponent(() => import("~/components/apps/DiceApp.vue"))
const ZedApp = defineAsyncComponent(() => import("~/components/apps/ZedApp.vue"))
const ChatApp = defineAsyncComponent(() => import("~/components/apps/ChatApp.vue"))
const RunnerApp = defineAsyncComponent(() => import("~/components/apps/RunnerApp.vue"))

const { windows, openWindow, toggleSpotlight } = useWindowManager()

const selectedIconId = ref<string | null>(null)
const fluidBgRef = ref<any>(null)
const isMobile = ref(false)
const showShader = ref(false)

const componentsMap: Record<string, any> = {
  FinderApp,
  ProjectsApp: FinderApp,
  TerminalApp,
  AboutApp,
  ContactApp,
  DiceApp,
  ZedApp,
  ChatApp,
  RunnerApp,
}

const getComponent = (name: string) => componentsMap[name]

const handleGlobalPointerDown = (e: PointerEvent) => {
  if (e.target === e.currentTarget) {
    selectedIconId.value = null
    // 🚀 Trigger ripple wave on empty desktop space click
    fluidBgRef.value?.triggerRipple(e.clientX, e.clientY)
  }
}

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
    e.preventDefault()
    toggleSpotlight()
  }
}

const checkMobile = () => {
  if (import.meta.client) {
    isMobile.value = window.innerWidth < 640
  }
}

onMounted(() => {
  if (import.meta.client) {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("keydown", handleGlobalKeydown)

    setTimeout(() => {
      showShader.value = true
    }, 1500)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("resize", checkMobile)
    window.removeEventListener("keydown", handleGlobalKeydown)
  }
})
</script>
