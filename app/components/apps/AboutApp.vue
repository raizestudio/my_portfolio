<!-- components/apps/AboutApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-950 text-slate-200 font-sans select-none overflow-hidden">

    <!-- macOS Preview PDF Toolbar -->
    <div class="h-11 px-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 text-xs text-slate-300">

      <!-- Left: Sidebar Toggle & Page Indicator -->
      <div class="flex items-center gap-3">
        <button
          @click="showSidebar = !showSidebar"
          class="p-1.5 rounded hover:bg-white/10 transition-colors"
          :class="{ 'bg-white/15 text-white': showSidebar }"
          title="Toggle Thumbnails Sidebar"
        >
          <Icon name="lucide:panel-left" class="w-4 h-4" />
        </button>

        <div class="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-white/10 font-mono text-[11px]">
          <span>Page {{ currentPage }} of 2</span>
        </div>
      </div>

      <!-- Center: Document Title -->
      <div class="hidden sm:flex items-center gap-1.5 font-medium text-slate-200">
        <Icon name="lucide:file-text" class="w-4 h-4 text-rose-400" />
        <span>About_Me.pdf</span>
      </div>

      <!-- Right: Zoom Controls & PDF Download -->
      <div class="flex items-center gap-2">
        <div class="flex items-center bg-slate-950/60 rounded border border-white/10 p-0.5">
          <button @click="zoomOut" class="p-1 hover:bg-white/10 rounded transition-colors" title="Zoom Out">
            <Icon name="lucide:minus" class="w-3.5 h-3.5" />
          </button>
          <span class="px-2 font-mono text-[11px] w-12 text-center">{{ Math.round(zoomLevel * 100) }}%</span>
          <button @click="zoomIn" class="p-1 hover:bg-white/10 rounded transition-colors" title="Zoom In">
            <Icon name="lucide:plus" class="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          @click="downloadPDF"
          class="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium px-2.5 py-1 rounded transition-colors"
        >
          <Icon name="lucide:download" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Export PDF</span>
        </button>
      </div>

    </div>

    <!-- PDF Viewing Area -->
    <div class="flex-1 flex overflow-hidden bg-slate-900/80">

      <!-- Thumbnail Sidebar -->
      <div
        v-if="showSidebar"
        class="w-40 bg-slate-950/80 border-r border-white/10 p-3 space-y-3 overflow-y-auto shrink-0 hidden sm:block"
      >
        <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-1">Pages</div>

        <!-- Thumbnail Page 1 -->
        <button
          @click="scrollToPage(1)"
          class="w-full group flex flex-col items-center gap-1 text-left focus:outline-none"
        >
          <div
            class="w-full aspect-[1/1.3] bg-slate-900 rounded border transition-all p-1.5 flex flex-col justify-between overflow-hidden shadow-md"
            :class="currentPage === 1 ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-white/10 group-hover:border-white/30'"
          >
            <div class="space-y-1">
              <div class="h-2 w-3/4 bg-slate-700 rounded" />
              <div class="h-1.5 w-1/2 bg-slate-800 rounded" />
              <div class="h-1 w-full bg-slate-800/60 rounded" />
              <div class="h-1 w-5/6 bg-slate-800/60 rounded" />
            </div>
            <div class="h-1 w-1/3 bg-rose-500/50 rounded" />
          </div>
          <span class="text-[11px] font-mono text-slate-400">1</span>
        </button>

        <!-- Thumbnail Page 2 -->
        <button
          @click="scrollToPage(2)"
          class="w-full group flex flex-col items-center gap-1 text-left focus:outline-none"
        >
          <div
            class="w-full aspect-[1/1.3] bg-slate-900 rounded border transition-all p-1.5 flex flex-col justify-between overflow-hidden shadow-md"
            :class="currentPage === 2 ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-white/10 group-hover:border-white/30'"
          >
            <div class="space-y-1">
              <div class="h-1.5 w-full bg-slate-800/60 rounded" />
              <div class="h-1.5 w-4/5 bg-slate-800/60 rounded" />
              <div class="h-1.5 w-full bg-slate-800/60 rounded" />
            </div>
            <div class="h-1 w-1/2 bg-slate-700 rounded" />
          </div>
          <span class="text-[11px] font-mono text-slate-400">2</span>
        </button>
      </div>

      <!-- Main PDF Canvas Container -->
      <div
        ref="pdfContainer"
        @scroll="handleScroll"
        class="flex-1 overflow-auto p-6 flex flex-col items-center gap-8"
      >
        <div
          class="transition-transform origin-top duration-150 flex flex-col gap-8"
          :style="{ transform: `scale(${zoomLevel})` }"
        >

          <!-- PAGE 1 SHEET -->
          <div
            ref="page1Ref"
            class="w-[520px] sm:w-[600px] min-h-[750px] bg-slate-900 border border-white/10 rounded-lg shadow-2xl p-8 text-slate-200 flex flex-col justify-between relative overflow-hidden"
          >
            <!-- Watermark / Decorative Accent -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none" />

            <div class="space-y-6">
              <!-- Header -->
              <div class="flex justify-between items-start border-b border-white/10 pb-6">
                <div>
                  <h1 class="text-2xl font-bold text-white tracking-tight">Full-Stack Engineer</h1>
                  <p class="text-rose-400 font-mono text-xs mt-1">Web Systems & Cloud Infrastructure</p>
                </div>
                <div class="text-right text-xs text-slate-400 font-mono space-y-1">
                  <div>location: Remote / Global</div>
                  <div>status: Open to Work</div>
                </div>
              </div>

              <!-- Executive Summary -->
              <div>
                <h3 class="text-xs font-mono font-semibold uppercase text-slate-400 mb-2 tracking-wider">Executive Summary</h3>
                <p class="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-white/5">
                  Passionate developer specializing in building scalable web applications, REST/gRPC APIs, and resilient cloud architectures. Experienced in translating complex business requirements into high-performance digital products using modern web frameworks.
                </p>
              </div>

              <!-- Primary Technical Capabilities -->
              <div>
                <h3 class="text-xs font-mono font-semibold uppercase text-slate-400 mb-3 tracking-wider">Core Competencies</h3>
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div class="bg-slate-950/40 p-3 rounded-lg border border-white/5 space-y-1">
                    <span class="font-semibold text-rose-300">Backend Architecture</span>
                    <p class="text-[11px] text-slate-400">Python (FastAPI, Django), Node.js, PostgreSQL, REST APIs, Microservices</p>
                  </div>
                  <div class="bg-slate-950/40 p-3 rounded-lg border border-white/5 space-y-1">
                    <span class="font-semibold text-sky-300">Frontend Engineering</span>
                    <p class="text-[11px] text-slate-400">Vue.js, Nuxt 3, TypeScript, Tailwind CSS, Responsive Design Systems</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page Footer -->
            <div class="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>About_Me.pdf — Page 1 of 2</span>
              <span>Confidential / Portfolio Resume</span>
            </div>
          </div>

          <!-- PAGE 2 SHEET -->
          <div
            ref="page2Ref"
            class="w-[520px] sm:w-[600px] min-h-[750px] bg-slate-900 border border-white/10 rounded-lg shadow-2xl p-8 text-slate-200 flex flex-col justify-between relative overflow-hidden"
          >
            <div class="space-y-6">
              <!-- Professional Experience -->
              <div>
                <h3 class="text-xs font-mono font-semibold uppercase text-slate-400 mb-4 tracking-wider">Professional Timeline</h3>
                <div class="space-y-4 pl-3 border-l border-white/10">

                  <div class="relative pl-4">
                    <div class="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-rose-500" />
                    <div class="flex justify-between items-start">
                      <h4 class="text-xs font-bold text-white">Senior Web Engineer</h4>
                      <span class="text-[10px] font-mono text-slate-400">2024 — Present</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-1">
                      Engineered distributed web portals and vector search workflows. Improved client rendering performance by 40% with Vue 3 / Nuxt SSR optimizations.
                    </p>
                  </div>

                  <div class="relative pl-4">
                    <div class="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-slate-600" />
                    <div class="flex justify-between items-start">
                      <h4 class="text-xs font-bold text-white">Full-Stack Developer</h4>
                      <span class="text-[10px] font-mono text-slate-400">2022 — 2024</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-1">
                      Architected RESTful APIs and real-time database synchronizations utilizing PostgreSQL and FastAPI.
                    </p>
                  </div>

                </div>
              </div>

              <!-- Education & Certifications -->
              <div>
                <h3 class="text-xs font-mono font-semibold uppercase text-slate-400 mb-3 tracking-wider">Education & Tools</h3>
                <div class="bg-slate-950/40 p-4 rounded-lg border border-white/5 space-y-2 text-xs">
                  <div class="flex justify-between">
                    <span class="font-medium text-slate-200">B.S. in Computer Science</span>
                    <span class="text-slate-400 font-mono text-[11px]">Software Engineering</span>
                  </div>
                  <div class="text-[11px] text-slate-400">
                    Tooling: Docker, Kubernetes, Git, Linux, Neovim, CI/CD Pipelines
                  </div>
                </div>
              </div>
            </div>

            <!-- Page Footer -->
            <div class="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>About_Me.pdf — Page 2 of 2</span>
              <span>End of Document</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showSidebar = ref(true)
const zoomLevel = ref(1)
const currentPage = ref(1)

const pdfContainer = ref(null)
const page1Ref = ref(null)
const page2Ref = ref(null)

const zoomIn = () => {
  if (zoomLevel.value < 1.5) zoomLevel.value += 0.1
}

const zoomOut = () => {
  if (zoomLevel.value > 0.6) zoomLevel.value -= 0.1
}

const scrollToPage = (pageNumber) => {
  currentPage.value = pageNumber
  const target = pageNumber === 1 ? page1Ref.value : page2Ref.value
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleScroll = (e) => {
  if (!page2Ref.value) return
  const page2Top = page2Ref.value.getBoundingClientRect().top
  if (page2Top < window.innerHeight / 2) {
    currentPage.value = 2
  } else {
    currentPage.value = 1
  }
}

const downloadPDF = () => {
  // Triggers window print (allows saving as PDF directly from browser)
  if (import.meta.client) {
    window.print()
  }
}
</script>
