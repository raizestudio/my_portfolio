<!-- components/apps/ProjectsApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-900 text-slate-200 select-none overflow-hidden font-sans">

    <!-- Finder Toolbar -->
    <div class="h-11 px-3 bg-slate-800/80 border-b border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">

      <!-- Navigation Controls & Path -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 text-slate-400">
          <button class="p-1 hover:bg-white/10 rounded transition-colors" title="Back">
            <Icon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <button class="p-1 hover:bg-white/10 rounded transition-colors opacity-50" title="Forward">
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center gap-1 text-slate-300 font-medium">
          <Icon name="lucide:folder" class="w-4 h-4 text-sky-400" />
          <span>projects</span>
        </div>
      </div>

      <!-- View Toggles & Search -->
      <div class="flex items-center gap-3">
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

        <!-- Search Input -->
        <div class="relative flex items-center">
          <Icon name="lucide:search" class="w-3.5 h-3.5 absolute left-2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="w-36 sm:w-48 pl-7 pr-2 py-1 bg-slate-950/60 border border-white/10 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
      </div>

    </div>

    <!-- Main Finder Body -->
    <div class="flex-1 flex overflow-hidden">

      <!-- Finder Sidebar -->
      <div class="w-44 bg-slate-950/40 border-r border-white/10 p-3 space-y-4 shrink-0 hidden sm:block text-[12px]">
        <div>
          <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">
            Favorites
          </div>
          <div class="space-y-0.5">
            <button
              @click="activeFilter = 'all'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'all' ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="lucide:files" class="w-4 h-4 text-sky-400" />
              <span>All Projects</span>
            </button>
            <button
              @click="activeFilter = 'html'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'html' ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="lucide:globe" class="w-4 h-4 text-orange-400" />
              <span>Web (.html)</span>
            </button>
            <button
              @click="activeFilter = 'scripts'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'scripts' ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="lucide:terminal" class="w-4 h-4 text-emerald-400" />
              <span>Scripts (.py/.sh)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- File Browser Area -->
      <div class="flex-1 flex overflow-hidden bg-slate-900/60">

        <!-- Files Display -->
        <div class="flex-1 p-4 overflow-y-auto">

          <!-- GRID VIEW -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 auto-rows-max"
          >
            <div
              v-for="file in filteredFiles"
              :key="file.id"
              @click="selectedFileId = file.id"
              @dblclick="openProject(file)"
              class="group flex flex-col items-center p-2.5 rounded-xl cursor-pointer border transition-all"
              :class="[
                selectedFileId === file.id
                  ? 'bg-sky-600/25 border-sky-500/50 ring-1 ring-sky-400/50'
                  : 'bg-transparent border-transparent hover:bg-white/5'
              ]"
            >
              <!-- File Icon Badge -->
              <div class="relative w-12 h-14 bg-slate-800 rounded-lg border border-white/10 shadow-lg flex flex-col items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Icon :name="getFileIcon(file.ext)" :class="getFileIconColor(file.ext)" class="w-6 h-6 mb-0.5" />
                <span class="text-[8px] font-mono font-bold uppercase text-slate-400 bg-slate-950/80 px-1 py-0.2 rounded">
                  .{{ file.ext }}
                </span>
              </div>

              <!-- File Name -->
              <span class="mt-2 text-[11px] font-medium text-center text-slate-200 line-clamp-2 leading-tight w-full break-words">
                {{ file.filename }}
              </span>
            </div>
          </div>

          <!-- LIST VIEW -->
          <div v-else class="space-y-1">
            <div
              v-for="file in filteredFiles"
              :key="file.id"
              @click="selectedFileId = file.id"
              @dblclick="openProject(file)"
              class="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border text-xs transition-colors"
              :class="[
                selectedFileId === file.id
                  ? 'bg-sky-600/30 border-sky-500/50'
                  : 'bg-transparent border-transparent hover:bg-white/5'
              ]"
            >
              <div class="flex items-center gap-3">
                <Icon :name="getFileIcon(file.ext)" :class="getFileIconColor(file.ext)" class="w-4 h-4" />
                <span class="font-medium text-slate-200">{{ file.filename }}</span>
              </div>
              <div class="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>{{ file.size }}</span>
                <span>{{ file.updatedAt }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredFiles.length === 0" class="h-full flex flex-col items-center justify-center text-slate-500 py-12">
            <Icon name="lucide:folder-search" class="w-10 h-10 mb-2 opacity-50" />
            <p class="text-xs">No matching files found in ~/projects</p>
          </div>

        </div>

        <!-- Right File Inspector (macOS Quick Inspector Pane) -->
        <div
          v-if="selectedFile"
          class="w-64 bg-slate-950/50 border-l border-white/10 p-4 flex flex-col justify-between shrink-0 hidden md:flex text-xs"
        >
          <div class="space-y-4">
            <!-- Large Preview Icon -->
            <div class="flex flex-col items-center pt-2">
              <div class="w-16 h-20 bg-slate-800 rounded-xl border border-white/15 flex flex-col items-center justify-center shadow-xl mb-3">
                <Icon :name="getFileIcon(selectedFile.ext)" :class="getFileIconColor(selectedFile.ext)" class="w-9 h-9 mb-1" />
                <span class="text-[10px] font-mono font-bold uppercase text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                  .{{ selectedFile.ext }}
                </span>
              </div>
              <h4 class="font-bold text-slate-100 text-center text-sm leading-tight">
                {{ selectedFile.title }}
              </h4>
              <p class="text-[11px] font-mono text-slate-400 mt-0.5">{{ selectedFile.filename }}</p>
            </div>

            <div class="border-t border-white/10 pt-3 space-y-2">
              <div>
                <span class="text-slate-500 text-[10px] uppercase font-semibold">Description</span>
                <p class="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  {{ selectedFile.description }}
                </p>
              </div>

              <div>
                <span class="text-slate-500 text-[10px] uppercase font-semibold">Technologies</span>
                <div class="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                  <span
                    v-for="tech in selectedFile.techStack"
                    :key="tech"
                    class="bg-white/10 text-sky-300 px-1.5 py-0.5 rounded"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="pt-4 border-t border-white/10 space-y-2">
            <a
              v-if="selectedFile.demoUrl"
              :href="selectedFile.demoUrl"
              target="_blank"
              class="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Launch Live Site</span>
              <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
            </a>

            <button
              @click="openProject(selectedFile)"
              class="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Quick Look</span>
              <Icon name="lucide:eye" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- Bottom Status Bar -->
    <div class="h-6 px-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
      <span>{{ filteredFiles.length }} items</span>
      <span v-if="selectedFile">{{ selectedFile.filename }} — {{ selectedFile.size }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const viewMode = ref('grid') // 'grid' | 'list'
const searchQuery = ref('')
const activeFilter = ref('all') // 'all' | 'html' | 'scripts'
const selectedFileId = ref('location-engine')

// Scalable File System Data Structure
const files = ref([
  {
    id: 'location-engine',
    filename: 'location-engine.html',
    ext: 'html',
    title: 'Location Engine API',
    description: 'Semantic vector search pipeline built to query geo-spatial coordinates against semantic embeddings.',
    techStack: ['FastAPI', 'pgvector', 'Python', 'Tailwind'],
    size: '142 KB',
    updatedAt: 'Sep 24, 2026',
    demoUrl: 'https://example.com'
  },
  {
    id: 'desktop-os',
    filename: 'portfolio-os.html',
    ext: 'html',
    title: 'macOS Web Desktop',
    description: 'Interactive web operating system portfolio built with Nuxt 3, Vue 3, and Tailwind CSS.',
    techStack: ['Nuxt 3', 'Vue 3', 'TailwindCSS'],
    size: '88 KB',
    updatedAt: 'Sep 29, 2026',
    demoUrl: '#'
  },
  {
    id: 'data-pipeline',
    filename: 'ingest_pipeline.py',
    ext: 'py',
    title: 'Vector Data Ingestion',
    description: 'Automated Python script for chunking, embedding, and syncing document stores to pgvector.',
    techStack: ['Python', 'OpenAI', 'SQLAlchemy'],
    size: '12 KB',
    updatedAt: 'Aug 15, 2026'
  },
  {
    id: 'deploy-script',
    filename: 'deploy_cluster.sh',
    ext: 'sh',
    title: 'K8s Cluster Deployer',
    description: 'Shell script utility for initializing microservice environments on Kubernetes.',
    techStack: ['Bash', 'Docker', 'Kubernetes'],
    size: '4 KB',
    updatedAt: 'Jul 10, 2026'
  }
])

const filteredFiles = computed(() => {
  return files.value.filter(file => {
    // Filter by category
    if (activeFilter.value === 'html' && file.ext !== 'html') return false
    if (activeFilter.value === 'scripts' && !['py', 'sh'].includes(file.ext)) return false

    // Filter by search term
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      return file.filename.toLowerCase().includes(q) || file.title.toLowerCase().includes(q)
    }

    return true
  })
})

const selectedFile = computed(() => {
  return files.value.find(f => f.id === selectedFileId.value) || null
})

const getFileIcon = (ext) => {
  switch (ext) {
    case 'html': return 'lucide:file-code-2'
    case 'py': return 'lucide:file-code'
    case 'sh': return 'lucide:terminal'
    default: return 'lucide:file'
  }
}

const getFileIconColor = (ext) => {
  switch (ext) {
    case 'html': return 'text-orange-400'
    case 'py': return 'text-sky-400'
    case 'sh': return 'text-emerald-400'
    default: return 'text-slate-400'
  }
}

const openProject = (file) => {
  if (file.demoUrl && file.demoUrl !== '#') {
    window.open(file.demoUrl, '_blank')
  } else {
    alert(`Quick Look Preview for ${file.filename}:\n\n${file.description}`)
  }
}
</script>
