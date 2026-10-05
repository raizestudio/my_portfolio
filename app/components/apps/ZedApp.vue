<!-- components/apps/ZedApp.vue -->
<template>
  <div class="h-full flex flex-col bg-[#18181b] text-zinc-300 font-mono text-xs select-none overflow-hidden transition-colors duration-200 relative">

    <!-- Top Bar / Titlebar -->
    <div class="h-10 sm:h-9 bg-[#121215] border-b border-zinc-800/80 flex items-center justify-between px-2.5 sm:px-3 shrink-0 text-zinc-400 text-[11px] gap-2">
      <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <button
          @click="showSidebar = !showSidebar"
          class="p-1.5 sm:p-1 hover:bg-zinc-800 rounded transition-colors cursor-pointer text-zinc-300"
          :class="{ 'text-zinc-100 bg-zinc-800': showSidebar }"
          title="Toggle File Drawer"
        >
          <Icon class="w-4 h-4 sm:w-3.5 sm:h-3.5" name="lucide:panel-left"/>
        </button>
        <span class="text-zinc-500 hidden md:inline">zed-playground</span>
        <span class="text-zinc-600 hidden md:inline">/</span>
        <span class="text-zinc-200 font-medium truncate max-w-[100px] sm:max-w-[160px] md:max-w-none">
          {{ activeFile ? activeFile.name : 'Welcome' }}
        </span>
      </div>

      <!-- New File & Run Quick Actions -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          @click="openNewFileModal"
          class="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2 py-1 sm:py-0.5 rounded text-[10px] transition-colors cursor-pointer"
        >
          <Icon class="w-3.5 h-3.5 sm:w-3 sm:h-3 text-sky-400" name="lucide:file-plus"/>
          <span class="hidden xs:inline">New File</span>
          <kbd class="text-zinc-500 text-[9px] font-mono ml-0.5 hidden sm:inline">⌘N</kbd>
        </button>

        <button
          v-if="activeFile"
          @click="executeCode"
          class="flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-2 py-1 sm:py-0.5 rounded text-[10px] transition-colors cursor-pointer"
          title="Run Code in Zed Terminal"
        >
          <Icon class="w-3.5 h-3.5 sm:w-3 sm:h-3 fill-current" name="lucide:play"/>
          <span class="hidden xs:inline">Run</span>
          <kbd class="text-emerald-400/70 text-[9px] font-mono ml-0.5 hidden sm:inline">⌘↵</kbd>
        </button>

        <button
          @click="showAssistant = !showAssistant"
          class="flex items-center gap-1 p-1.5 sm:px-2 sm:py-0.5 rounded text-[11px] transition-colors cursor-pointer"
          :class="showAssistant ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'hover:bg-zinc-800 text-zinc-400'"
          title="Toggle Zed Assistant"
        >
          <Icon class="w-4 h-4 sm:w-3.5 sm:h-3.5" name="lucide:sparkles"/>
          <span class="hidden md:inline">Assistant</span>
        </button>

        <button
          @click="showTerminal = !showTerminal"
          class="p-1.5 sm:p-1 hover:bg-zinc-800 rounded text-zinc-400 transition-colors cursor-pointer"
          :class="{ 'text-zinc-100 bg-zinc-800': showTerminal }"
          title="Toggle Terminal Drawer"
        >
          <Icon class="w-4 h-4 sm:w-3.5 sm:h-3.5" name="lucide:terminal"/>
        </button>
      </div>
    </div>

    <!-- Main Workspace Layout -->
    <div class="flex-1 flex overflow-hidden relative">

      <!-- Mobile Sidebar Overlay Backdrop -->
      <div
        v-if="showSidebar"
        @click="showSidebar = false"
        class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-20"
      />

      <!-- Left Sidebar: Project File Explorer -->
      <div
        v-if="showSidebar"
        class="fixed md:relative inset-y-0 left-0 z-30 w-64 md:w-52 bg-[#121215] border-r border-zinc-800/80 flex flex-col shrink-0 text-[11px] shadow-2xl md:shadow-none transition-all duration-200"
      >
        <div class="px-3 py-2.5 sm:py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex justify-between items-center border-b border-zinc-800/40 md:border-b-0">
          <span>Project Workspace</span>
          <div class="flex items-center gap-2">
            <button @click="openNewFileModal" class="hover:text-zinc-200 p-1 cursor-pointer" title="Create File">
              <Icon class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-zinc-400" name="lucide:plus"/>
            </button>
            <button @click="showSidebar = false" class="md:hidden hover:text-zinc-200 p-1 cursor-pointer" title="Close Sidebar">
              <Icon class="w-4 h-4 text-zinc-500" name="lucide:x"/>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-1.5 py-1 space-y-0.5">
          <div v-if="files.length === 0" class="px-3 py-6 text-[10px] text-zinc-600 text-center">
            No files created yet.
            <button @click="openNewFileModal" class="block mx-auto mt-2 text-sky-400 underline cursor-pointer">
              Create one
            </button>
          </div>

          <div
            v-for="file in files"
            :key="file.id"
            @click="selectFileMobile(file)"
            class="group flex items-center justify-between px-2.5 py-1.5 sm:py-1 rounded cursor-pointer transition-colors"
            :class="activeFileId === file.id ? 'bg-zinc-800/90 text-zinc-100 font-medium' : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'"
          >
            <div class="flex items-center gap-2 min-w-0 truncate">
              <Icon :name="getFileIcon(file.name)" class="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0"/>
              <span class="truncate">{{ file.name }}</span>
            </div>
            <button
              @click.stop="deleteFile(file.id)"
              class="opacity-80 md:opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 sm:p-0.5 rounded cursor-pointer"
            >
              <Icon class="w-3.5 h-3.5 sm:w-3 sm:h-3" name="lucide:trash-2"/>
            </button>
          </div>
        </div>
      </div>

      <!-- Center Code Editor Container -->
      <div class="flex-1 flex flex-col min-w-0 bg-[#18181b] relative">

        <!-- Tab Bar -->
        <div v-if="openTabs.length > 0" class="h-8 bg-[#121215] border-b border-zinc-800/80 flex items-center overflow-x-auto shrink-0 custom-scrollbar">
          <div
            v-for="tab in openTabs"
            :key="tab.id"
            @click="activeFileId = tab.id"
            class="group h-full px-3 flex items-center gap-2 border-r border-zinc-800/60 text-[11px] cursor-pointer shrink-0 transition-colors relative"
            :class="activeFileId === tab.id ? 'bg-[#18181b] text-zinc-100 font-medium' : 'bg-[#121215] text-zinc-500 hover:text-zinc-300'"
          >
            <Icon :name="getFileIcon(tab.name)" class="w-3.5 h-3.5"/>
            <span>{{ tab.name }}</span>
            <button
              @click.stop="closeTab(tab.id)"
              class="opacity-70 md:opacity-0 group-hover:opacity-100 hover:bg-zinc-800 rounded p-1 sm:p-0.5 text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer"
            >
              <Icon class="w-3.5 h-3.5 sm:w-3 sm:h-3" name="lucide:x"/>
            </button>
            <div v-if="activeFileId === tab.id" class="absolute top-0 left-0 right-0 h-[2px] bg-sky-500"></div>
          </div>
        </div>

        <!-- Empty Welcome Canvas -->
        <div v-if="!activeFile" class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 text-zinc-500 select-none">
          <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-xl">
            <Icon class="w-6 h-6 text-sky-400" name="lucide:code-2"/>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-zinc-200">Zed Code Playground</h3>
            <p class="text-[11px] text-zinc-500 max-w-xs">Create a new file to start coding with real syntax highlighting and live execution.</p>
          </div>
          <button
            @click="openNewFileModal"
            class="bg-sky-600 hover:bg-sky-500 text-white font-medium px-3.5 py-1.5 rounded-md text-xs transition-colors shadow-lg cursor-pointer"
          >
            + Create New File
          </button>
        </div>

        <!-- Active Code Editor Canvas -->
        <div v-else class="flex-1 flex flex-col min-h-0 relative">
          <!-- Breadcrumb Bar -->
          <div class="h-6 px-3 sm:px-4 border-b border-zinc-800/40 flex items-center justify-between text-[10px] text-zinc-500 bg-[#151518] shrink-0">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="hidden sm:inline">zed-playground</span>
              <Icon class="w-3 h-3 text-zinc-700 hidden sm:inline" name="lucide:chevron-right"/>
              <span class="text-zinc-300 font-medium truncate">{{ activeFile.name }}</span>
            </div>
            <span class="text-zinc-600 uppercase font-mono shrink-0 ml-2">{{ activeFile.language }}</span>
          </div>

          <!-- Code Overlay Container -->
          <div class="flex-1 overflow-hidden relative flex font-mono leading-relaxed">
            <!-- Line Numbers (16px on mobile prevents safari auto-zoom alignment mismatch) -->
            <div
              ref="lineNumbersRef"
              class="select-none text-zinc-600 text-right pr-2 sm:pr-3 pl-2 sm:pl-3 py-3 sm:py-4 font-mono space-y-0.5 shrink-0 bg-[#151518]/50 border-r border-zinc-800/40 overflow-hidden text-[16px] md:text-[12px] leading-relaxed"
            >
              <div v-for="line in lineCount" :key="line">{{ line }}</div>
            </div>

            <!-- Dual-layer Editor: Highlighting Preview + Textarea -->
            <div class="flex-1 relative overflow-hidden h-full">
              <!-- Rendered Syntax Highlighted Layer -->
              <pre
                ref="preRef"
                class="absolute inset-0 p-3 sm:p-4 m-0 pointer-events-none font-mono text-[16px] md:text-[12px] leading-relaxed whitespace-pre overflow-hidden z-0 text-zinc-200 border-0"
              ><code class="font-mono bg-transparent p-0 m-0 border-0 text-[16px] md:text-[12px] leading-relaxed" v-html="highlightedCode"></code></pre>

              <!-- Transparent Input Textarea Layer (text-[16px] prevents iOS Safari auto-zoom) -->
              <textarea
                ref="textareaRef"
                v-model="activeFile.content"
                @scroll="syncScroll"
                @keydown="handleEditorKeydown"
                spellcheck="false"
                placeholder="// Type code here..."
                class="absolute inset-0 p-3 sm:p-4 m-0 w-full h-full bg-transparent text-transparent caret-white resize-none font-mono text-[16px] md:text-[12px] leading-relaxed whitespace-pre overflow-auto z-10 focus:outline-none border-0 selection:bg-sky-500/30 select-text touch-manipulation"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Terminal Bottom Drawer -->
        <div v-if="showTerminal" class="h-36 sm:h-40 bg-[#121215] border-t border-zinc-800/80 flex flex-col shrink-0 font-mono text-[11px] z-10">
          <div class="h-7 sm:h-6 px-3 border-b border-zinc-800/60 flex items-center justify-between text-zinc-500">
            <div class="flex items-center gap-3">
              <span class="text-zinc-200 font-semibold text-[10px] uppercase tracking-wider">Terminal Output</span>
              <button @click="clearTerminal" class="hover:text-zinc-300 text-[10px] p-0.5 cursor-pointer">Clear</button>
            </div>
            <button @click="showTerminal = false" class="hover:text-zinc-200 p-1 cursor-pointer">
              <Icon class="w-3.5 h-3.5 sm:w-3 sm:h-3" name="lucide:x"/>
            </button>
          </div>

          <div class="flex-1 p-2.5 sm:p-3 overflow-y-auto space-y-1 text-zinc-300" ref="terminalOutputRef">
            <div v-for="(log, i) in terminalLogs" :key="i" class="leading-relaxed">
              <span v-if="log.type === 'command'" class="text-emerald-400">➜ {{ log.text }}</span>
              <span v-else-if="log.type === 'error'" class="text-rose-400">{{ log.text }}</span>
              <span v-else-if="log.type === 'info'" class="text-sky-400">{{ log.text }}</span>
              <span v-else class="text-zinc-300 whitespace-pre-wrap">{{ log.text }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Mobile AI Assistant Overlay Backdrop -->
      <div
        v-if="showAssistant"
        @click="showAssistant = false"
        class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-20"
      />

      <!-- Right Zed AI Assistant Drawer -->
      <div
        v-if="showAssistant"
        class="fixed md:relative inset-y-0 right-0 z-30 w-full sm:w-80 md:w-72 bg-[#121215] border-l border-zinc-800/80 flex flex-col shrink-0 text-xs shadow-2xl md:shadow-none transition-all duration-200"
      >
        <div class="p-3 border-b border-zinc-800/80 flex items-center justify-between text-amber-400 font-semibold text-[11px]">
          <div class="flex items-center gap-1.5">
            <Icon class="w-4 h-4" name="lucide:sparkles"/>
            <span>Zed AI Assistant</span>
          </div>
          <button @click="showAssistant = false" class="text-zinc-500 hover:text-zinc-200 p-1 cursor-pointer">
            <Icon class="w-4 h-4 sm:w-3.5 sm:h-3.5" name="lucide:x"/>
          </button>
        </div>

        <div class="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-[11px]">
          <div class="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-zinc-300 space-y-1">
            <div class="font-semibold text-amber-400 flex items-center gap-1">
              <Icon class="w-3.5 h-3.5" name="lucide:bot"/> Context Active
            </div>
            <p class="text-zinc-400 text-[10px] leading-normal">
              {{ activeFile ? `Reading ${activeFile.name} (${activeFile.language})` : 'No file currently open.' }}
            </p>
          </div>

          <div v-for="(msg, idx) in chatMessages" :key="idx" class="space-y-1">
            <div class="text-[10px] text-zinc-500 font-mono">{{ msg.sender }}</div>
            <div
              class="p-2.5 sm:p-2 rounded-lg text-[11px] leading-relaxed whitespace-pre-wrap group relative"
              :class="msg.sender === 'You' ? 'bg-sky-600/20 border border-sky-500/30 text-sky-200' : 'bg-zinc-800/80 text-zinc-200'"
            >
              {{ msg.text }}

              <button
                v-if="msg.codeSnippet && activeFile"
                @click="applySnippetToActiveFile(msg.codeSnippet)"
                class="mt-2 w-full py-1.5 sm:py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[10px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Icon name="lucide:file-input" class="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                <span>Insert into {{ activeFile.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="p-2.5 border-t border-zinc-800/80 bg-zinc-900/60">
          <input
            v-model="userPrompt"
            @keydown.enter="sendPrompt"
            type="text"
            placeholder="Ask AI to write or explain code..."
            class="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-2 sm:py-1.5 text-zinc-200 text-[16px] sm:text-[11px] placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

    </div>

    <!-- New File Creation Modal -->
    <div
      v-if="showNewFileModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-xs sm:w-80 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl space-y-3 font-sans text-xs">
        <div class="flex justify-between items-center text-zinc-200 font-semibold">
          <span>Create New File</span>
          <button @click="showNewFileModal = false" class="text-zinc-500 hover:text-zinc-200 p-1 cursor-pointer">✕</button>
        </div>
        <p class="text-[11px] text-zinc-400 leading-normal">
          Type file name with extension (e.g., <code class="text-sky-400">script.py</code>, <code class="text-amber-400">app.ts</code>).
        </p>
        <input
          v-model="newFileNameInput"
          @keydown.enter="createNewFile"
          ref="newFileInputRef"
          type="text"
          placeholder="filename.ext"
          class="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 sm:py-1.5 text-zinc-100 font-mono text-[16px] sm:text-xs focus:outline-none focus:border-sky-500"
        />
        <div class="flex justify-end gap-2 pt-1">
          <button
            @click="showNewFileModal = false"
            class="px-3 py-1.5 sm:py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="createNewFile"
            class="px-3.5 py-1.5 sm:py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-medium cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Zed Bottom Status Bar -->
    <div class="h-6 bg-[#0e0e11] border-t border-zinc-800/80 flex items-center justify-between px-2.5 sm:px-3 shrink-0 text-[10px] text-zinc-500">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex items-center gap-1 text-zinc-400">
          <Icon class="w-3 h-3 text-emerald-400" name="lucide:git-branch"/>
          main
        </span>
        <span class="text-zinc-700 hidden sm:inline">|</span>
        <span class="hidden sm:inline">UTF-8</span>
        <span class="text-zinc-700">|</span>
        <span class="text-zinc-300">{{ activeFile ? activeFile.language : 'Plain Text' }}</span>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <span v-if="activeFile" class="hidden sm:inline">Lines: {{ lineCount }}</span>
        <div class="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[9px]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Zed Online</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/tokyo-night-dark.css'

interface CodeFile {
  id: string
  name: string
  language: string
  content: string
}

interface TerminalLog {
  type: 'command' | 'output' | 'error' | 'info'
  text: string
}

interface ChatMessage {
  sender: string
  text: string
  codeSnippet?: string
}

const showSidebar = ref(false)
const showAssistant = ref(false)
const showTerminal = ref(false)
const showNewFileModal = ref(false)
const newFileNameInput = ref('')
const newFileInputRef = ref<HTMLInputElement | null>(null)

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const preRef = ref<HTMLPreElement | null>(null)
const lineNumbersRef = ref<HTMLDivElement | null>(null)
const terminalOutputRef = ref<HTMLDivElement | null>(null)

const activeFileId = ref<string>('demo-py')
const openTabIds = ref<string[]>(['demo-py'])
const userPrompt = ref('')

const files = useLocalStorage<CodeFile[]>('zed-workspace-files', [
  {
    id: 'demo-py',
    name: 'demo.py',
    language: 'python',
    content: `# Welcome to Zed IDE Simulator\ndef greet(name: str) -> str:\n    return f"Hello, {name}! Ready to code in Python?"\n\nprint(greet("Developer"))\n`
  },
  {
    id: 'app-ts',
    name: 'app.ts',
    language: 'typescript',
    content: `// TypeScript execution support\ninterface User {\n  name: string;\n  role: string;\n}\n\nconst developer: User = {\n  name: "Joel PINHO",\n  role: "Senior Engineer"\n};\n\nconsole.log(\`Developer: \${developer.name} (\${developer.role})\`);\n`
  }
])

const terminalLogs = ref<TerminalLog[]>([
  { type: 'info', text: 'Zed Terminal ready. Press ⌘+Enter or click "Run" to execute.' }
])

const chatMessages = ref<ChatMessage[]>([
  {
    sender: 'Zed AI',
    text: 'Hello! I am your AI coding pair assistant inside Zed.',
    codeSnippet: 'print("Hello from Zed AI!")'
  }
])

const selectFileMobile = (file: CodeFile) => {
  openFile(file)
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    showSidebar.value = false
  }
}

const syncScroll = () => {
  if (textareaRef.value && preRef.value) {
    preRef.value.scrollTop = textareaRef.value.scrollTop
    preRef.value.scrollLeft = textareaRef.value.scrollLeft
  }
  if (textareaRef.value && lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

const detectLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const langMap: Record<string, string> = {
    py: 'python',
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    rs: 'rust',
    json: 'json',
    md: 'markdown',
    html: 'html',
    css: 'css',
    cpp: 'cpp',
    go: 'go',
    sh: 'bash'
  }
  return langMap[ext] || 'plaintext'
}

const getFileIcon = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const iconMap: Record<string, string> = {
    py: 'logos:python',
    ts: 'logos:typescript-icon',
    js: 'logos:javascript',
    rs: 'vscode-icons:file-type-rust',
    json: 'vscode-icons:file-type-json',
    md: 'lucide:file-text',
    html: 'logos:html-5',
    css: 'logos:css-3',
    cpp: 'vscode-icons:file-type-cpp',
    go: 'logos:go'
  }
  return iconMap[ext] || 'lucide:file-code'
}

const openTabs = computed(() => {
  return files.value.filter(f => openTabIds.value.includes(f.id))
})

const activeFile = computed(() => {
  return files.value.find(f => f.id === activeFileId.value)
})

const lineCount = computed(() => {
  if (!activeFile.value) return 0
  return activeFile.value.content.split('\n').length || 1
})

const highlightedCode = computed(() => {
  if (!activeFile.value) return ''
  const code = activeFile.value.content
  const lang = activeFile.value.language

  let html = ''
  if (lang && hljs.getLanguage(lang)) {
    try {
      html = hljs.highlight(code, { language: lang }).value
    } catch {
      html = escapeHtml(code)
    }
  } else {
    html = escapeHtml(code)
  }

  if (html.endsWith('\n')) {
    html += ' '
  }

  return html
})

const escapeHtml = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const applySnippetToActiveFile = (snippet: string) => {
  if (activeFile.value) {
    activeFile.value.content += `\n\n${snippet}`
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      showAssistant.value = false
    }
    nextTick(() => {
      syncScroll()
    })
  }
}

const handleEditorKeydown = (e: KeyboardEvent) => {
  e.stopPropagation()

  const target = e.target as HTMLTextAreaElement
  const { selectionStart: start, selectionEnd: end, value } = target

  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    executeCode()
    return
  }

  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    terminalLogs.value.push({ type: 'info', text: `✔ Saved ${activeFile.value?.name || 'file'}` })
    scrollTerminalToBottom()
    return
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    if (activeFile.value) {
      activeFile.value.content = value.substring(0, start) + '  ' + value.substring(end)
      nextTick(() => {
        target.selectionStart = target.selectionEnd = start + 2
        syncScroll()
      })
    }
    return
  }

  const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" }
  if (pairs[e.key] && activeFile.value) {
    e.preventDefault()
    const closing = pairs[e.key]
    activeFile.value.content = value.substring(0, start) + e.key + closing + value.substring(end)
    nextTick(() => {
      target.selectionStart = target.selectionEnd = start + 1
      syncScroll()
    })
    return
  }
}

