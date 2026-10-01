<!-- pages/index.vue -->
<template>
  <div
    class="fixed inset-0 overflow-hidden font-sans select-none bg-slate-950"
    @pointerdown="handleDesktopClick"
  >
    <!-- Dynamic macOS Wallpaper -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950" />
      <div class="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/40 to-pink-500/40 rounded-full blur-[120px] animate-pulse" />
      <div class="absolute top-1/3 -right-32 w-[700px] h-[700px] bg-gradient-to-br from-sky-500/30 to-indigo-600/40 rounded-full blur-[140px]" />
      <div class="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-blue-600/30 to-cyan-400/30 rounded-full blur-[130px]" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/20 to-slate-950/60" />
    </div>

    <!-- Top Menu Bar -->
    <MenuBar />

    <!-- Desktop Icons -->
    <DesktopIcon
      v-for="win in windows"
      :key="win.id"
      :win="win"
      :is-selected="selectedIconId === win.id"
      @select="selectedIconId = $event"
      @open="openWindow"
    />

    <!-- Windows Layer -->
    <template v-for="win in windows" :key="win.id">
      <Window v-show="win.isOpen && !win.isMinimized" :win="win">
        <component :is="getComponent(win.component)" />
      </Window>
    </template>

    <!-- Spotlight Search Overlay -->
    <Spotlight />

    <!-- Bottom Dock / Taskbar -->
    <Taskbar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useWindowManager } from "~/composables/useWindowManager"

import DesktopIcon from "~/components/desktop/DesktopIcon.vue"
import Window from "~/components/desktop/Window.vue"
import Taskbar from "~/components/desktop/Taskbar.vue"
import MenuBar from "~/components/desktop/MenuBar.vue"
import FinderApp from "~/components/apps/FinderApp.vue"
import AboutApp from "~/components/apps/AboutApp.vue"
import TerminalApp from "~/components/apps/TerminalApp.vue"
import ContactApp from "~/components/apps/ContactApp.vue"
import Spotlight from "~/components/desktop/Spotlight.vue"

const { windows, openWindow, toggleSpotlight } = useWindowManager()
const { t } = useI18n()

const selectedIconId = ref(null)

// Map both FinderApp and ProjectsApp to FinderApp
const componentsMap = {
  FinderApp,
  ProjectsApp: FinderApp,
  TerminalApp,
  AboutApp,
  ContactApp,
}

const getComponent = (name) => componentsMap[name]

// Cmd + Space / Ctrl + Space Global Listener
const handleGlobalKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
    e.preventDefault()
    toggleSpotlight()
  }
}

// Deselect icon when clicking on empty wallpaper area
const handleDesktopClick = (e) => {
  if (e.target === e.currentTarget) {
    selectedIconId.value = null
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", handleGlobalKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", handleGlobalKeydown)
  }
})

// Reactive getters for Head metadata
useHead({
  title: () => t("title"),
  meta: [
    {
      name: "description",
      content: () => t("description"),
    },
  ],
})
</script>
