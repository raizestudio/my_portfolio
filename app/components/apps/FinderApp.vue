<!-- components/apps/FinderApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-900 text-slate-200 select-none overflow-hidden font-sans">

    <!-- Finder Toolbar -->
    <div class="h-11 px-3 bg-slate-800/80 border-b border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">

      <!-- Navigation & Path Breadcrumbs -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- Back / Forward Buttons -->
        <div class="flex items-center gap-1 text-slate-400 shrink-0">
          <button
            @click="goBack"
            :disabled="historyIndex <= 0"
            class="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30"
            title="Back"
          >
            <Icon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <button
            @click="goForward"
            :disabled="historyIndex >= history.length - 1"
            class="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30"
            title="Forward"
          >
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <!-- Breadcrumbs Path Bar -->
        <div class="flex items-center gap-1.5 text-slate-300 font-medium text-xs truncate">
          <button
            v-for="(crumb, idx) in pathCrumbs"
            :key="crumb.id"
            @click="navigateTo(crumb.id)"
            class="flex items-center gap-1 hover:text-white transition-colors py-0.5 px-1 rounded hover:bg-white/10 truncate"
          >
            <Icon :name="crumb.icon || 'lucide:folder'" class="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span class="truncate">{{ crumb.name }}</span>
            <span v-if="idx < pathCrumbs.length - 1" class="text-slate-500 ml-1">/</span>
          </button>
        </div>
      </div>

      <!-- View Switcher & Search -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="flex items-center bg-slate-950/50 p-0.5 rounded-lg border border-white/10">
          <button
            @click="viewMode = 'grid'"
            class="p-1 rounded transition-colors"
            :class="viewMode === 'grid' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'"
            title="Icon View"
          >
            <Icon name="lucide:layout-grid" class="w-3.5 h-3.5" />
          </button>
          <button
            @click="viewMode = 'list'"
            class="p-1 rounded transition-colors"
            :class="viewMode === 'list' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'"
            title="List View"
          >
            <Icon name="lucide:list" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Search Field -->
        <div class="relative flex items-center">
          <Icon name="lucide:search" class="w-3.5 h-3.5 absolute left-2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Finder..."
            class="w-32 sm:w-44 pl-7 pr-2 py-1 bg-slate-950/60 border border-white/10 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
      </div>

    </div>

    <!-- Main Finder Layout -->
    <div class="flex-1 flex overflow-hidden">

      <!-- macOS Finder Sidebar -->
      <div class="w-48 bg-slate-950/40 border-r border-white/10 p-3 space-y-4 shrink-0 hidden sm:block text-[12px]">

        <!-- Favorites Section -->
        <div>
          <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5">
            Favorites
          </div>
          <div class="space-y-0.5">
            <button
              v-for="fav in sidebarFavorites"
              :key="fav.id"
              @click="navigateTo(fav.id)"
              class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="currentFolderId === fav.id ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon :name="fav.icon" :class="fav.iconColor || 'text-sky-400'" class="w-4 h-4" />
              <span>{{ fav.name }}</span>
            </button>
          </div>
        </div>

        <!-- Tags / Color Filters Section -->
        <div>
          <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5">
            Tags
          </div>
          <div class="space-y-1 px-2">
            <button
              @click="activeTag = activeTag === 'featured' ? null : 'featured'"
              class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors w-full text-left"
              :class="{ 'text-purple-300 font-medium': activeTag === 'featured' }"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Featured</span>
            </button>
            <button
              @click="activeTag = activeTag === 'work' ? null : 'work'"
              class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors w-full text-left"
              :class="{ 'text-sky-300 font-medium': activeTag === 'work' }"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Work</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Main Directory Content -->
      <div class="flex-1 flex overflow-hidden bg-slate-900/60">

        <div class="flex-1 p-4 overflow-y-auto">

          <!-- GRID VIEW -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-[repeat(auto-fill,minmax(105px,1fr))] gap-3 auto-rows-max"
          >
            <div
              v-for="item in visibleItems"
              :key="item.id"
              @click="selectedItemId = item.id"
              @dblclick="handleItemDblClick(item)"
              class="group flex flex-col items-center p-2.5 rounded-xl cursor-pointer border transition-all"
              :class="[
                selectedItemId === item.id
                  ? 'bg-sky-600/25 border-sky-500/50 ring-1 ring-sky-400/50'
                  : 'bg-transparent border-transparent hover:bg-white/5'
              ]"
            >
              <!-- Folder Tile -->
              <div
                v-if="item.type === 'folder'"
                class="relative w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform shrink-0"
              >
                <Icon name="lucide:folder-closed" class="w-8 h-8 text-amber-400 group-hover:hidden" />
                <Icon name="lucide:folder-open" class="w-8 h-8 text-amber-300 hidden group-hover:block" />
              </div>

              <!-- File Tile -->
              <div
                v-else
                class="relative w-12 h-14 bg-slate-800 rounded-lg border border-white/10 shadow-lg flex flex-col items-center justify-center group-hover:scale-105 transition-transform shrink-0"
              >
                <Icon :name="getItemIcon(item)" :class="getItemIconColor(item)" class="w-6 h-6 mb-0.5" />
                <span class="text-[8px] font-mono font-bold uppercase text-slate-400 bg-slate-950/80 px-1 py-0.2 rounded">
                  .{{ item.ext }}
                </span>
              </div>

              <!-- Item Title -->
              <span class="mt-2 text-[11px] font-medium text-center text-slate-200 line-clamp-2 leading-tight w-full break-words">
                {{ item.name }}
              </span>
            </div>
          </div>

          <!-- LIST VIEW -->
          <div v-else class="space-y-1">
            <div
              v-for="item in visibleItems"
              :key="item.id"
              @click="selectedItemId = item.id"
              @dblclick="handleItemDblClick(item)"
              class="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border text-xs transition-colors"
              :class="[
                selectedItemId === item.id
                  ? 'bg-sky-600/30 border-sky-500/50'
                  : 'bg-transparent border-transparent hover:bg-white/5'
              ]"
            >
              <div class="flex items-center gap-3">
                <Icon
                  v-if="item.type === 'folder'"
                  name="lucide:folder"
                  class="w-4 h-4 text-amber-400"
                />
                <Icon
                  v-else
                  :name="getItemIcon(item)"
                  :class="getItemIconColor(item)"
                  class="w-4 h-4"
                />
                <span class="font-medium text-slate-200">{{ item.name }}</span>
              </div>
              <div class="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>{{ item.type === 'folder' ? `${getChildCount(item.id)} items` : item.size }}</span>
                <span>{{ item.updatedAt }}</span>
              </div>
            </div>
          </div>

          <!-- Empty Directory State -->
          <div v-if="visibleItems.length === 0" class="h-full flex flex-col items-center justify-center text-slate-500 py-12">
            <Icon name="lucide:folder-open" class="w-10 h-10 mb-2 opacity-40" />
            <p class="text-xs">This folder is empty</p>
          </div>

        </div>

        <!-- Right Quick Look / Inspector Pane -->
        <div
          v-if="selectedItem"
          class="w-64 bg-slate-950/50 border-l border-white/10 p-4 flex flex-col justify-between shrink-0 hidden md:flex text-xs"
        >
          <div class="space-y-4">
            <div class="flex flex-col items-center pt-2">
              <template v-if="selectedItem.type === 'folder'">
                <div class="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-xl mb-3">
                  <Icon name="lucide:folder-open" class="w-9 h-9 text-amber-400" />
                </div>
                <h4 class="font-bold text-slate-100 text-center text-sm leading-tight">
                  {{ selectedItem.title || selectedItem.name }}
                </h4>
                <p class="text-[11px] font-mono text-amber-400/80 mt-0.5">Folder • {{ getChildCount(selectedItem.id) }} items</p>
              </template>

              <template v-else>
                <div class="w-16 h-20 bg-slate-800 rounded-xl border border-white/15 flex flex-col items-center justify-center shadow-xl mb-3">
                  <Icon :name="getItemIcon(selectedItem)" :class="getItemIconColor(selectedItem)" class="w-9 h-9 mb-1" />
                  <span class="text-[10px] font-mono font-bold uppercase text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                    .{{ selectedItem.ext }}
                  </span>
                </div>
                <h4 class="font-bold text-slate-100 text-center text-sm leading-tight">
                  {{ selectedItem.title || selectedItem.name }}
                </h4>
                <p class="text-[11px] font-mono text-slate-400 mt-0.5">{{ selectedItem.name }}</p>
              </template>
            </div>

            <div class="border-t border-white/10 pt-3 space-y-2">
              <div>
                <span class="text-slate-500 text-[10px] uppercase font-semibold">Description</span>
                <p class="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  {{ selectedItem.description || 'No description available.' }}
                </p>
              </div>

              <div v-if="selectedItem.type === 'file' && selectedItem.techStack">
                <span class="text-slate-500 text-[10px] uppercase font-semibold">Tech Stack</span>
                <div class="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                  <span
                    v-for="tech in selectedItem.techStack"
                    :key="tech"
                    class="bg-white/10 text-sky-300 px-1.5 py-0.5 rounded"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-white/10 space-y-2">
            <button
              v-if="selectedItem.type === 'folder'"
              @click="navigateTo(selectedItem.id)"
              class="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Folder</span>
              <Icon name="lucide:folder-open" class="w-3.5 h-3.5" />
            </button>

            <template v-else>
              <a
                v-if="selectedItem.demoUrl"
                :href="selectedItem.demoUrl"
                target="_blank"
                class="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Live Site</span>
                <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
              </a>

              <button
                @click="openFile(selectedItem)"
                class="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Quick Look</span>
                <Icon name="lucide:eye" class="w-3.5 h-3.5" />
              </button>
            </template>
          </div>
        </div>

      </div>

    </div>

    <!-- Status Bar -->
    <div class="h-6 px-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-mono">
      <span>{{ visibleItems.length }} items</span>
      <span v-if="selectedItem">{{ selectedItem.name }} — {{ selectedItem.type === 'folder' ? 'Directory' : selectedItem.size }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'

const { openWindow } = useWindowManager()

const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const activeTag = ref<string | null>(null)
const currentFolderId = ref('projects')
const selectedItemId = ref<string | null>(null)

// History Stack
const history = ref<string[]>(['projects'])
const historyIndex = ref(0)

// Sidebar Favorites List
const sidebarFavorites = [
  { id: 'desktop', name: 'Desktop', icon: 'lucide:monitor', iconColor: 'text-indigo-400' },
  { id: 'projects', name: 'Projects', icon: 'lucide:folder-git-2', iconColor: 'text-amber-400' },
  { id: 'documents', name: 'Documents', icon: 'lucide:file-text', iconColor: 'text-sky-400' },
  { id: 'downloads', name: 'Downloads', icon: 'lucide:download', iconColor: 'text-emerald-400' }
]

// Global macOS Virtual File System
const fileSystem = ref([
  // Root Directories
  { id: 'desktop', parentId: null, name: 'Desktop', type: 'folder', icon: 'lucide:monitor' },
  { id: 'projects', parentId: null, name: 'Projects', type: 'folder', icon: 'lucide:folder-git-2' },
  { id: 'documents', parentId: null, name: 'Documents', type: 'folder', icon: 'lucide:file-text' },
  { id: 'downloads', parentId: null, name: 'Downloads', type: 'folder', icon: 'lucide:download' },

  // Items in ~/Desktop
  {
    id: 'desktop-about',
    parentId: 'desktop',
    name: 'About_Me.pdf',
    type: 'file',
    ext: 'pdf',
    targetAppId: 'about', // Double-clicking opens the About window!
    title: 'About Me & Resume',
    description: 'Full-stack developer resume & summary PDF.',
    size: '1.2 MB',
    updatedAt: 'Oct 01, 2026'
  },
  {
    id: 'desktop-contact',
    parentId: 'desktop',
    name: 'Contact_Mail.eml',
    type: 'file',
    ext: 'eml',
    targetAppId: 'contact', // Double-clicking opens the Contact window!
    title: 'New Email Draft',
    description: 'Compose a message to Joel PINHO.',
    size: '14 KB',
    updatedAt: 'Oct 01, 2026'
  },

  // Items in ~/Projects
  {
    id: 'wedev',
    parentId: 'projects',
    name: 'WeDev',
    type: 'folder',
    tag: 'work',
    title: 'WeDev Ecosystem',
    description: 'Software solutions for car rental franchises.',
    updatedAt: 'Sep 24, 2026'
  },
  {
    id: 'apodis',
    parentId: 'projects',
    name: 'Apodis',
    type: 'folder',
    tag: 'work',
    title: 'Apodis Health',
    description: 'Pharmacy and patient digital health solutions.',
    updatedAt: 'Sep 24, 2026'
  },
  {
    id: 'cgti_camusat',
    parentId: 'projects',
    name: 'CGTI by Camusat',
    type: 'folder',
    tag: 'work',
    title: 'CGTI by Camusat',
    description: 'Fiber optics deployment management for TDF.',
    updatedAt: 'Sep 24, 2026'
  },

  // Inside ~/Projects/WeDev
  {
    id: 'gaia',
    parentId: 'wedev',
    name: 'gaia.vue',
    type: 'file',
    ext: 'vue',
    tag: 'featured',
    title: 'Gaia Nuxt Base Template',
    description: 'Scalable automated deployment base layer for rental websites.',
    techStack: ['Nuxt', 'Tailwind', 'DaisyUI', 'Leaflet.js'],
    size: '12.8 MB',
    updatedAt: 'Sep 24, 2026',
    demoUrl: 'https://gaia.we-dev.io'
  },
  {
    id: 'helios',
    parentId: 'wedev',
    name: 'helios.py',
    type: 'file',
    ext: 'py',
    tag: 'work',
    title: 'Helios Backend API',
    description: 'FastAPI core rental booking service engine.',
    techStack: ['FastAPI', 'Python', 'Docker', 'PostgreSQL', 'RabbitMQ'],
    size: '28 KB',
    updatedAt: 'Sep 24, 2026'
  }
])

// Navigation Logic
const navigateTo = (folderId: string) => {
  if (currentFolderId.value === folderId) return

  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(folderId)
  historyIndex.value = history.value.length - 1

  currentFolderId.value = folderId
  selectedItemId.value = null
}

const goBack = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    currentFolderId.value = history.value[historyIndex.value]
    selectedItemId.value = null
  }
}