const openFile = (file: CodeFile) => {
  if (!openTabIds.value.includes(file.id)) {
    openTabIds.value.push(file.id)
  }
  activeFileId.value = file.id
  nextTick(() => {
    syncScroll()
  })
}

const closeTab = (id: string) => {
  openTabIds.value = openTabIds.value.filter(tId => tId !== id)
  if (activeFileId.value === id && openTabIds.value.length > 0) {
    activeFileId.value = openTabIds.value[openTabIds.value.length - 1]
  } else if (openTabIds.value.length === 0) {
    activeFileId.value = ''
  }
}

const openNewFileModal = () => {
  newFileNameInput.value = ''
  showNewFileModal.value = true
  nextTick(() => {
    newFileInputRef.value?.focus()
  })
}

const createNewFile = () => {
  const name = newFileNameInput.value.trim()
  if (!name) return

  const language = detectLanguage(name)
  const newFile: CodeFile = {
    id: `file-${Date.now()}`,
    name,
    language,
    content: ''
  }

  files.value.push(newFile)
  openFile(newFile)
  showNewFileModal.value = false
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    showSidebar.value = false
  }
}

const deleteFile = (id: string) => {
  closeTab(id)
  files.value = files.value.filter(f => f.id !== id)
}

let activeWorker: Worker | null = null
let workerTimeoutTimer: ReturnType<typeof setTimeout> | null = null

