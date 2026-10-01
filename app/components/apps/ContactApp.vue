<!-- components/apps/ContactApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans select-none overflow-hidden transition-colors duration-200">

    <!-- macOS Mail Toolbar -->
    <div class="h-11 px-3 bg-gray-100/90 dark:bg-slate-800/80 border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-2 shrink-0 text-xs transition-colors duration-200">

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="status === 'sending'"
          class="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium px-3 py-1 rounded-md transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Icon v-if="status === 'sending'" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
          <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
          <span>Send</span>
        </button>

        <!-- Quick Template Selector -->
        <div class="relative hidden sm:block">
          <select
            @change="applyTemplate($event)"
            class="bg-white dark:bg-slate-950/60 border border-gray-300 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[11px] rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 cursor-pointer shadow-sm dark:shadow-none"
          >
            <option value="" disabled selected>Quick Templates...</option>
            <option value="project">💼 Project Inquiry</option>
            <option value="job">🚀 Job Opportunity</option>
            <option value="coffee">☕ Quick Coffee / Catch-up</option>
          </select>
        </div>
      </div>

      <!-- Right Tools: Copy Email & External Mail Client -->
      <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <button
          @click="copyEmail"
          class="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-md border border-gray-300 dark:border-white/10 transition-colors text-[11px] shadow-sm dark:shadow-none cursor-pointer"
          title="Copy contact@joelpinho.fr"
        >
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <span>{{ copied ? 'Copied!' : 'Copy Email' }}</span>
        </button>

        <a
          href="mailto:contact@joelpinho.fr"
          class="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-slate-600 dark:text-slate-300 transition-colors hidden sm:block"
          title="Open in Default Mail Client"
        >
          <Icon name="lucide:external-link" class="w-4 h-4" />
        </a>
      </div>

    </div>

    <!-- Email Header Input Rows (Apple Mail Style) -->
    <div class="bg-gray-50/80 dark:bg-slate-950/40 border-b border-gray-200 dark:border-white/10 text-xs font-mono transition-colors duration-200">

      <!-- To Field -->
      <div class="flex items-center px-4 py-2 border-b border-gray-200/60 dark:border-white/5 gap-3">
        <span class="text-slate-400 dark:text-slate-500 w-16 text-right font-semibold select-none">To:</span>
        <div class="flex items-center gap-2">
          <span class="bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded border border-sky-500/30 text-[11px] font-sans font-medium flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>
            Joel PINHO &lt;contact@joelpinho.fr&gt;
          </span>
        </div>
      </div>

      <!-- Sender Email & Name -->
      <div class="flex items-center px-4 py-2 border-b border-gray-200/60 dark:border-white/5 gap-3">
        <label for="sender-email" class="text-slate-400 dark:text-slate-500 w-16 text-right font-semibold select-none">From:</label>
        <div class="flex-1 flex flex-col sm:flex-row gap-2">
          <input
            id="sender-email"
            v-model="form.email"
            type="email"
            required
            placeholder="your.email@example.com"
            class="flex-1 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none font-sans"
          />
          <input
            v-model="form.name"
            type="text"
            placeholder="Your Name (Optional)"
            class="w-full sm:w-48 bg-transparent text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none font-sans text-[11px]"
          />
        </div>
      </div>

      <!-- Subject Row -->
      <div class="flex items-center px-4 py-2 gap-3">
        <label for="subject" class="text-slate-400 dark:text-slate-500 w-16 text-right font-semibold select-none">Subject:</label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          required
          placeholder="New message subject..."
          class="flex-1 bg-transparent text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none font-sans"
        />
      </div>

    </div>

    <!-- Message Body Area -->
    <div class="flex-1 p-4 bg-white dark:bg-slate-900 flex flex-col overflow-hidden relative transition-colors duration-200">

      <!-- Success Delivery Banner -->
      <div
        v-if="status === 'success'"
        class="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center space-y-3 text-center p-6 transition-all"
      >
        <div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-lg">
          <Icon name="lucide:check-circle" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">Message Delivered</h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
          Thanks for reaching out! Your message was sent successfully to <span class="font-mono text-sky-600 dark:text-sky-400">contact@joelpinho.fr</span>.
        </p>
        <button
          @click="resetForm"
          class="mt-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-white/10 px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
        >
          Compose Another Message
        </button>
      </div>

      <!-- Textarea Editor -->
      <textarea
        v-model="form.message"
        required
        placeholder="Type your message here..."
        class="w-full flex-1 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none font-sans text-xs sm:text-sm leading-relaxed"
      ></textarea>

    </div>

    <!-- Footer Status Bar -->
    <div class="h-7 px-3 bg-gray-100 dark:bg-slate-950 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono transition-colors duration-200">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Outbox: Ready</span>
      </div>

      <!-- Social External Links -->
      <div class="flex items-center gap-3">
        <a href="https://github.com/raizestudio" target="_blank" class="hover:text-sky-500 dark:hover:text-sky-300 transition-colors flex items-center gap-1">
          <Icon name="lucide:github" class="w-3.5 h-3.5" />
        </a>
        <a href="https://linkedin.com" target="_blank" class="hover:text-sky-500 dark:hover:text-sky-300 transition-colors flex items-center gap-1">
          <Icon name="lucide:linkedin" class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const copied = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const templates = {
  project: {
    subject: 'Project Inquiry — Web Application Development',
    message: 'Hi Joel,\n\nI came across your portfolio and I am interested in collaborating on a web application project.\n\nHere are some details:\n- Timeline:\n- Tech Stack Preferences:\n\nLet\'s schedule a call to discuss!'
  },
  job: {
    subject: 'Opportunity — Engineering Role',
    message: 'Hi Joel,\n\nWe are currently looking for a full-stack developer with your skillset for a role at our company.\n\nWould you be open to discussing potential opportunities?'
  },
  coffee: {
    subject: 'Quick Coffee / Virtual Catch-up',
    message: 'Hey Joel!\n\nLoved checking out your macOS portfolio desktop. Would love to connect and chat about tech!'
  }
}

const applyTemplate = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selectedKey = target.value as keyof typeof templates

  if (templates[selectedKey]) {
    form.subject = templates[selectedKey].subject
    form.message = templates[selectedKey].message
  }
}

const copyEmail = () => {
  if (import.meta.client) {
    navigator.clipboard.writeText('contact@joelpinho.fr')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

const sendMessage = async () => {
  if (!form.email || !form.message) return

  status.value = 'sending'

  try {
    // Insère ton endpoint API ici si besoin (ex: Resend, Formspree ou Nuxt server route `/api/contact`)
    await new Promise(resolve => setTimeout(resolve, 1000))

    status.value = 'success'
  } catch (err) {
    status.value = 'error'
  }
}

const resetForm = () => {
  status.value = 'idle'
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>
