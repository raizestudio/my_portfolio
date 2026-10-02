<!-- components/apps/ContactApp.vue -->
<template>
  <div
    class="h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans select-none overflow-hidden transition-colors duration-200"
  >
    <!-- macOS Mail Toolbar -->
    <div
      class="h-11 px-3 bg-gray-100/90 dark:bg-slate-800/80 border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-2 shrink-0 text-xs transition-colors duration-200"
    >
      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="status === 'sending'"
          class="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium px-3 py-1 rounded-md transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Icon
            v-if="status === 'sending'"
            name="lucide:loader-2"
            class="w-3.5 h-3.5 animate-spin"
          />
          <Icon v-else name="lucide:send" class="w-3.5 h-3.5" />
          <span>{{ t('apps.contact.send') }}</span>
        </button>

        <!-- Quick Template Selector -->
        <div class="relative hidden sm:block">
          <select
            @change="applyTemplate($event)"
            class="bg-white dark:bg-slate-950/60 border border-gray-300 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[11px] rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 cursor-pointer shadow-sm dark:shadow-none"
          >
            <option value="" disabled selected>
              {{ t('apps.contact.quickTemplates') }}
            </option>
            <option
              v-for="option in quickTemplatesOptions"
              :key="option.key"
              :value="option.key"
            >
              {{ option.label }}
            </option>
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
          <Icon
            :name="copied ? 'lucide:check' : 'lucide:copy'"
            class="w-3.5 h-3.5 text-sky-500 dark:text-sky-400"
          />
          <span>{{ copied ? t('apps.contact.copiedEmail') : t('apps.contact.copyEmail') }}</span>
        </button>

        <a
          href="mailto:contact@joelpinho.fr"
          class="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-slate-600 dark:text-slate-300 transition-colors hidden sm:block"
          :title="t('apps.contact.openInDefaultEmailClient')"
        >
          <Icon name="lucide:external-link" class="w-4 h-4" />
        </a>
      </div>
    </div>

    <!-- Global / Server Error Notification Banner -->
    <div
      v-if="serverError"
      class="px-4 py-2 bg-rose-500/10 border-b border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between transition-colors shrink-0 font-sans"
    >
      <div class="flex items-center gap-2 min-w-0">
        <Icon name="lucide:alert-circle" class="w-4 h-4 shrink-0 text-rose-500" />
        <span class="truncate font-medium">{{ serverError }}</span>
      </div>
      <button
        @click="serverError = ''"
        class="p-1 hover:bg-rose-500/20 rounded text-rose-500 font-bold text-xs cursor-pointer"
      >
        ✕
      </button>
    </div>

    <!-- Email Header Input Rows (Apple Mail Style) -->
    <div
      class="bg-gray-50/80 dark:bg-slate-950/40 border-b border-gray-200 dark:border-white/10 text-xs font-mono transition-colors duration-200"
    >
      <!-- To Field -->
      <div
        class="flex items-center px-4 py-2 border-b border-gray-200/60 dark:border-white/5 gap-3"
      >
        <span
          class="text-slate-400 dark:text-slate-500 w-16 text-right font-semibold select-none"
        >
          {{ t('apps.contact.to') }}:
        </span>
        <div class="flex items-center gap-2">
          <span
            class="bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded border border-sky-500/30 text-[11px] font-sans font-medium flex items-center gap-1.5"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"
            ></span>
            Joel PINHO &lt;contact@joelpinho.fr&gt;
          </span>
        </div>
      </div>

      <!-- Sender Email & Name -->
      <div
        class="flex items-center px-4 py-2 border-b border-gray-200/60 dark:border-white/5 gap-3 transition-colors"
        :class="{ 'bg-rose-500/5': fieldErrors.email }"
      >
        <label
          for="sender-email"
          class="text-slate-400 dark:text-slate-500 w-16 text-right font-semibold select-none"
        >
          {{ t('apps.contact.from') }}:
        </label>
        <div class="flex-1 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div class="flex-1 w-full relative">
            <input
              id="sender-email"
              v-model="form.email"
              @input="clearFieldError('email')"
              type="email"
              required
              :placeholder="t('apps.contact.fromPlaceholder')"
              class="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none font-sans"
              :class="{ 'text-rose-500 dark:text-rose-400 font-medium': fieldErrors.email }"
            />
            <span v-if="fieldErrors.email" class="text-[10px] text-rose-500 font-sans block mt-0.5 font-medium">
              {{ fieldErrors.email }}
            </span>
          </div>

          <input
            v-model="form.name"
            type="text"
            :placeholder="t('apps.contact.yourNamePlaceholder')"
            class="w-full sm:w-48 bg-transparent text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none font-sans text-[11px]"
          />
        </div>
      </div>

      <!-- Subject Row -->
      <div
        class="flex items-center px-4 py-2 gap-3 transition-colors"
        :class="{ 'bg-rose-500/5': fieldErrors.subject }"
      >
        <label
          for="subject"
          class="text-slate-400 dark:text-slate-500 w-16 text-right font-semibold select-none"
        >
          {{ t('apps.contact.subject') }}:
        </label>
        <div class="flex-1 relative">
          <input
            id="subject"
            v-model="form.subject"
            @input="clearFieldError('subject')"
            type="text"
            required
            :placeholder="t('apps.contact.subjectPlaceholder')"
            class="w-full bg-transparent text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none font-sans"
            :class="{ 'text-rose-500 dark:text-rose-400 font-medium': fieldErrors.subject }"
          />
          <span v-if="fieldErrors.subject" class="text-[10px] text-rose-500 font-sans block mt-0.5 font-medium">
            {{ fieldErrors.subject }}
          </span>
        </div>
      </div>
    </div>

    <!-- Message Body Area -->
    <div
      class="flex-1 p-4 bg-white dark:bg-slate-900 flex flex-col overflow-hidden relative transition-colors duration-200"
      :class="{ 'bg-rose-500/5 dark:bg-rose-950/10': fieldErrors.message }"
    >
      <!-- Success Delivery Banner -->
      <div
        v-if="status === 'success'"
        class="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center space-y-3 text-center p-6 transition-all"
      >
        <div
          class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-lg"
        >
          <Icon name="lucide:check-circle" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">
          {{ t('apps.contact.messageDelivered') }}
        </h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
          {{ t('apps.contact.messageThanks') }}
          {{ t('apps.contact.messageTo') }}
          <span class="font-mono text-sky-600 dark:text-sky-400"
            >contact@joelpinho.fr</span
          >.
        </p>
        <button
          @click="resetForm"
          class="mt-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-gray-300 dark:border-white/10 px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
        >
          {{ t('apps.contact.newMessage') }}
        </button>
      </div>

      <!-- Textarea Editor -->
      <textarea
        v-model="form.message"
        @input="clearFieldError('message')"
        required
        :placeholder="t('apps.contact.newMessagePlaceholder')"
        class="w-full flex-1 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none font-sans text-xs sm:text-sm leading-relaxed"
      ></textarea>
      <span v-if="fieldErrors.message" class="text-[10px] text-rose-500 font-sans block pt-1 font-medium">
        {{ fieldErrors.message }}
      </span>
    </div>

    <!-- Footer Status Bar -->
    <div
      class="h-7 px-3 bg-gray-100 dark:bg-slate-950 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono transition-colors duration-200"
    >
      <div class="flex items-center gap-2">
        <span
          class="w-2 h-2 rounded-full transition-colors"
          :class="[
            status === 'sending' ? 'bg-amber-500 animate-pulse' : '',
            status === 'error' ? 'bg-rose-500' : '',
            status === 'idle' || status === 'success' ? 'bg-emerald-500' : ''
          ]"
        ></span>
        <span>
          {{
            status === 'sending'
              ? 'Outbox: Sending...'
              : status === 'error'
                ? 'Outbox: Error'
                : t('apps.contact.outboxStatus')
          }}
        </span>
      </div>

      <!-- Social External Links -->
      <div class="flex items-center gap-3">
        <a
          href="https://github.com/raizestudio"
          target="_blank"
          class="hover:text-sky-500 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
        >
          <Icon name="lucide:github" class="w-3.5 h-3.5" />
        </a>
        <a
          href="https://linkedin.com/in/pinhojoel"
          target="_blank"
          class="hover:text-sky-500 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
        >
          <Icon name="lucide:linkedin" class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const { t } = useI18n();