const executeCode = () => {
  if (!activeFile.value || !import.meta.client) return

  showTerminal.value = true
  const file = activeFile.value

  if (activeWorker) {
    activeWorker.terminate()
    activeWorker = null
  }
  if (workerTimeoutTimer) {
    clearTimeout(workerTimeoutTimer)
    workerTimeoutTimer = null
  }

  terminalLogs.value.push({ type: 'command', text: `running ${file.name}...` })

  const lang = file.language

  if (lang === 'javascript' || lang === 'typescript') {
    runJavaScriptWorker(file.content)
  } else if (lang === 'python') {
    runPythonWorker(file.content)
  } else {
    terminalLogs.value.push({
      type: 'info',
      text: `[${file.language.toUpperCase()}] Execution not supported in browser WASM. Try JS, TS, or Python!`
    })
    scrollTerminalToBottom()
  }
}

const runJavaScriptWorker = (code: string) => {
  const workerCode = `
    self.onmessage = function(e) {
      const code = e.data;
      const customConsole = {
        log: (...args) => self.postMessage({ type: 'stdout', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
        error: (...args) => self.postMessage({ type: 'stderr', text: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
        warn: (...args) => self.postMessage({ type: 'stdout', text: '[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') })
      };
      try {
        const runFn = new Function('console', code);
        runFn(customConsole);
        self.postMessage({ type: 'done' });
      } catch (err) {
        self.postMessage({ type: 'error', text: err.message || String(err) });
      }
    };
  `

  const blob = new Blob([workerCode], { type: 'application/javascript' })
  const worker = new Worker(URL.createObjectURL(blob))
  activeWorker = worker

  workerTimeoutTimer = setTimeout(() => {
    if (activeWorker) {
      activeWorker.terminate()
      activeWorker = null
      terminalLogs.value.push({
        type: 'error',
        text: '⏱ Execution Timeout: Program terminated after 5000ms (possible infinite loop).'
      })
      scrollTerminalToBottom()
    }
  }, 5000)

  worker.onmessage = (e) => {
    const { type, text } = e.data

    if (type === 'stdout') {
      terminalLogs.value.push({ type: 'output', text })
    } else if (type === 'stderr' || type === 'error') {
      terminalLogs.value.push({ type: 'error', text })
    } else if (type === 'done') {
      if (workerTimeoutTimer) clearTimeout(workerTimeoutTimer)
      terminalLogs.value.push({ type: 'info', text: 'Process finished with exit code 0' })
      activeWorker = null
    }
    scrollTerminalToBottom()
  }

  worker.postMessage(code)
}

