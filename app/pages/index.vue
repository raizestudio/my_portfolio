<!-- pages/index.vue -->
<template>
  <div class="fixed inset-0 overflow-hidden bg-slate-800 font-sans select-none">
    <!-- Wallpaper -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 -z-10" />

    <!-- Top Menu Bar -->
    <MenuBar />

    <!-- Desktop Icons -->
    <div class="absolute top-8 left-0 right-0 bottom-24 p-4 flex flex-col flex-wrap gap-4 content-start">
      <DesktopIcon
        v-for="win in windows"
        :key="win.id"
        :icon="win.icon"
        :label="win.title"
        @dblclick="openWindow(win.id)"
      />
    </div>

    <!-- Windows Layer -->
    <template v-for="win in windows" :key="win.id">
      <Window v-show="win.isOpen && !win.isMinimized" :win="win">
        <component :is="getComponent(win.component)" />
      </Window>
    </template>

    <!-- Bottom Dock / Taskbar -->
    <Taskbar />
  </div>
</template>

<script setup>
import { useWindowManager } from '~/composables/useWindowManager'
import DesktopIcon from '~/components/desktop/DesktopIcon.vue'
import Window from '~/components/desktop/Window.vue'
import Taskbar from '~/components/desktop/Taskbar.vue'
import MenuBar from '~/components/desktop/MenuBar.vue'

import ProjectsApp from '~/components/apps/ProjectsApp.vue'
import TerminalApp from '~/components/apps/TerminalApp.vue'

const { windows, openWindow } = useWindowManager()

const componentsMap = {
  ProjectsApp,
  TerminalApp
}

const getComponent = (name) => componentsMap[name]

useHead({
  title: 'Joel PINHO | Portfolio',
  meta: [
    { name: 'description', content: 'Portfolio de Joel PINHO, developpeur Full-stack.' },
  ],
})
</script>
