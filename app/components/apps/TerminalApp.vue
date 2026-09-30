<!-- components/apps/TerminalApp.vue -->
<template>
  <div
    class="h-full flex flex-col font-mono text-xs bg-slate-950/90 text-slate-200 p-3 rounded-b-lg overflow-hidden select-text"
    @click="focusInput"
  >
    <!-- Terminal Header Bar -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-500 text-[11px] select-none">
      <div class="flex items-center space-x-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
        <span class="text-slate-400 font-semibold">zsh — dev-terminal</span>
      </div>
      <span>Type 'help' for commands</span>
    </div>

    <!-- Output Logs Area -->
    <div ref="outputRef" class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
      <!-- Welcome Greeting -->
      <div class="text-slate-400">
        <p class="text-emerald-400 font-bold">Terminal Shell [Version 1.0.0]</p>
        <p>Type <span class="text-sky-300 font-bold">help</span> to list available commands or <span class="text-sky-300 font-bold">clear</span> to reset view.</p>
      </div>

      <!-- History Entries -->
      <div v-for="(entry, index) in history" :key="index" class="space-y-1">
        <!-- Command Prompt Line -->
        <div class="flex items-center space-x-2">
          <span class="text-emerald-400 font-bold">guest@portfolio</span>
          <span class="text-slate-500">:</span>
          <span class="text-sky-400 font-bold">~{{ entry.dir }}</span>
          <span class="text-slate-300">$</span>
          <span class="text-white font-medium">{{ entry.command }}</span>
        </div>

        <!-- Command Output Result -->
        <div
          v-if="entry.output"
          class="pl-4 text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-xs border-l border-white/10"
          :class="{ 'text-red-400': entry.isError }"
        >
          <component :is="entry.outputIsComponent ? entry.output : 'div'">
            {{ entry.output }}
          </component>
        </div>
      </div>

      <!-- Active Input Prompt Line -->
      <form @submit.prevent="executeCommand" class="flex items-center space-x-2 pt-1">
        <span class="text-emerald-400 font-bold">guest@portfolio</span>
        <span class="text-slate-500">:</span>
        <span class="text-sky-400 font-bold">~{{ currentDir }}</span>
        <span class="text-slate-300">$</span>
        <input
          ref="inputRef"
          v-model="currentCommand"
          type="text"
          class="flex-1 bg-transparent border-none outline-none text-white font-mono focus:ring-0 p-0 text-xs"
          autofocus
          spellcheck="false"
          autocomplete="off"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useWindowManager } from '~/composables/useWindowManager'

interface HistoryEntry {
  command: string
  output?: string | any
  outputIsComponent?: boolean
  dir: string
  isError?: boolean
}

const { openWindow } = useWindowManager()

const currentCommand = ref('')
const currentDir = ref('')
const history = ref<HistoryEntry[]>([])
const inputRef = ref<HTMLInputElement | null>(null)
const outputRef = ref<HTMLElement | null>(null)

const focusInput = () => {
  inputRef.value?.focus()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  })
}

const executeCommand = () => {
  const cmd = currentCommand.value.trim()
  if (!cmd) return

  const entry: HistoryEntry = {
    command: cmd,
    dir: currentDir.value,
    isError: false
  }

  const parts = cmd.split(' ')
  const root = parts[0].toLowerCase()
  const args = parts.slice(1)

  switch (root) {
    case 'help':
      entry.output = `Available Commands:
  • help          - Display list of available terminal commands
  • ls            - List contents of current directory
  • cat [file]    - View contents of a file (e.g. cat bio.txt)
  • open [app]    - Open a desktop app (e.g. open projects, open about, open contact)
  • projects      - Quick shortcut to launch Projects window
  • about         - Quick shortcut to launch About window
  • contact       - Quick shortcut to launch Contact window
  • whoami        - Print current terminal session user details
  • clear         - Clear the terminal screen buffer`
      break

    case 'ls':
      entry.output = `projects/     about.txt     skills.json     contact.sh`
      break

    case 'whoami':
      entry.output = `guest@visitor-session [Role: Recruiter / Developer]`
      break

    case 'cat':
      if (args[0] === 'about.txt' || args[0] === 'about') {
        entry.output = `Full-Stack Developer specialized in Vue.js, Nuxt 3, FastAPI, Python, and PostgreSQL.`
      } else if (args[0] === 'skills.json') {
        entry.output = `{\n  "frontend": ["Vue 3", "Nuxt 3", "TypeScript", "Tailwind CSS"],\n  "backend": ["Python", "FastAPI", "PostgreSQL", "Docker"]\n}`
      } else if (args[0] === 'contact.sh') {
        entry.output = `echo "Reach out via email or launch the Contact app on desktop!"`
      } else {
        entry.isError = true
        entry.output = `cat: ${args[0] || 'file'}: No such file or directory. Try 'ls'`
      }
      break

    case 'open':
    case 'launch':
      const appName = args[0]?.toLowerCase()
      if (['projects', 'about', 'contact', 'terminal'].includes(appName)) {
        openWindow(appName)
        entry.output = `Successfully launched [${appName}] application window.`
      } else {
        entry.isError = true
        entry.output = `Unknown application '${args[0]}'. Valid apps: projects, about, contact.`
      }
      break

    case 'projects':
      openWindow('projects')
      entry.output = `Opening Projects window...`
      break

    case 'about':
      openWindow('about')
      entry.output = `Opening About window...`
      break

    case 'contact':
      openWindow('contact')
      entry.output = `Opening Contact window...`
      break

    case 'clear':
      history.value = []
      currentCommand.value = ''
      return

    default:
      entry.isError = true
      entry.output = `Command not found: ${root}. Type 'help' to see valid commands.`
      break
  }

  history.value.push(entry)
  currentCommand.value = ''
  scrollToBottom()
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>