// Ultra-fast Skulpt Python WASM Engine (< 50ms startup time)
const runPythonWorker = (code: string) => {
  const workerCode = `
    importScripts(
      'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js',
      'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js'
    );

    self.onmessage = function(e) {
      const code = e.data;

      Sk.configure({
        output: function(text) {
          self.postMessage({ type: 'stdout', text: text });
        },
        read: function(x) {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
            throw "File not found: '" + x + "'";
          }
          return Sk.builtinFiles["files"][x];
        },
        execLimit: 5000
      });

      Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, code, true);
      }).then(
        function() {
          self.postMessage({ type: 'done' });
        },
        function(err) {
          self.postMessage({ type: 'error', text: err.toString() });
        }
      );
    };
  `

  const blob = new Blob([workerCode], { type: 'application/javascript' })
  const worker = new Worker(URL.createObjectURL(blob))
  activeWorker = worker

  workerTimeoutTimer = setTimeout(() => {
    if (activeWorker) {
      activeWorker.terminate()
      activeWorker = null
      terminalLogs.value.push({
        type: 'error',
        text: '⏱ Execution Timeout: Program terminated after 5000ms (possible infinite loop).'
      })
      scrollTerminalToBottom()
    }
  }, 5000)

  worker.onerror = (err) => {
    if (workerTimeoutTimer) clearTimeout(workerTimeoutTimer)
    terminalLogs.value.push({ type: 'error', text: `Worker Error: ${err.message || 'Failed to execute Python script'}` })
    scrollTerminalToBottom()
  }

  worker.onmessage = (e) => {
    const { type, text } = e.data

    if (type === 'stdout') {
      terminalLogs.value.push({ type: 'output', text })
    } else if (type === 'stderr' || type === 'error') {
      terminalLogs.value.push({ type: 'error', text })
    } else if (type === 'done') {
      if (workerTimeoutTimer) clearTimeout(workerTimeoutTimer)
      terminalLogs.value.push({ type: 'info', text: 'Python process finished with exit code 0' })
      activeWorker = null
    }
    scrollTerminalToBottom()
  }

  worker.postMessage(code)
}

const scrollTerminalToBottom = () => {
  nextTick(() => {
    if (terminalOutputRef.value) {
      terminalOutputRef.value.scrollTop = terminalOutputRef.value.scrollHeight
    }
  })
}

const clearTerminal = () => {
  terminalLogs.value = []
}

const sendPrompt = () => {
  if (!userPrompt.value.trim()) return

  const prompt = userPrompt.value
  chatMessages.value.push({ sender: 'You', text: prompt })
  userPrompt.value = ''

  setTimeout(() => {
    if (activeFile.value) {
      const snippet = activeFile.value.language === 'python'
        ? `def solve():\n    print("Generated by Zed AI")\n\nsolve()`
        : `console.log("Generated by Zed AI");`

      chatMessages.value.push({
        sender: 'Zed AI',
        text: `Here is a suggested snippet for ${activeFile.value.name}:`,
        codeSnippet: snippet
      })
    } else {
      chatMessages.value.push({
        sender: 'Zed AI',
        text: 'Create or open a file first, and I can generate code directly for you!'
      })
    }
  }, 600)
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    showSidebar.value = false
  }
  if (files.value.length > 0) {
    openFile(files.value[0])
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 3px;
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}
</style>