const sendText = t("apps.contact.send");
const copyEmailText = t("apps.contact.copyEmail");
const copiedEmailText = t("apps.contact.copiedEmail");
const openInDefaultEmailClientText = t("apps.contact.openInDefaultEmailClient");
const toText = t("apps.contact.to");
const fromText = t("apps.contact.from");
const fromPlaceholderText = t("apps.contact.fromPlaceholder");
const yourNamePlaceholderText = t("apps.contact.yourNamePlaceholder");
const subjectText = t("apps.contact.subject");
const subjectPlaceholderText = t("apps.contact.subjectPlaceholder");
const newMessagePlaceholderText = t("apps.contact.newMessagePlaceholder");
const quickTemplatesText = t("apps.contact.quickTemplates");
const templatesOptionsProjectText = t('apps.contact.templatesOptions.project')
const templatesOptionsJobText = t('apps.contact.templatesOptions.job')
const templatesOptionsCoffeeText = t('apps.contact.templatesOptions.coffee')
const templatesProjectSubjectText = t('apps.contact.templates.project.subject')
const templatesProjectBodyText = t('apps.contact.templates.project.body')
const templatesJobSubjectText = t('apps.contact.templates.job.subject')
const templatesJobBodyText = t('apps.contact.templates.job.body')
const templatesCoffeeSubjectText = t('apps.contact.templates.coffee.subject')
const templatesCoffeeBodyText = t('apps.contact.templates.coffee.body')
const messageDeliveredText = t('apps.contact.messageDelivered')
const messageThanksText = t('apps.contact.messageThanks')
const messageToText = t('apps.contact.messageTo')
const newMessageText = t('apps.contact.newMessage')
const outboxStatusText = t('apps.contact.outboxStatus')
const fieldErrorsRequiredEmail = t('apps.contact.fieldErrors.requiredEmail')
const fieldErrorsInvalidEmail = t('apps.contact.fieldErrors.invalidEmail')
const fieldErrorsRequiredSubject = t('apps.contact.fieldErrors.requiredSubject')
const fieldErrorsRequiredMessage = t('apps.contact.fieldErrors.requiredMessage')
const errorSendingText = t('apps.contact.errorSending')


