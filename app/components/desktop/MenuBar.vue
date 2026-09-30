<!-- components/desktop/MenuBar.vue -->
<template>
  <div class="menu-bar-container fixed top-0 left-0 right-0 h-7 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-2 z-[100] text-white text-[13px] font-medium select-none">

    <!-- Left: Apple Menu & Dynamic Active App Menus -->
    <div class="flex items-center space-x-1">

      <!-- Apple Logo Menu -->
      <div class="relative">
        <button
          @click.stop="toggleMenu('apple')"
          class="px-2 py-0.5 rounded transition-colors flex items-center justify-center focus:outline-none"
          :class="activeMenu === 'apple' ? 'bg-white/20' : 'hover:bg-white/10'"
        >
          <Icon name="lucide:apple" class="w-3.5 h-3.5" />
        </button>

        <!-- Apple Dropdown -->
        <div
          v-if="activeMenu === 'apple'"
          class="absolute left-0 top-7 w-52 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 text-slate-200 z-50 text-[12px]"
        >
          <button @click="openWindow('projects')" class="w-full text-left px-3 py-1 hover:bg-sky-600 hover:text-white flex items-center justify-between">
            <span>About Portfolio</span>
            <span class="text-[10px] opacity-60">⌘I</span>
          </button>
          <div class="my-1 border-t border-white/10" />
          <a
            href="https://github.com"
            target="_blank"
            class="w-full text-left px-3 py-1 hover:bg-sky-600 hover:text-white flex items-center justify-between block"
          >
            <span>GitHub Profile</span>
            <Icon name="lucide:external-link" class="w-3 h-3 opacity-60" />
          </a>
          <div class="my-1 border-t border-white/10" />
          <button @click="reloadPage" class="w-full text-left px-3 py-1 hover:bg-sky-600 hover:text-white">
            Restart Desktop
          </button>
        </div>
      </div>

      <!-- Active Application Name -->
      <div class="relative">
        <button
          @click.stop="toggleMenu('app')"
          class="px-2 py-0.5 rounded font-bold transition-colors focus:outline-none"
          :class="activeMenu === 'app' ? 'bg-white/20' : 'hover:bg-white/10'"
        >
          {{ activeAppName }}
        </button>

        <!-- Active App Dropdown -->
        <div
          v-if="activeMenu === 'app' && activeWindow"
          class="absolute left-0 top-7 w-48 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 text-slate-200 z-50 text-[12px]"
        >
          <div class="px-3 py-1 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            {{ activeWindow.title }}
          </div>
          <div class="my-1 border-t border-white/10" />
          <button
            @click="closeWindow(activeWindow.id)"
            class="w-full text-left px-3 py-1 hover:bg-rose-600 hover:text-white flex items-center justify-between text-rose-300"
          >
            <span>Quit {{ activeWindow.title }}</span>
            <span class="text-[10px] opacity-60">⌘Q</span>
          </button>
        </div>
      </div>

      <!-- Standard Menu Items -->
      <button class="hidden sm:inline-block px-2 py-0.5 rounded hover:bg-white/10 transition-colors focus:outline-none">
        File
      </button>
      <button class="hidden sm:inline-block px-2 py-0.5 rounded hover:bg-white/10 transition-colors focus:outline-none">
        Edit
      </button>
      <button class="hidden sm:inline-block px-2 py-0.5 rounded hover:bg-white/10 transition-colors focus:outline-none">
        View
      </button>

    </div>

    <!-- Right: Control Center Widgets & Clock -->
    <div class="flex items-center space-x-1">

      <!-- Quick Status Icons -->
      <div class="flex items-center space-x-1 text-white/90">
        <div class="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer">
          <Icon name="lucide:battery-medium" class="w-4 h-4" />
        </div>
        <div class="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer">
          <Icon name="lucide:wifi" class="w-4 h-4" />
        </div>
        <div
          @click="openWindow('terminal')"
          class="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
          title="Open Terminal / Search"
        >
          <Icon name="lucide:search" class="w-3.5 h-3.5" />
        </div>
      </div>

      <!-- Control Center Toggle -->
      <div class="relative">
        <button
          @click.stop="toggleMenu('controlCenter')"
          class="px-1.5 py-0.5 rounded transition-colors focus:outline-none flex items-center"
          :class="activeMenu === 'controlCenter' ? 'bg-white/20' : 'hover:bg-white/10'"
        >
          <Icon name="lucide:sliders-horizontal" class="w-3.5 h-3.5" />
        </button>

        <!-- Control Center Popover -->
        <div
          v-if="activeMenu === 'controlCenter'"
          class="absolute right-0 top-7 w-64 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 text-slate-200 z-50 space-y-3"
        >
          <!-- Network / Bluetooth Toggles -->
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-white/10 p-2 rounded-xl flex items-center space-x-2">
              <div class="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white">
                <Icon name="lucide:wifi" class="w-4 h-4" />
              </div>
              <div class="text-[11px] leading-tight">
                <div class="font-semibold text-white">Wi-Fi</div>
                <div class="text-slate-400">Connected</div>
              </div>
            </div>

            <div class="bg-white/10 p-2 rounded-xl flex items-center space-x-2">
              <div class="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white">
                <Icon name="lucide:bluetooth" class="w-4 h-4" />
              </div>
              <div class="text-[11px] leading-tight">
                <div class="font-semibold text-white">Bluetooth</div>
                <div class="text-slate-400">On</div>
              </div>
            </div>
          </div>

          <!-- Display Brightness Slider Simulation -->
          <div class="bg-white/10 p-2.5 rounded-xl space-y-1">
            <div class="text-[11px] text-slate-300 font-medium flex justify-between">
              <span>Display</span>
              <Icon name="lucide:sun" class="w-3.5 h-3.5" />
            </div>
            <input type="range" min="20" max="100" value="90" class="w-full accent-sky-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
          </div>

          <!-- Sound Volume Slider Simulation -->
          <div class="bg-white/10 p-2.5 rounded-xl space-y-1">
            <div class="text-[11px] text-slate-300 font-medium flex justify-between">
              <span>Sound</span>
              <Icon name="lucide:volume-2" class="w-3.5 h-3.5" />
            </div>
            <input type="range" min="0" max="100" value="70" class="w-full accent-sky-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      </div>

      <!-- Clock Display -->
      <div class="px-2 py-0.5 rounded hover:bg-white/10 cursor-default text-[12px]">
        {{ formattedTime }}
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'

const { activeWindow, openWindow, closeWindow } = useWindowManager()
const { locale } = useI18n()

const activeMenu = ref(null)

const activeAppName = computed(() => {
  return activeWindow.value ? activeWindow.value.title : 'Finder'
})

const toggleMenu = (menuName) => {
  activeMenu.value = activeMenu.value === menuName ? null : menuName
}

const closeMenus = () => {
  activeMenu.value = null
}

const handleOutsideClick = (e) => {
  if (activeMenu.value && !e.target.closest('.menu-bar-container')) {
    closeMenus()
  }
}

const reloadPage = () => {
  if (import.meta.client) {
    window.location.reload()
  }
}

// macOS Clock Logic
const formattedTime = ref('')
let timer

const updateTime = () => {
  const now = new Date()
  const dateStr = now.toLocaleDateString(locale.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
  const timeStr = now.toLocaleTimeString(locale.value, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    // hour12: true
  })
  formattedTime.value = `${dateStr} ${timeStr}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  if (import.meta.client) {
    window.addEventListener('click', handleOutsideClick)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (import.meta.client) {
    window.removeEventListener('click', handleOutsideClick)
  }
})
</script>
