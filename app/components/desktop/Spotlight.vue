<!-- components/desktop/Spotlight.vue -->
<template>
  <Transition name="spotlight-fade">
    <div
      v-if="isSpotlightOpen"
      class="fixed inset-0 z-[200] flex justify-center pt-[15vh] px-4 bg-black/30 backdrop-blur-sm select-none"
      @pointerdown.self="closeSpotlight"
    >
      <div
        class="w-full max-w-xl bg-slate-900/85 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-fit max-h-[480px] transition-all"
        @pointerdown.stop
      >
        <!-- Search Bar Input Header -->
        <div class="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Icon name="lucide:search" class="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref="searchInputRef"
            v-model="query"
            type="text"
            placeholder="Spotlight Search (Apps, Projects, Actions...)"
            class="w-full bg-transparent text-white placeholder-slate-400 text-base font-normal focus:outline-none"
            @keydown.down.prevent="navigateDown"
            @keydown.up.prevent="navigateUp"
            @keydown.enter.prevent="executeSelection"
            @keydown.esc.prevent="closeSpotlight"
          />
          <kbd class="text-[10px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">ESC</kbd>
        </div>

        <!-- Search Results List -->
        <div v-if="filteredResults.length > 0" class="overflow-y-auto p-2 space-y-1 max-h-[360px]">
          <div
            v-for="(item, index) in filteredResults"
            :key="item.id"
            @click="runItemAction(item)"
            @mouseenter="selectedIndex = index"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs"
            :class="[
              selectedIndex === index ? 'bg-sky-600/80 text-white shadow-md' : 'text-slate-200 hover:bg-white/5'
            ]"
          >
            <!-- Left Info -->
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :class="selectedIndex === index ? 'bg-white/20' : 'bg-slate-800 border border-white/10'"
              >
                <Icon :name="item.icon" class="w-4 h-4" />
              </div>
              <div class="truncate">
                <div class="font-medium text-sm leading-tight truncate">{{ item.title }}</div>
                <div class="text-[11px] opacity-75 truncate mt-0.5">{{ item.subtitle }}</div>
              </div>
            </div>

            <!-- Right Category Badge -->
            <span
              class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border shrink-0"
              :class="[
                selectedIndex === index ? 'bg-white/20 border-white/30 text-white' : 'bg-slate-950/60 border-white/10 text-slate-400'
              ]"
            >
              {{ item.category }}
            </span>
          </div>
        </div>

        <!-- Empty Results State -->
        <div v-else-if="query.trim() !== ''" class="p-8 text-center text-slate-400 text-xs">
          <Icon name="lucide:search-x" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No results found for "<span class="text-white">{{ query }}</span>"</p>
        </div>

        <!-- Footer Shortcuts -->
        <div class="px-4 py-2 bg-slate-950/60 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div class="flex items-center gap-3">
            <span><kbd class="text-[9px] bg-white/10 px-1 rounded">↑</kbd> <kbd class="text-[9px] bg-white/10 px-1 rounded">↓</kbd> Navigate</span>
            <span><kbd class="text-[9px] bg-white/10 px-1 rounded">↵</kbd> Open</span>
          </div>
          <span>Spotlight Search</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'

const { isSpotlightOpen, closeSpotlight, openWindow } = useWindowManager()

const searchInputRef = ref(null)
const query = ref('')
const selectedIndex = ref(0)

// Indexable Items (Apps, Projects, Quick Actions)
const searchableItems = [
  // Desktop Applications
  {
    id: 'app-about',
    title: 'About_Me.pdf',
    subtitle: 'Full-Stack Developer Resume & Bio',
    category: 'Applications',
    icon: 'lucide:file-text',
    action: () => openWindow('about')
  },
  {
    id: 'app-projects',
    title: 'Projects Folder',
    subtitle: 'Browse interactive web projects & scripts',
    category: 'Applications',
    icon: 'lucide:folder',
    action: () => openWindow('projects')
  },
  {
    id: 'app-terminal',
    title: 'Terminal App',
    subtitle: 'Command line interface',
    category: 'Applications',
    icon: 'lucide:terminal',
    action: () => openWindow('terminal')
  },
  {
    id: 'app-contact',
    title: 'Contact Mail',
    subtitle: 'Send a direct message or email inquiry',
    category: 'Applications',
    icon: 'lucide:mail',
    action: () => openWindow('contact')
  },

  // Projects Files
  {
    id: 'proj-location-engine',
    title: 'location-engine.html',
    subtitle: 'Semantic vector search pipeline (FastAPI & pgvector)',
    category: 'Project File',
    icon: 'lucide:file-code-2',
    action: () => openWindow('projects')
  },
  {
    id: 'proj-portfolio-os',
    title: 'portfolio-os.html',
    subtitle: 'Interactive macOS Web Desktop (Nuxt 3 & Vue 3)',
    category: 'Project File',
    icon: 'lucide:file-code-2',
    action: () => openWindow('projects')
  },

  // System Actions
  {
    id: 'act-github',
    title: 'GitHub Profile',
    subtitle: 'Open external link in a new tab',
    category: 'External Action',
    icon: 'lucide:github',
    action: () => window.open('https://github.com/raizestudio', '_blank')
  },
  {
    id: 'act-linkedin',
    title: 'LinkedIn Profile',
    subtitle: 'Open external link in a new tab',
    category: 'External Action',
    icon: 'lucide:linkedin',
    action: () => window.open('https://linkedin.com', '_blank')
  },
  {
    id: 'act-reload',
    title: 'Restart Desktop',
    subtitle: 'Reload web desktop state',
    category: 'System Action',
    icon: 'lucide:rotate-cw',
    action: () => window.location.reload()
  }
]

const filteredResults = computed(() => {
  if (!query.value.trim()) return searchableItems
  const q = query.value.toLowerCase()
  return searchableItems.filter(
    item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  )
})

const navigateDown = () => {
  if (selectedIndex.value < filteredResults.value.length - 1) {
    selectedIndex.value++
  }
}

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

const runItemAction = (item) => {
  if (item && item.action) {
    item.action()
    closeSpotlight()
  }
}

const executeSelection = () => {
  const item = filteredResults.value[selectedIndex.value]
  if (item) runItemAction(item)
}

// Auto-focus search input when Spotlight opens & reset query
watch(isSpotlightOpen, (isOpen) => {
  if (isOpen) {
    query.value = ''
    selectedIndex.value = 0
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
})

// Keep index within bounds when search results filter down
watch(filteredResults, (newResults) => {
  if (selectedIndex.value >= newResults.length) {
    selectedIndex.value = Math.max(0, newResults.length - 1)
  }
})
</script>

<style scoped>
.spotlight-fade-enter-active,
.spotlight-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.spotlight-fade-enter-from,
.spotlight-fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(-10px);
}
</style>