const goForward = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    currentFolderId.value = history.value[historyIndex.value]
    selectedItemId.value = null
  }
}

const pathCrumbs = computed(() => {
  const crumbs = []
  let currId: string | null = currentFolderId.value

  while (currId) {
    const folder = fileSystem.value.find(i => i.id === currId && i.type === 'folder')
    if (folder) {
      crumbs.unshift({ id: folder.id, name: folder.name, icon: folder.icon })
      currId = folder.parentId
    } else {
      break
    }
  }

  return crumbs
})

const visibleItems = computed(() => {
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    return fileSystem.value.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q))
    )
  }

  return fileSystem.value.filter(item => {
    if (item.parentId !== currentFolderId.value) return false
    if (activeTag.value && item.tag !== activeTag.value) return false
    return true
  })
})

const selectedItem = computed(() => {
  return fileSystem.value.find(i => i.id === selectedItemId.value) || null
})

const getChildCount = (folderId: string) => {
  return fileSystem.value.filter(i => i.parentId === folderId).length
}

const getItemIcon = (item: any) => {
  switch (item.ext) {
    case 'pdf': return 'lucide:file-text'
    case 'eml': return 'lucide:mail'
    case 'html': return 'simple-icons:html5'
    case 'py': return 'simple-icons:python'
    case 'sh': return 'simple-icons:gnubash'
    case 'vue': return 'simple-icons:vuedotjs'
    default: return 'lucide:file-code-2'
  }
}

const getItemIconColor = (item: any) => {
  switch (item.ext) {
    case 'pdf': return 'text-rose-400'
    case 'eml': return 'text-purple-400'
    case 'html': return 'text-orange-400'
    case 'py': return 'text-sky-400'
    case 'sh': return 'text-emerald-400'
    case 'vue': return 'text-emerald-500'
    default: return 'text-slate-400'
  }
}

const handleItemDblClick = (item: any) => {
  if (item.type === 'folder') {
    navigateTo(item.id)
  } else {
    openFile(item)
  }
}

const openFile = (file: any) => {
  // If the file maps to an app window on the desktop, open that app window!
  if (file.targetAppId) {
    openWindow(file.targetAppId)
  } else if (file.demoUrl && file.demoUrl !== '#') {
    window.open(file.demoUrl, '_blank')
  } else {
    alert(`Quick Look Preview for ${file.name}:\n\n${file.description}`)
  }
}
</script>
