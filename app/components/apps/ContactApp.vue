<!-- components/apps/ContactApp.vue -->
<template>
  <div class="h-full flex flex-col font-sans text-slate-200">
    <!-- Header / Mail Toolbar -->
    <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
      <div class="flex items-center space-x-2 bg-slate-950/60 px-3 py-1.5 rounded-md border border-white/5 font-mono text-slate-400">
        <Icon name="lucide:mail" class="w-4 h-4 text-purple-400" />
        <span class="text-slate-200 font-semibold">New_Message.eml</span>
      </div>

      <div class="flex items-center space-x-2 text-slate-400 text-[11px] font-mono">
        <span class="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
        <span>SMTP Ready</span>
      </div>
    </div>

    <!-- Main Message Form -->
    <div class="flex-1 overflow-y-auto pr-1">
      <form @submit.prevent="sendMessage" class="space-y-3">
        <!-- Recipient Header Readonly -->
        <div class="flex items-center space-x-3 bg-slate-950/40 p-2.5 rounded-lg border border-white/5 text-xs">
          <span class="font-mono text-slate-500 w-12 text-right">To:</span>
          <span class="font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            you@yourdomain.dev
          </span>
        </div>

        <!-- Sender Name & Email -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-[10px] uppercase font-mono text-slate-400 tracking-wider">Your Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Alex Smith"
              class="w-full bg-slate-950/60 border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-[10px] uppercase font-mono text-slate-400 tracking-wider">Your Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="alex@example.com"
              class="w-full bg-slate-950/60 border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono"
            />
          </div>
        </div>

        <!-- Subject Line -->
        <div class="space-y-1">
          <label class="block text-[10px] uppercase font-mono text-slate-400 tracking-wider">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            required
            placeholder="Project Inquiry / Job Opportunity"
            class="w-full bg-slate-950/60 border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono"
          />
        </div>

        <!-- Message Body -->
        <div class="space-y-1">
          <label class="block text-[10px] uppercase font-mono text-slate-400 tracking-wider">Message</label>
          <textarea
            v-model="form.message"
            required
            rows="5"
            placeholder="Hey, I loved your desktop portfolio! Let's talk about..."
            class="w-full bg-slate-950/60 border border-white/10 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 rounded p-3 text-xs text-white placeholder-slate-600 outline-none transition-colors font-mono resize-none"
          ></textarea>
        </div>

        <!-- Submit & Status Banner -->
        <div class="pt-2 flex items-center justify-between">
          <div class="text-xs">
            <span v-if="status === 'sending'" class="text-purple-400 font-mono flex items-center gap-1.5">
              <Icon name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" /> Transmitting...
            </span>
            <span v-else-if="status === 'success'" class="text-emerald-400 font-mono flex items-center gap-1.5">
              <Icon name="lucide:check-circle-2" class="w-3.5 h-3.5" /> Message Sent!
            </span>
            <span v-else-if="status === 'error'" class="text-red-400 font-mono flex items-center gap-1.5">
              <Icon name="lucide:alert-triangle" class="w-3.5 h-3.5" /> Failed to send message.
            </span>
          </div>

          <button
            type="submit"
            :disabled="status === 'sending'"
            class="flex items-center space-x-2 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-slate-950 font-medium text-xs py-2 px-4 rounded transition-colors"
          >
            <span>Send Message</span>
            <Icon name="lucide:send" class="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>

    <!-- Social Links Bar -->
    <div class="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
      <span>Connect directly:</span>
      <div class="flex items-center space-x-3">
        <a href="https://github.com" target="_blank" class="hover:text-purple-300 transition-colors flex items-center gap-1">
          <Icon name="lucide:github" class="w-3.5 h-3.5" /> GitHub
        </a>
        <a href="https://linkedin.com" target="_blank" class="hover:text-purple-300 transition-colors flex items-center gap-1">
          <Icon name="lucide:linkedin" class="w-3.5 h-3.5" /> LinkedIn
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sendMessage = async () => {
  status.value = 'sending'

  try {
    // Connect your mail backend API endpoint here (e.g. /api/contact or Formspree/Resend)
    await new Promise(resolve => setTimeout(resolve, 1200)) // Simulated delay

    status.value = 'success'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''

    setTimeout(() => {
      status.value = 'idle'
    }, 4000)
  } catch (err) {
    status.value = 'error'
  }
}
</script>
