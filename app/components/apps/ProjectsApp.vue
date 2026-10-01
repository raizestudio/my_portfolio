<!-- components/apps/ProjectsApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-900 text-slate-200 select-none overflow-hidden font-sans">

    <!-- Finder Toolbar -->
    <div class="h-11 px-3 bg-slate-800/80 border-b border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">

      <!-- Navigation Controls & Path Breadcrumbs -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- Back / Forward Buttons -->
        <div class="flex items-center gap-1 text-slate-400 shrink-0">
          <button
            @click="goBack"
            :disabled="historyIndex <= 0"
            class="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="Back"
          >
            <Icon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <button
            @click="goForward"
            :disabled="historyIndex >= history.length - 1"
            class="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            title="Forward"
          >
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <!-- Breadcrumb Path Bar -->
        <div class="flex items-center gap-1.5 text-slate-300 font-medium text-xs truncate">
          <button
            v-for="(crumb, idx) in pathCrumbs"
            :key="crumb.id"
            @click="navigateTo(crumb.id)"
            class="flex items-center gap-1 hover:text-white transition-colors py-0.5 px-1 rounded hover:bg-white/10 truncate"
          >
            <Icon :name="idx === 0 ? 'lucide:folder' : 'lucide:folder-open'" class="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span class="truncate">{{ crumb.name }}</span>
            <span v-if="idx < pathCrumbs.length - 1" class="text-slate-500 ml-1">/</span>
          </button>
        </div>
      </div>

      <!-- View Toggles & Search -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="flex items-center bg-slate-950/50 p-0.5 rounded-lg border border-white/10">
          <button
            @click="viewMode = 'grid'"
            class="p-1 rounded transition-colors"
            :class="viewMode === 'grid' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'"
            :title="appsProjectsGridViewText"
          >
            <Icon name="lucide:layout-grid" class="w-3.5 h-3.5" />
          </button>
          <button
            @click="viewMode = 'list'"
            class="p-1 rounded transition-colors"
            :class="viewMode === 'list' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'"
            :title="appsProjectsListViewText"
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
            :placeholder="appsProjectsSearchText"
            class="w-32 sm:w-44 pl-7 pr-2 py-1 bg-slate-950/60 border border-white/10 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
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
            {{ appsProjectsFavoritesText }}
          </div>
          <div class="space-y-0.5">
            <!-- Root Folder -->
            <button
              @click="navigateTo('root'); activeFilter = 'all'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="currentFolderId === 'root' && activeFilter === 'all' ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="lucide:hard-drive" class="w-4 h-4 text-sky-400" />
              <span>{{ appsProjectsAllProjectsText }}</span>
            </button>

            <!-- Quick Category Filters -->
            <button
              @click="activeFilter = 'folders'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'folders' ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="lucide:folder" class="w-4 h-4 text-amber-400" />
              <span>{{ appsProjectsFoldersText }}</span>
            </button>
            <button
              @click="activeFilter = 'html'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'html' ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="simple-icons:html5" class="w-4 h-4 text-orange-400" />
              <span>{{ appsProjectsWebText }} (.html)</span>
            </button>
            <button
              @click="activeFilter = 'vue'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'vue' ? 'bg-green-600/30 text-green-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="simple-icons:vuedotjs" class="w-4 h-4 text-green-400" />
              <span>{{ appsProjectsVueText }} (.vue)</span>
            </button>
            <button
              @click="activeFilter = 'python'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'python' ? 'bg-sky-600/30 text-sky-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="simple-icons:python" class="w-4 h-4 text-sky-400" />
              <span>{{ appsProjectsPythonText }} (.py)</span>
            </button>
            <button
              @click="activeFilter = 'scripts'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'scripts' ? 'bg-emerald-600/30 text-emerald-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="simple-icons:gnubash" class="w-4 h-4 text-emerald-400" />
              <span>{{ appsProjectsScriptsText }} (.sh)</span>
            </button>
            <button
              @click="activeFilter = 'markdown'"
              class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors"
              :class="activeFilter === 'markdown' ? 'bg-gray-600/30 text-gray-200 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'"
            >
              <Icon name="simple-icons:markdown" class="w-4 h-4 text-gray-400" />
              <span>{{ appsProjectsMarkdownText }} (.md)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- File & Folder Browser Area -->
      <div class="flex-1 flex overflow-hidden bg-slate-900/60">

        <!-- Display Area -->
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
              <!-- Item Icon Tile -->
              <!-- FOLDER ICON -->
              <div
                v-if="item.type === 'folder'"
                class="relative w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform shrink-0"
              >
                <Icon name="lucide:folder-closed" class="w-8 h-8 text-amber-400 group-hover:hidden" />
                <Icon name="lucide:folder-open" class="w-8 h-8 text-amber-300 hidden group-hover:block" />
              </div>

              <!-- FILE ICON -->
              <div
                v-else
                class="relative w-12 h-14 bg-slate-800 rounded-lg border border-white/10 shadow-lg flex flex-col items-center justify-center group-hover:scale-105 transition-transform shrink-0"
              >
                <Icon :name="getItemIcon(item)" :class="getItemIconColor(item)" class="w-6 h-6 mb-0.5" />
                <span class="text-[8px] font-mono font-bold uppercase text-slate-400 bg-slate-950/80 px-1 py-0.2 rounded">
                  .{{ item.ext }}
                </span>
              </div>

              <!-- Item Name -->
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

          <!-- Empty State -->
          <div v-if="visibleItems.length === 0" class="h-full flex flex-col items-center justify-center text-slate-500 py-12">
            <Icon name="lucide:folder-open" class="w-10 h-10 mb-2 opacity-50" />
            <p class="text-xs">{{ appsProjectsNoSearchMatchText }}</p>
          </div>

        </div>

        <!-- Right File/Folder Inspector (macOS Quick Inspector Pane) -->
        <div
          v-if="selectedItem"
          class="w-64 bg-slate-950/50 border-l border-white/10 p-4 flex flex-col justify-between shrink-0 hidden md:flex text-xs"
        >
          <div class="space-y-4">
            <!-- Large Preview Icon -->
            <div class="flex flex-col items-center pt-2">
              <!-- Folder Selected -->
              <template v-if="selectedItem.type === 'folder'">
                <div class="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-xl mb-3">
                  <Icon name="lucide:folder-open" class="w-9 h-9 text-amber-400" />
                </div>
                <h4 class="font-bold text-slate-100 text-center text-sm leading-tight">
                  {{ selectedItem.title || selectedItem.name }}
                </h4>
                <p class="text-[11px] font-mono text-amber-400/80 mt-0.5">Folder • {{ getChildCount(selectedItem.id) }} items</p>
              </template>

              <!-- File Selected -->
              <template v-else>
                <div class="w-16 h-20 bg-slate-800 rounded-xl border border-white/15 flex flex-col items-center justify-center shadow-xl mb-3">
                  <Icon :name="getItemIcon(selectedItem)" :class="getItemIconColor(selectedItem)" class="w-9 h-9 mb-1" />
                  <span class="text-[10px] font-mono font-bold uppercase text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                    .{{ selectedItem.ext }}
                  </span>
                </div>
                <h4 class="font-bold text-slate-100 text-center text-sm leading-tight">
                  {{ selectedItem.title }}
                </h4>
                <p class="text-[11px] font-mono text-slate-400 mt-0.5">{{ selectedItem.name }}</p>
              </template>
            </div>

            <div class="border-t border-white/10 pt-3 space-y-2">
              <div>
                <span class="text-slate-500 text-[10px] uppercase font-semibold">{{ appsProjectsDescriptionText }}</span>
                <p class="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  {{ selectedItem.description || 'No description available.' }}
                </p>
              </div>

              <div v-if="selectedItem.type === 'file' && selectedItem.techStack">
                <span class="text-slate-500 text-[10px] uppercase font-semibold">{{ appsProjectsStackText }}</span>
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

          <!-- Quick Actions -->
          <div class="pt-4 border-t border-white/10 space-y-2">
            <!-- Folder Action -->
            <button
              v-if="selectedItem.type === 'folder'"
              @click="navigateTo(selectedItem.id)"
              class="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Folder</span>
              <Icon name="lucide:folder-open" class="w-3.5 h-3.5" />
            </button>

            <!-- File Actions -->
            <template v-else>
              <a
                v-if="selectedItem.demoUrl"
                :href="selectedItem.demoUrl"
                target="_blank"
                class="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>{{ appsProjectsOpenWebsiteText }}</span>
                <Icon name="lucide:external-link" class="w-3.5 h-3.5" />
              </a>

              <button
                @click="openProject(selectedItem)"
                class="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>{{ appsProjectsQuickViewText }}</span>
                <Icon name="lucide:eye" class="w-3.5 h-3.5" />
              </button>
            </template>
          </div>
        </div>

      </div>

    </div>

    <!-- Bottom Status Bar -->
    <div class="h-6 px-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
      <span>{{ visibleItems.length }} {{ appsProjectsItemsText }}</span>
      <span v-if="selectedItem">{{ selectedItem.name }} — {{ selectedItem.type === 'folder' ? 'Folder' : selectedItem.size }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { t } = useI18n()

// View & Navigation State
const viewMode = ref('grid') // 'grid' | 'list'
const searchQuery = ref('')
const activeFilter = ref('all') // 'all' | 'folders' | 'html' | 'python' | 'scripts'
const currentFolderId = ref('root')
const selectedItemId = ref(null)

// History Stack for Back/Forward Navigation
const history = ref(['root'])
const historyIndex = ref(0)

// Computed Reactive i18n Strings
const appsProjectsTitleText = computed(() => t('apps.projects.title'))
const appsProjectsGridViewText = computed(() => t('apps.projects.gridView'))
const appsProjectsListViewText = computed(() => t('apps.projects.listView'))
const appsProjectsSearchText = computed(() => t('apps.projects.search'))
const appsProjectsFavoritesText = computed(() => t('apps.projects.favorites'))
const appsProjectsAllProjectsText = computed(() => t('apps.projects.allProjects'))
const appsProjectsFoldersText = computed(() => t('apps.projects.folders'))
const appsProjectsWebText = computed(() => t('apps.projects.web'))
const appsProjectsVueText = computed(() => t('apps.projects.vue'))
const appsProjectsPythonText = computed(() => t('apps.projects.python'))
const appsProjectsScriptsText = computed(() => t('apps.projects.scripts'))
const appsProjectsMarkdownText = computed(() => t('apps.projects.markdown'))
const appsProjectsNoSearchMatchText = computed(() => t('apps.projects.noSearchMatch'))
const appsProjectsDescriptionText = computed(() => t('apps.projects.description'))
const appsProjectsStackText = computed(() => t('apps.projects.stack'))
const appsProjectsOpenWebsiteText = computed(() => t('apps.projects.openWebsite'))
const appsProjectsQuickViewText = computed(() => t('apps.projects.quickView'))
const appsProjectsItemsText = computed(() => t('apps.projects.items'))

// Virtual Hierarchical File System Data
const fileSystem = ref([
  // Root Folders
  {
    id: 'wedev',
    parentId: 'root',
    name: 'WeDev',
    type: 'folder',
    title: 'WeDev',
    description: 'Solutions logiciels à destination des loueurs de voiture.',
    updatedAt: 'Sep 24, 2026'
  },
  {
    id: 'apodis',
    parentId: 'root',
    name: 'Apodis',
    type: 'folder',
    title: 'Apodis',
    description: 'Solutions logiciels à destination des patients et professionnels de la santé en pharmacie.',
    updatedAt: 'Sep 24, 2026'
  },
  {
    id: 'cgti_camusat',
    parentId: 'root',
    name: 'CGTI by Camusat',
    type: 'folder',
    title: 'CGTI by Camusat',
    description: 'Solutions logiciels facilitant le déploiement de la fibre optique pour le compte de TDF',
    updatedAt: 'Sep 24, 2026'
  },
  // {
  //   id: 'folder-nexus-store',
  //   parentId: 'root',
  //   name: 'nexus-storefront',
  //   type: 'folder',
  //   title: 'Nexus E-Commerce Platform',
  //   description: 'Full-stack storefront with Nuxt 3, Stripe integration, and Payload CMS.',
  //   updatedAt: 'Sep 28, 2026'
  // },

  // Root Files
  // {
  //   id: 'file-portfolio-os',
  //   parentId: 'root',
  //   name: 'portfolio-os.html',
  //   type: 'file',
  //   ext: 'html',
  //   title: 'macOS Web Desktop',
  //   description: 'Interactive web operating system portfolio built with Nuxt 3, Vue 3, and Tailwind CSS.',
  //   techStack: ['Nuxt 3', 'Vue 3', 'TailwindCSS'],
  //   size: '88 KB',
  //   updatedAt: 'Sep 29, 2026',
  //   demoUrl: '#'
  // },
  // {
  //   id: 'file-deploy-script',
  //   parentId: 'root',
  //   name: 'deploy_cluster.sh',
  //   type: 'file',
  //   ext: 'sh',
  //   title: 'K8s Cluster Deployer',
  //   description: 'Shell script utility for initializing microservice environments on Kubernetes.',
  //   techStack: ['Bash', 'Docker', 'Kubernetes'],
  //   size: '4 KB',
  //   updatedAt: 'Jul 10, 2026'
  // },

  // Items Inside WeDev Folder
  {
    id: 'gaia',
    parentId: 'wedev',
    name: 'gaia.vue',
    type: 'file',
    ext: 'vue',
    title: 'Gaia',
    description: 'Site web utilisant Nuxt layers afin de permettre un déploiement automatisé et évolutif. Celui est la base de tout les sites web de WeDev à destination des loueurs.',
    techStack: ['Nuxt', 'Tailwind', 'DaisyUI', 'Leaflet.js', 'Phosphor Icons', 'Motion'],
    size: '12.8 MB',
    updatedAt: 'Sep 24, 2026',
    demoUrl: 'https://gaia.we-dev.io'
  },
  {
    id: 'europcar_mb',
    parentId: 'wedev',
    name: 'europcar_mb.vue',
    type: 'file',
    ext: 'vue',
    title: 'Europcar Mont-Blanc',
    description: 'Site web pour la gestion des réservations de voitures en montagne, franchisé d\'Europcar France.',
    techStack: ['Nuxt', 'Tailwind', 'DaisyUI', 'Leaflet.js', 'Phosphor Icons', 'Motion'],
    size: '28 KB',
    updatedAt: 'Sep 24, 2026',
    demoUrl: 'https://europcarmontblanc.fr'
  },
  {
    id: 'helios_admin',
    parentId: 'wedev',
    name: 'helios_admin.py',
    type: 'file',
    ext: 'vue',
    title: 'Helios Admin',
    description: 'Back-office pour la gestion de tout le contenu des diffents clients.',
    techStack: ['Nuxt', 'Tailwind', 'NaiveUI', 'Leaflet.js', 'Phosphor Icons'],
    size: '28 KB',
    updatedAt: 'Sep 24, 2026',
    demoUrl: 'https://helios-admin.we-dev.io'
  },
  {
    id: 'helios',
    parentId: 'wedev',
    name: 'helios.py',
    type: 'file',
    ext: 'py',
    title: 'Helios',
    description: 'Backend de l\'application Helios. Le moteur dérrière tout le système de gestion de locations. Interconnecté avec differentes APIs externes.',
    techStack: ['FastAPI', 'Python', 'Docker', 'PostgreSQL', 'Valkey', 'RabbitMQ'],
    size: '28 KB',
    updatedAt: 'Sep 24, 2026',
    demoUrl: 'https://helios.we-dev.io'
  },
  {
    id: 'readme',
    parentId: 'wedev',
    name: 'README.md',
    type: 'file',
    ext: 'md',
    title: 'README',
    description: 'Fichier README de l\'écosystème Helios.',
    techStack: ['Markdown'],
    size: '11 KB',
    updatedAt: 'Sep 24, 2026',
  },
  // {
  //   id: 'loc-file-demo',
  //   parentId: 'folder-location-engine',
  //   name: 'index.html',
  //   type: 'file',
  //   ext: 'html',
  //   title: 'Location Sandbox UI',
  //   description: 'Interactive Leaflet.js map client for semantic location search.',
  //   techStack: ['HTML5', 'Tailwind', 'Leaflet.js'],
  //   size: '114 KB',
  //   updatedAt: 'Sep 24, 2026',
  //   demoUrl: 'https://example.com'
  // },
  // {
  //   id: 'loc-file-env',
  //   parentId: 'folder-location-engine',
  //   name: 'docker-compose.yml',
  //   type: 'file',
  //   ext: 'yml',
  //   title: 'Docker Service Stack',
  //   description: 'Container setup for Postgres, pgvector extension, and FastAPI workers.',
  //   techStack: ['Docker', 'YAML'],
  //   size: '2.5 KB',
  //   updatedAt: 'Sep 20, 2026'
  // },

  // Items Inside nexus-storefront Folder
  // {
  //   id: 'nex-file-app',
  //   parentId: 'folder-nexus-store',
  //   name: 'app.vue',
  //   type: 'file',
  //   ext: 'vue',
  //   title: 'Nuxt Storefront Application',
  //   description: 'Client application handling SSR, shopping cart, and product routing.',
  //   techStack: ['Nuxt 3', 'Vue 3', 'Pinia', 'Tailwind'],
  //   size: '45 KB',
  //   updatedAt: 'Sep 28, 2026'
  // },
  // {
  //   id: 'nex-file-stripe',
  //   parentId: 'folder-nexus-store',
  //   name: 'checkout.py',
  //   type: 'file',
  //   ext: 'py',
  //   title: 'Stripe Webhook Handler',
  //   description: 'Secure payment handler and order fulfillment pipeline.',
  //   techStack: ['Python', 'Stripe API'],
  //   size: '16 KB',
  //   updatedAt: 'Sep 27, 2026'
  // }
])

// Navigation Methods
const navigateTo = (folderId) => {
  if (currentFolderId.value === folderId) return

  // Truncate forward history if navigating from a past point
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

// Compute Breadcrumb Trail
const pathCrumbs = computed(() => {
  const crumbs = []
  let currId = currentFolderId.value

  while (currId) {
    if (currId === 'root') {
      crumbs.unshift({ id: 'root', name: appsProjectsTitleText.value || 'projects' })
      break
    }
    const folder = fileSystem.value.find(i => i.id === currId && i.type === 'folder')
    if (folder) {
      crumbs.unshift({ id: folder.id, name: folder.name })
      currId = folder.parentId
    } else {
      break
    }
  }

  return crumbs
})

// Filter Items in Current Folder
const visibleItems = computed(() => {
  // Global search mode
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    return fileSystem.value.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q))
    )
  }

  // Folder level navigation mode
  return fileSystem.value.filter(item => {
    if (item.parentId !== currentFolderId.value) return false

    // Sidebar Category Filters
    if (activeFilter.value === 'folders' && item.type !== 'folder') return false
    if (activeFilter.value === 'html' && item.ext !== 'html') return false
    if (activeFilter.value === 'vue' && item.ext !== 'vue') return false
    if (activeFilter.value === 'python' && item.ext !== 'py') return false
    if (activeFilter.value === 'scripts' && item.ext !== 'sh') return false
    if (activeFilter.value === 'markdown' && item.ext !== 'md') return false

    return true
  })
})

