<!-- components/apps/ContactApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-900 text-slate-200 font-sans select-none overflow-hidden">

    <!-- macOS Mail Toolbar -->
    <div class="h-11 px-3 bg-slate-800/80 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 text-xs">

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="status === 'sending'"
          class="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-3 py-1 rounded-md transition-all shadow-md active:scale-95"
        >
          <Icon v-if="status === 'sending'" name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
          <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
          <span>Send</span>
        </button>

        <!-- Quick Template Selector -->
        <div class="relative hidden sm:block">
          <select
            @change="applyTemplate($event)"
            class="bg-slate-950/60 border border-white/10 text-slate-300 text-[11px] rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="" disabled selected>Quick Templates...</option>
            <option value="project">💼 Project Inquiry</option>
            <option value="job">🚀 Job Opportunity</option>
            <option value="coffee">☕ Quick Coffee / Catch-up</option>
          </select>
        </div>
      </div>

      <!-- Right Tools: Copy Email & Socials -->
      <div class="flex items-center gap-2 text-slate-400">
        <button
          @click="copyEmail"
          class="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-200 rounded-md border border-white/10 transition-colors text-[11px]"
          title="Copy email to clipboard"
        >
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5 text-blue-400" />
          <span>{{ copied ? 'Copied!' : 'Copy Email' }}</span>
        </button>

        <a
          href="mailto:you@yourdomain.dev"
          class="p-1.5 hover:bg-white/10 rounded-md text-slate-300 transition-colors hidden sm:block"
          title="Open in Default Mail Client"
        >
          <Icon name="lucide:external-link" class="w-4 h-4" />
        </a>
      </div>

    </div>

    <!-- Email Header Input Rows (Apple Mail Style) -->
    <div class="bg-slate-950/40 border-b border-white/10 text-xs font-mono">

      <!-- To Field -->
      <div class="flex items-center px-4 py-2 border-b border-white/5 gap-3">
        <span class="text-slate-500 w-16 text-right font-semibold select-none">To:</span>
        <div class="flex items-center gap-2">
          <span class="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 text-[11px] font-sans font-medium flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Your Name &lt;you@yourdomain.dev&gt;
          </span>
        </div>
      </div>

      <!-- Sender Name & Email Rows -->
      <div class="flex items-center px-4 py-2 border-b border-white/5 gap-3">
        <label for="sender-email" class="text-slate-500 w-16 text-right font-semibold select-none">From:</label>
        <div class="flex-1 flex flex-col sm:flex-row gap-2">
          <input
            id="sender-email"
            v-model="form.email"
            type="email"
            required
            placeholder="your.email@example.com"
            class="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-sans"
          />
          <input
            v-model="form.name"
            type="text"
            placeholder="Your Name (Optional)"
            class="w-full sm:w-48 bg-transparent text-slate-300 placeholder-slate-600 focus:outline-none font-sans text-[11px]"
          />
        </div>
      </div>

      <!-- Subject Row -->
      <div class="flex items-center px-4 py-2 gap-3">
        <label for="subject" class="text-slate-500 w-16 text-right font-semibold select-none">Subject:</label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          required
          placeholder="New message subject..."
          class="flex-1 bg-transparent text-slate-100 font-medium placeholder-slate-600 focus:outline-none font-sans"
        />
      </div>

    </div>

    <!-- Message Body Area -->
    <div class="flex-1 p-4 bg-slate-900 flex flex-col overflow-hidden relative">

      <!-- Sent Banner Overlay -->
      <div
        v-if="status === 'success'"
        class="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center space-y-3 text-center p-6"
      >
        <div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
          <Icon name="lucide:check-circle" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-white">Message Delivered</h3>
        <p class="text-xs text-slate-400 max-w-sm">
          Thanks for reaching out! Your message was sent successfully.
        </p>
        <button
          @click="resetForm"
          class="mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
        >
          Compose Another Message
        </button>
      </div>

      <!-- Textarea Editor -->
      <textarea
        v-model="form.message"
        required
        placeholder="Type your message here..."
        class="w-full flex-1 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-sans text-xs sm:text-sm leading-relaxed"
      ></textarea>

    </div>

    <!-- Footer Status Bar -->
    <div class="h-7 px-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-mono">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>Outbox: Ready</span>
      </div>

      <!-- Quick Social Links -->
      <div class="flex items-center gap-3">
        <a href="https://github.com" target="_blank" class="hover:text-blue-300 transition-colors flex items-center gap-1">
          <Icon name="lucide:github" class="w-3.5 h-3.5" />
        </a>
        <a href="https://linkedin.com" target="_blank" class="hover:text-blue-300 transition-colors flex items-center gap-1">
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
    message: 'Hi,\n\nI came across your portfolio and I am interested in collaborating on a web application project.\n\nHere are some details:\n- Timeline:\n- Tech Stack Preferences:\n\nLet\'s schedule a call to discuss!'
  },
  job: {
    subject: 'Opportunity — Engineering Role',
    message: 'Hi,\n\nWe are currently looking for a developer with your skillset for a role at our company.\n\nWould you be open to discussing potential opportunities?'
  },
  coffee: {
    subject: 'Quick Coffee / Virtual Catch-up',
    message: 'Hey!\n\nLoved checking out your macOS portfolio desktop. Would love to connect and chat about tech!'
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
    navigator.clipboard.writeText('you@yourdomain.dev')
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
    // Connect your backend API endpoint here (e.g., Nuxt server route `/api/contact` or Resend/Formspree)
    await new Promise(resolve => setTimeout(resolve, 1200)) // Simulated delay

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