const status = ref<"idle" | "sending" | "success" | "error">("idle");
const serverError = ref("");
const copied = ref(false);

const quickTemplatesOptions = computed(() => {
    return [
        { key: "project", label: templatesOptionsProjectText },
        { key: "job", label: templatesOptionsJobText },
        { key: "coffee", label: templatesOptionsCoffeeText },
    ];
});

const form = reactive({
    name: "",
    email: "",
    subject: "",
    message: "",
});

const fieldErrors = reactive({
  email: "",
  subject: "",
  message: "",
});

const clearFieldError = (field: keyof typeof fieldErrors) => {
  fieldErrors[field] = "";
  if (serverError.value) serverError.value = "";
};

const validateForm = (): boolean => {
  let isValid = true;

  fieldErrors.email = "";
  fieldErrors.subject = "";
  fieldErrors.message = "";

  // Email validation
  const trimmedEmail = form.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    fieldErrors.email = fieldErrorsRequiredEmail;
    isValid = false;
  } else if (!emailRegex.test(trimmedEmail)) {
    fieldErrors.email = fieldErrorsInvalidEmail;
    isValid = false;
  }

  // Subject validation
  if (!form.subject.trim()) {
    fieldErrors.subject = fieldErrorsRequiredSubject;
    isValid = false;
  }

  // Message body validation
  if (!form.message.trim()) {
    fieldErrors.message = fieldErrorsRequiredMessage;
    isValid = false;
  }

  return isValid;
};

const templates = {
    project: {
        subject: templatesProjectSubjectText,
        message: templatesProjectBodyText,
    },
    job: {
        subject: templatesJobSubjectText,
        message: templatesJobBodyText,
    },
    coffee: {
        subject: templatesCoffeeSubjectText,
        message: templatesCoffeeBodyText,
    },
};

const applyTemplate = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const selectedKey = target.value as keyof typeof templates;

    if (templates[selectedKey]) {
        form.subject = templates[selectedKey].subject;
        form.message = templates[selectedKey].message;
    }
};

const copyEmail = () => {
    if (import.meta.client) {
        navigator.clipboard.writeText("contact@joelpinho.fr");
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    }
};

const sendMessage = async () => {
  serverError.value = "";

  // 1. Client-Side Field Validation
  if (!validateForm()) {
    return;
  }

  status.value = "sending";

  try {
    // 2. Nuxt 4 Server Endpoint Call
    const response = await $fetch<{ success: boolean; simulated?: boolean }>("/api/contact", {
      method: "POST",
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      },
    });

    if (response?.success) {
      status.value = "success";
    } else {
      throw new Error("Réponse inattendue du serveur.");
    }
  } catch (err: any) {
    status.value = "error";

    // 3. Nitro Server Error extraction (from createError statusMessage)
    const backendMessage = errorSendingText
      // err?.data?.statusMessage ||
      // err?.response?._data?.statusMessage ||
      // err?.statusMessage ||
      // err?.message ||
      // "Une erreur est survenue lors de l'envoi du message.";

    serverError.value = backendMessage;
  }
};

const resetForm = () => {
  status.value = "idle";
  serverError.value = "";
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
  fieldErrors.email = "";
  fieldErrors.subject = "";
  fieldErrors.message = "";
};
</script>