const selectedItem = computed(() => {
  return fileSystem.value.find(i => i.id === selectedItemId.value) || null
})

const getChildCount = (folderId) => {
  return fileSystem.value.filter(i => i.parentId === folderId).length
}

const getItemIcon = (item) => {
  switch (item.ext) {
    case 'html': return 'simple-icons:html5'
    case 'py': return 'simple-icons:python'
    case 'sh': return 'simple-icons:gnubash'
    case 'vue': return 'simple-icons:vuedotjs'
    case 'yml': return 'simple-icons:yaml'
    case 'md': return 'simple-icons:markdown'
    default: return 'lucide:file-code-2'
  }
}

const getItemIconColor = (item) => {
  switch (item.ext) {
    case 'html': return 'text-orange-400'
    case 'py': return 'text-sky-400'
    case 'sh': return 'text-emerald-400'
    case 'vue': return 'text-emerald-500'
    case 'yml': return 'text-purple-400'
    default: return 'text-slate-400'
  }
}

const handleItemDblClick = (item) => {
  if (item.type === 'folder') {
    navigateTo(item.id)
  } else {
    openProject(item)
  }
}

const openProject = (file) => {
  if (file.demoUrl && file.demoUrl !== '#') {
    window.open(file.demoUrl, '_blank')
  } else {
    alert(`Quick Look Preview for ${file.name}:\n\n${file.description}`)
  }
}
</script>
