<!-- components/apps/AboutApp.vue -->
<template>
    <div
        class="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans select-none overflow-hidden transition-colors duration-200"
    >
        <!-- macOS Preview PDF Toolbar -->
        <div
            class="h-11 px-3 bg-gray-100/90 dark:bg-slate-900/90 border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-2 shrink-0 text-xs text-gray-600 dark:text-slate-300 transition-colors duration-200"
        >
            <!-- Left: Sidebar Toggle & Page Indicator -->
            <div class="flex items-center gap-3">
                <button
                    @click="showSidebar = !showSidebar"
                    class="p-1.5 rounded transition-colors cursor-pointer"
                    :class="
                        showSidebar
                            ? 'bg-gray-300/60 dark:bg-white/15 text-gray-900 dark:text-white'
                            : 'hover:bg-gray-200 dark:hover:bg-white/10'
                    "
                    title="Toggle Thumbnails Sidebar"
                >
                    <Icon name="lucide:panel-left" class="w-4 h-4" />
                </button>

                <div
                    class="flex items-center gap-1 bg-white dark:bg-slate-950/60 px-2 py-1 rounded border border-gray-300 dark:border-white/10 font-mono text-[11px] shadow-sm dark:shadow-none"
                >
                    <span>{{ pageCounterText }}</span>
                </div>
            </div>

            <!-- Center: Document Title -->
            <div
                class="hidden sm:flex items-center gap-1.5 font-medium text-gray-800 dark:text-slate-200"
            >
                <Icon
                    name="lucide:file-text"
                    class="w-4 h-4 text-rose-500 dark:text-rose-400"
                />
                <span>{{ titleText }}</span>
            </div>

            <!-- Right: Zoom Controls & PDF Download -->
            <div class="flex items-center gap-2">
                <div
                    class="flex items-center bg-white dark:bg-slate-950/60 rounded border border-gray-300 dark:border-white/10 p-0.5 shadow-sm dark:shadow-none"
                >
                    <button
                        @click="zoomOut"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
                        :title="zoomOutText"
                    >
                        <Icon name="lucide:minus" class="w-3.5 h-3.5" />
                    </button>
                    <span
                        class="px-2 font-mono text-[11px] w-12 text-center text-gray-700 dark:text-slate-300"
                    >
                        {{ Math.round(zoomLevel * 100) }}%
                    </span>
                    <button
                        @click="zoomIn"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
                        :title="zoomInText"
                    >
                        <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                    </button>
                </div>

                <button
                    @click="downloadPDF"
                    class="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white font-medium px-2.5 py-1 rounded transition-colors shadow-sm cursor-pointer"
                >
                    <div v-if="isExporting" class="flex items-center gap-1.5">
                        <Icon name="lucide:loader-circle" class="animate-spin w-3.5 h-3.5" />
                        <span class="hidden sm:inline">{{ exportingText }}</span>
                    </div>
                    <div v-else class="flex items-center gap-1.5">
                        <Icon name="lucide:download" class="w-3.5 h-3.5" />
                        <span class="hidden sm:inline">{{ exportText }}</span>
                    </div>
                </button>
            </div>
        </div>

        <!-- PDF Viewing Area -->
        <div
            class="flex-1 flex overflow-hidden bg-gray-200/80 dark:bg-slate-900/80 transition-colors duration-200"
        >
            <!-- Thumbnail Sidebar -->
            <div
                v-if="showSidebar"
                class="w-40 bg-gray-50/90 dark:bg-slate-950/80 border-r border-gray-200 dark:border-white/10 p-3 space-y-3 overflow-y-auto shrink-0 hidden sm:block transition-colors duration-200"
            >
                <div
                    class="text-[10px] font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider px-1"
                >
                    {{ pagesText }}
                </div>

                <!-- Thumbnail Page 1 -->
                <button
                    @click="scrollToPage(1)"
                    class="w-full group flex flex-col items-center gap-1 text-left focus:outline-none cursor-pointer"
                >
                    <div
                        class="w-full aspect-[1/1.3] bg-white dark:bg-slate-900 rounded border transition-all p-1.5 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-md"
                        :class="
                            currentPage === 1
                                ? 'border-rose-500 ring-1 ring-rose-500/50'
                                : 'border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30'
                        "
                    >
                        <!-- Mini Page 1 Mockup -->
                        <div class="space-y-1.5">
                            <div class="flex gap-1 items-center border-b border-gray-100 dark:border-white/5 pb-1">
                                <div class="w-3.5 h-3.5 rounded-full bg-rose-500/20 border border-rose-500/40 shrink-0 flex items-center justify-center text-[5px] text-rose-500 font-bold">JP</div>
                                <div class="space-y-0.5 flex-1 min-w-0">
                                    <div class="h-1 w-full bg-gray-800 dark:bg-slate-200 rounded" />
                                    <div class="h-0.5 w-2/3 bg-rose-500 rounded" />
                                </div>
                            </div>
                            <div class="bg-gray-100 dark:bg-slate-950/60 p-1 rounded space-y-0.5">
                                <div class="h-0.5 w-1/3 bg-gray-400 dark:bg-slate-500 rounded" />
                                <div class="h-0.5 w-full bg-gray-300 dark:bg-slate-700 rounded" />
                                <div class="h-0.5 w-4/5 bg-gray-300 dark:bg-slate-700 rounded" />
                            </div>
                            <div class="grid grid-cols-2 gap-1">
                                <div class="bg-gray-50 dark:bg-slate-950/40 p-0.5 rounded border border-gray-100 dark:border-white/5 space-y-0.5">
                                    <div class="h-0.5 w-2/3 bg-sky-500 rounded" />
                                    <div class="h-0.5 w-full bg-sky-400/60 rounded" />
                                    <div class="h-0.5 w-4/5 bg-sky-400/60 rounded" />
                                    <div class="h-0.5 w-full bg-sky-400/60 rounded" />
                                </div>
                                <div class="bg-gray-50 dark:bg-slate-950/40 p-0.5 rounded border border-gray-100 dark:border-white/5 space-y-0.5">
                                    <div class="h-0.5 w-2/3 bg-rose-500 rounded" />
                                    <div class="h-0.5 w-full bg-rose-400/60 rounded" />
                                    <div class="h-0.5 w-4/5 bg-rose-400/60 rounded" />
                                    <div class="h-0.5 w-full bg-rose-400/60 rounded" />
                                </div>
                            </div>
                            <div class="flex gap-0.5 flex-wrap">
                                <div class="h-1 w-2.5 bg-gray-200 dark:bg-white/10 rounded-xs" />
                                <div class="h-1 w-2 bg-gray-200 dark:bg-white/10 rounded-xs" />
                                <div class="h-1 w-3 bg-gray-200 dark:bg-white/10 rounded-xs" />
                                <div class="h-1 w-2.5 bg-gray-200 dark:bg-white/10 rounded-xs" />
                            </div>
                        </div>
                        <div class="h-0.5 w-full bg-gray-200 dark:bg-white/10 rounded" />
                    </div>
                    <span class="text-[11px] font-mono text-gray-500 dark:text-slate-400">1</span>
                </button>

                <!-- Thumbnail Page 2 -->
                <button
                    @click="scrollToPage(2)"
                    class="w-full group flex flex-col items-center gap-1 text-left focus:outline-none cursor-pointer"
                >
                    <div
                        class="w-full aspect-[1/1.3] bg-white dark:bg-slate-900 rounded border transition-all p-1.5 flex flex-col justify-between overflow-hidden shadow-sm dark:shadow-md"
                        :class="
                            currentPage === 2
                                ? 'border-rose-500 ring-1 ring-rose-500/50'
                                : 'border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30'
                        "
                    >
                        <div class="space-y-1.5">
                            <div class="h-0.5 w-1/2 bg-gray-400 dark:bg-slate-500 rounded" />
                            <div class="pl-1 border-l border-gray-200 dark:border-white/10 space-y-1 relative">
                                <div v-for="i in 5" :key="i" class="relative pl-1.5 space-y-0.5">
                                    <div class="absolute -left-1.25 top-0.5 w-1 h-1 rounded-full bg-rose-500" />
                                    <div class="h-0.5 w-full bg-gray-700 dark:bg-slate-300 rounded" />
                                    <div class="h-0.5 w-2/3 bg-gray-300 dark:bg-slate-600 rounded" />
                                </div>
                            </div>
                            <div class="h-0.5 w-1/2 bg-gray-400 dark:bg-slate-500 rounded pt-1" />
                            <div class="bg-gray-50 dark:bg-slate-950/40 p-1 rounded space-y-0.5 border border-gray-100 dark:border-white/5">
                                <div class="h-0.5 w-full bg-gray-300 dark:bg-slate-700 rounded" />
                                <div class="h-0.5 w-full bg-gray-300 dark:bg-slate-700 rounded" />
                                <div class="h-0.5 w-full bg-gray-300 dark:bg-slate-700 rounded" />
                            </div>
                        </div>
                        <div class="h-0.5 w-full bg-gray-200 dark:bg-white/10 rounded" />
                    </div>
                    <span class="text-[11px] font-mono text-gray-500 dark:text-slate-400">2</span>
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
                        class="w-[520px] sm:w-[600px] min-h-[750px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-sm shadow-xl p-8 text-gray-800 dark:text-slate-200 flex flex-col justify-between relative overflow-hidden transition-colors duration-200"
                    >
                        <!-- Watermark / Decorative Accent -->
                        <div
                            class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none"
                        />

                        <div class="space-y-6">
                            <!-- Header with Photo -->
                            <div class="flex items-center gap-6 border-b border-gray-200 dark:border-white/10 pb-6">
                                <!-- Photo Container -->
                                <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md overflow-hidden shrink-0">
                                    <img
                                        src="/assets/images/profile.webp"
                                        alt="Joel PINHO"
                                        class="w-full h-full object-cover"
                                        lazy
                                    />
                                </div>

                                <!-- Title & Role -->
                                <div class="flex-1">
                                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        Joel PINHO
                                    </h1>
                                    <p class="text-rose-600 dark:text-rose-400 font-mono text-sm mt-1">
                                        {{ roleText }}
                                    </p>
                                </div>

                                <!-- Contact Details -->
                                <div class="text-right text-[11px] text-gray-500 dark:text-slate-400 font-mono space-y-1">
                                    <div class="flex items-center justify-end gap-1.5">
                                        <Icon name="lucide:map-pin" class="w-3 h-3" /> Remote / Global
                                    </div>
                                    <div class="flex items-center justify-end gap-1.5">
                                        <Icon name="lucide:briefcase" class="w-3 h-3" /> Open to Work
                                    </div>
                                    <div class="flex items-center justify-end gap-1.5">
                                        <Icon name="lucide:mail" class="w-3 h-3" /> contact@joelpinho.fr
                                    </div>
                                </div>
                            </div>

                            <!-- Executive Summary -->
                            <div>
                                <h3 class="text-xs font-mono font-semibold uppercase text-gray-500 dark:text-slate-400 mb-2 tracking-wider">
                                    {{ summaryText }}
                               </h3>
                                <p class="text-xs text-gray-700 dark:text-slate-300 leading-relaxed bg-gray-50 dark:bg-slate-950/50 p-4 rounded-lg border border-gray-100 dark:border-white/5 shadow-inner dark:shadow-none">
                                    {{ summaryDescriptionText }}
                                </p>
                            </div>

                            <!-- Tools & Technical Skills Matrix -->
                            <div>
                                <h3 class="text-xs font-mono font-semibold uppercase text-gray-500 dark:text-slate-400 mb-3 tracking-wider">
                                    {{ coreSkillsText }}
                                </h3>
                                <div class="grid grid-cols-2 gap-4 text-xs">

                                    <!-- Frontend Block -->
                                    <div class="bg-gray-50 dark:bg-slate-950/40 p-4 rounded-lg border border-gray-100 dark:border-white/5 space-y-3">
                                        <div class="flex items-center gap-2 mb-1">
                                            <Icon name="lucide:monitor" class="w-4 h-4 text-sky-500" />
                                            <span class="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wide">{{ frontendText }}</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div v-for="skill in frontendSkills" :key="skill.name" class="space-y-1">
                                                <div class="flex justify-between items-center text-[10px] font-mono">
                                                    <span class="text-gray-700 dark:text-slate-300">{{ skill.name }}</span>
                                                    <span class="text-sky-600 dark:text-sky-400">{{ skill.level }}%</span>
                                                </div>
                                                <progress :value="skill.level" max="100" class="w-full h-1.5 [&::-webkit-progress-bar]:bg-gray-200 dark:[&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-sky-500 rounded-full overflow-hidden"></progress>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Backend Block -->
                                    <div class="bg-gray-50 dark:bg-slate-950/40 p-4 rounded-lg border border-gray-100 dark:border-white/5 space-y-3">
                                        <div class="flex items-center gap-2 mb-1">
                                            <Icon name="lucide:server" class="w-4 h-4 text-rose-500" />
                                            <span class="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wide">{{ backendText }}</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div v-for="skill in backendSkills" :key="skill.name" class="space-y-1">
                                                <div class="flex justify-between items-center text-[10px] font-mono">
                                                    <span class="text-gray-700 dark:text-slate-300">{{ skill.name }}</span>
                                                    <span class="text-rose-600 dark:text-rose-400">{{ skill.level }}%</span>
                                                </div>
                                                <progress :value="skill.level" max="100" class="w-full h-1.5 [&::-webkit-progress-bar]:bg-gray-200 dark:[&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-rose-500 rounded-full overflow-hidden"></progress>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <!-- Tooling / DevOps Pills -->
                                <div class="mt-4 bg-gray-50 dark:bg-slate-950/40 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                    <div class="flex flex-wrap gap-1.5">
                                        <span class="text-[9px] font-mono uppercase tracking-wider text-gray-500 dark:text-slate-400 px-2 py-0.5">DevOps & Tooling:</span>
                                        <span v-for="tool in toolingSkills" :key="tool" class="bg-gray-200/80 dark:bg-white/10 text-gray-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-300 dark:border-white/5">
                                            {{ tool }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Page Footer -->
                        <div class="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-[10px] font-mono text-gray-400 dark:text-slate-500">
                            <span>{{ titleText }} — Page 1 of 2</span>
                            <span>{{ footerRightText }}</span>
                        </div>
                    </div>

                    <!-- PAGE 2 SHEET -->
                    <div
                        ref="page2Ref"
                        class="w-[520px] sm:w-[600px] min-h-[750px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-sm shadow-xl p-8 text-gray-800 dark:text-slate-200 flex flex-col justify-between relative overflow-hidden transition-colors duration-200"
                    >
                        <div class="space-y-6">
                            <!-- Professional Experience -->
                            <div>
                                <h3 class="text-xs font-mono font-semibold uppercase text-gray-500 dark:text-slate-400 mb-4 tracking-wider">
                                    {{ proTimelineText }}
                                </h3>
                                <div class="space-y-4 pl-3 border-l border-gray-200 dark:border-white/10">
                                    <div
                                        v-for="(experience, index) in professionalExperiences"
                                        :key="index"
                                        class="relative pl-4"
                                    >
                                        <div class="absolute -left-4.25 top-1.5 w-2 h-2 rounded-full bg-rose-500" />
                                        <div class="flex justify-between items-start">
                                            <h4 class="text-xs font-bold text-gray-900 dark:text-white">
                                                {{ experience.title }}
                                            </h4>
                                            <span class="text-[10px] font-mono text-gray-500 dark:text-slate-400">{{ experience.date }}</span>
                                        </div>
                                        <p class="text-[11px] text-gray-600 dark:text-slate-400 mt-1">
                                            {{ experience.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Education & Certifications -->
                            <div>
                                <h3 class="text-xs font-mono font-semibold uppercase text-gray-500 dark:text-slate-400 mb-3 tracking-wider">
                                    {{ educationText }}
                                </h3>
                                <div class="bg-gray-50 dark:bg-slate-950/40 p-4 rounded-lg border border-gray-100 dark:border-white/5 space-y-2 text-xs shadow-sm dark:shadow-none">
                                    <div class="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-2">
                                        <span class="font-medium text-gray-800 dark:text-slate-200">Self-Taught Engineering Path</span>
                                        <span class="text-gray-500 dark:text-slate-400 font-mono text-[11px]">Continuous Learning</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-2">
                                        <span class="font-medium text-gray-800 dark:text-slate-200">Formation ELK</span>
                                        <span class="text-gray-500 dark:text-slate-400 font-mono text-[11px]">ORSYS - 2024</span>
                                    </div>
                                    <div class="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-2">
                                        <span class="font-medium text-gray-800 dark:text-slate-200">Formation Kafka</span>
                                        <span class="text-gray-500 dark:text-slate-400 font-mono text-[11px]">ORSYS - 2024</span>
                                    </div>
                                    <div class="flex justify-between items-center pb-2">
                                        <span class="font-medium text-gray-800 dark:text-slate-200">Dev Full Stack Bac+2</span>
                                        <span class="text-gray-500 dark:text-slate-400 font-mono text-[11px]">Digital Campus</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Page Footer -->
                        <div class="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-[10px] font-mono text-gray-400 dark:text-slate-500">
                            <span>cv.pdf — Page 2 of 2</span>
                            <span>{{ endOfDocumentText }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const { t, locale } = useI18n();

const showSidebar = ref(true);
const zoomLevel = ref(1);
const currentPage = ref(1);

const pdfContainer = ref(null);
const isExporting = ref(false);
const page1Ref = ref(null);
const page2Ref = ref(null);

const titleText = t("apps.about.title");
const pageCounterText = t("apps.about.pageCounter", {
    currentPage: currentPage.value,
    totalPages: 2,
});
const exportText = t("apps.about.export");
const exportingText = t("apps.about.exporting");
const zoomInText = t("apps.about.zoomIn");
const zoomOutText = t("apps.about.zoomOut");
const pagesText = t("apps.about.pages");
const roleText = t("apps.about.role");
const summaryText = t("apps.about.summary");
const summaryDescriptionText = t("apps.about.summaryDescription");
const coreSkillsText = t("apps.about.coreSkills");
const backendText = t("apps.about.backend");
const frontendText = t("apps.about.frontend");
const footerRightText = t("apps.about.footerRight");
const proTimelineText = t("apps.about.proTimeline");
const rolesFullStackText = t("apps.about.roles.fullStack");
const rolesEngineerText = t("apps.about.roles.engineer");
const rolesTechLeadText = t("apps.about.roles.techLead");
const rolesFreelanceText = t("apps.about.roles.freelance");
const experiencesSeniorText = t("apps.about.experiences.senior");

const professionalExperiencesWeDevTitleText = t("apps.about.professionalExperiences.wedev.title");
const professionalExperiencesWedevDescriptionText = t("apps.about.professionalExperiences.wedev.description");
const professionalExperiencesQ1C1TitleText = t("apps.about.professionalExperiences.q1c1.title");
const professionalExperiencesQ1C1DescriptionText = t("apps.about.professionalExperiences.q1c1.description");
const professionalExperiencesApodisTitleText = t("apps.about.professionalExperiences.apodisSante.title");
const professionalExperiencesApodisDescriptionText = t("apps.about.professionalExperiences.apodisSante.description");
const professionalExperiencesRaizeStudioTitleText = t("apps.about.professionalExperiences.raizeStudio.title");
const professionalExperiencesRaizeStudioDescriptionText = t("apps.about.professionalExperiences.raizeStudio.description");
const professionalExperiencesCgtiTitleText = t("apps.about.professionalExperiences.cgti.title");
const professionalExperiencesCgtiDescriptionText = t("apps.about.professionalExperiences.cgti.description");

const presentText = t("apps.about.present");
const educationText = t("apps.about.education");
const endOfDocumentText = t("apps.about.endOfDocument");

const frontendSkills = [
    { name: "Vue.js / Nuxt 3", level: 95 },
    { name: "TypeScript", level: 85 },
    { name: "Tailwind CSS", level: 90 },
    { name: "UI / WebGL", level: 75 },
];

const backendSkills = [
    { name: "Python / FastAPI", level: 90 },
    { name: "PostgreSQL", level: 85 },
    { name: "Docker / CI-CD", level: 80 },
    { name: "RabbitMQ / Kafka", level: 70 },
];

const toolingSkills = ["Git", "Linux", "Valkey / Redis", "WebStorm", "Figma"];

const professionalExperiences = [
    {
        title: `${rolesFullStackText} ${experiencesSeniorText} @ ${professionalExperiencesWeDevTitleText}`,
        date: `${new Date(2025, 7, 25).toLocaleDateString(locale.value)} - ${presentText}`,
        description: professionalExperiencesWedevDescriptionText,
    },
    {
        title: `${rolesEngineerText} @ ${professionalExperiencesQ1C1TitleText}`,
        date: `${new Date(2024, 2, 1).toLocaleDateString(locale.value)} - ${new Date(2025, 6, 30).toLocaleDateString(locale.value)}`,
        description: professionalExperiencesQ1C1DescriptionText,
    },
    {
        title: `${rolesEngineerText} @ ${professionalExperiencesApodisTitleText}`,
        date: `${new Date(2022, 9, 1).toLocaleDateString(locale.value)} - ${new Date(2023, 5, 31).toLocaleDateString(locale.value)}`,
        description: professionalExperiencesApodisDescriptionText,
    },
    {
        title: `${rolesFreelanceText} @ ${professionalExperiencesRaizeStudioTitleText}`,
        date: `${new Date(2021, 7, 1).toLocaleDateString(locale.value)} - ${presentText}`,
        description: professionalExperiencesRaizeStudioDescriptionText,
    },
    {
        title: `${rolesTechLeadText} @ ${professionalExperiencesCgtiTitleText}`,
        date: `${new Date(2019, 9, 1).toLocaleDateString(locale.value)} - ${new Date(2022, 7, 1).toLocaleDateString(locale.value)}`,
        description: professionalExperiencesCgtiDescriptionText,
    },
];

const zoomIn = () => {
    if (zoomLevel.value < 1.5) zoomLevel.value += 0.1;
};

const zoomOut = () => {
    if (zoomLevel.value > 0.6) zoomLevel.value -= 0.1;
};

const scrollToPage = (pageNumber) => {
    currentPage.value = pageNumber;
    const target = pageNumber === 1 ? page1Ref.value : page2Ref.value;
    if (target) {
        target.scrollIntoView({ behavior: "smooth" });
    }
};

const handleScroll = () => {
    if (!page2Ref.value) return;
    const page2Top = page2Ref.value.getBoundingClientRect().top;
    if (page2Top < window.innerHeight / 2) {
        currentPage.value = 2;
    } else {
        currentPage.value = 1;
    }
};

const downloadPDF = async () => {
    if (!import.meta.client || isExporting.value) return;

    isExporting.value = true;

    try {
        let page1Html = page1Ref.value?.outerHTML || "";
        let page2Html = page2Ref.value?.outerHTML || "";

        // Fix Relative Image Paths for Serverless Puppeteer
        const origin = window.location.origin;
        page1Html = page1Html.replace(/src="\/assets\//g, `src="${origin}/assets/`);
        page2Html = page2Html.replace(/src="\/assets\//g, `src="${origin}/assets/`);

        const combinedHtml = `
      <div class="flex flex-col gap-0 items-center justify-center">
        ${page1Html}
        <div style="page-break-before: always;"></div>
        ${page2Html}
      </div>
    `;

        // POST HTML to Vercel Serverless endpoint
        const response = await fetch("/api/export-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: combinedHtml }),
        });

        if (!response.ok) throw new Error("PDF Generation failed on server");

        // Download blob as downloadable file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Joel_PINHO_CV.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.warn(
            "Server export failed, falling back to native print window:",
            error,
        );
        window.print();
    } finally {
        isExporting.value = false;
    }
};
</script>
