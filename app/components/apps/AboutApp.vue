<!-- components/apps/AboutApp.vue -->
<template>
  <div class="h-full flex flex-col font-sans text-slate-200">
    <!-- Document Viewer Header / Tabs -->
    <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
      <!-- File Metadata -->
      <div class="flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-md border border-white/5 font-mono text-slate-400">
        <Icon name="lucide:file-text" class="w-4 h-4 text-emerald-400" />
        <span class="text-slate-200 font-semibold">About_Me.md</span>
        <span class="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">v2.0</span>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center space-x-1 bg-slate-950/40 p-1 rounded-md border border-white/5">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center space-x-1.5 px-3 py-1 rounded transition-all text-xs"
          :class="activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'"
        >
          <Icon :name="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Main Tab Content Area -->
    <div class="flex-1 overflow-y-auto pr-1 space-y-4">
      <!-- 1. BIO & OVERVIEW TAB -->
      <div v-if="activeTab === 'overview'" class="space-y-4">
        <!-- Hero Profile Header -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-lg bg-slate-950/50 border border-white/5">
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-slate-950 text-xl font-bold font-mono shadow-lg ring-2 ring-white/10">
            DEV
          </div>
          <div class="text-center sm:text-left flex-1">
            <h2 class="text-base font-bold text-white">Full-Stack & Backend Developer</h2>
            <p class="text-xs font-mono text-emerald-400 mt-0.5">Specialized in Web Development & Cloud Systems</p>
            <p class="text-xs text-slate-300 mt-2 leading-relaxed">
              Passionate about constructing resilient backend APIs, real-time web applications, and intuitive user experiences. Focused on clean architecture, performance optimization, and pragmatic system design.
            </p>
          </div>
        </div>

        <!-- Quick Info Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div v-for="metric in metrics" :key="metric.label" class="bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-center">
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">{{ metric.label }}</span>
            <span class="text-sm font-semibold text-white mt-0.5 block">{{ metric.value }}</span>
          </div>
        </div>
      </div>

      <!-- 2. TECH STACK & SKILLS TAB -->
      <div v-if="activeTab === 'skills'" class="space-y-4">
        <div v-for="category in skillCategories" :key="category.name" class="space-y-2">
          <span class="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Icon :name="category.icon" class="w-3.5 h-3.5 text-emerald-400" />
            {{ category.name }}
          </span>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="skill in category.items"
              :key="skill"
              class="text-xs font-mono bg-slate-950/60 border border-white/10 px-2.5 py-1 rounded text-slate-200 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <!-- 3. TIMELINE & EXPERIENCE TAB -->
      <div v-if="activeTab === 'experience'" class="space-y-3 relative pl-4 border-l border-white/10 ml-2 my-2">
        <div v-for="item in experience" :key="item.role" class="relative group">
          <!-- Timeline Marker -->
          <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 border border-emerald-400 group-hover:bg-emerald-400 transition-colors" />

          <div class="bg-slate-950/40 border border-white/5 rounded-lg p-3 hover:border-white/10 transition-colors">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-xs font-semibold text-white">{{ item.role }}</h4>
                <p class="text-[11px] text-emerald-400 font-mono">{{ item.company }}</p>
              </div>
              <span class="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">{{ item.period }}</span>
            </div>
            <p class="text-xs text-slate-300 mt-2 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions / Resume Download Footer -->
    <div class="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
      <span class="text-[11px] text-slate-500 font-mono">Status: Available for opportunities</span>
      <a
        href="#"
        @click.prevent="downloadResume"
        class="flex items-center space-x-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded text-xs transition-colors"
      >
        <Icon name="lucide:download" class="w-3.5 h-3.5" />
        <span>Download CV</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Bio', icon: 'lucide:user' },
  { id: 'skills', label: 'Skills', icon: 'lucide:code-2' },
  { id: 'experience', label: 'Experience', icon: 'lucide:briefcase' }
]

const metrics = [
  { label: 'Role', value: 'Full-Stack' },
  { label: 'Primary Tech', value: 'Vue / Python' },
  { label: 'Database', value: 'PostgreSQL' },
  { label: 'Focus', value: 'Web Systems' }
]

const skillCategories = [
  {
    name: 'Backend & APIs',
    icon: 'lucide:server',
    items: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'ORMs']
  },
  {
    name: 'Frontend Frameworks',
    icon: 'lucide:layout',
    items: ['Vue.js', 'Nuxt 3', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3']
  },
  {
    name: 'Tooling & DevOps',
    icon: 'lucide:wrench',
    items: ['Docker', 'Git', 'Vite', 'Neovim', 'Linux/Bash']
  }
]

const experience = [
  {
    role: 'Full-Stack Developer',
    company: 'Software Consultancy',
    period: '2024 - Present',
    description: 'Building modern web applications with Nuxt, Vue 3, and FastAPI services with PostgreSQL backends.'
  },
  {
    role: 'Backend Engineering Focus',
    company: 'Web Projects',
    period: '2022 - 2024',
    description: 'Designed and implemented database schemas, API integrations, containerized workflows, and automated testing pipelines.'
  }
]

const downloadResume = () => {
  // Replace with direct path to your resume file in public/ folder (e.g. /resume.pdf)
  alert('Resume download triggered. Place your CV file at /public/resume.pdf to complete this link.')
}
</script>
