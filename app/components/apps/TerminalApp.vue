<!-- components/apps/TerminalApp.vue -->
<template>
    <div
        class="h-full flex flex-col font-mono text-xs bg-slate-100/95 dark:bg-slate-950/95 text-slate-800 dark:text-slate-200 p-3 rounded-b-lg overflow-hidden select-text transition-colors duration-200 touch-manipulation"
        @click="focusInput"
    >
        <!-- Terminal Header Bar -->
        <div
            class="flex items-center justify-between pb-2 mb-2 border-b border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[11px] select-none shrink-0 transition-colors duration-200"
        >
            <div class="flex items-center space-x-2 min-w-0">
                <span
                    class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shrink-0"
                ></span>
                <span
                    class="text-slate-700 dark:text-slate-400 font-semibold truncate"
                    >zsh — {{ promptPath }}</span
                >
            </div>
            <span class="hidden sm:inline opacity-70 shrink-0">
                Press
                <kbd
                    class="px-1 py-0.5 bg-slate-200 dark:bg-white/10 rounded text-[10px] text-slate-700 dark:text-slate-300"
                    >Tab</kbd
                >
                to complete,
                <kbd
                    class="px-1 py-0.5 bg-slate-200 dark:bg-white/10 rounded text-[10px] text-slate-700 dark:text-slate-300"
                    >↑/↓</kbd
                >
                for history
            </span>
        </div>

        <!-- Output Logs Area -->
        <div
            ref="outputRef"
            class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin"
        >
            <!-- Welcome Greeting -->
            <div class="text-slate-600 dark:text-slate-400 mb-3">
                <p class="text-emerald-600 dark:text-emerald-400 font-bold">
                    zsh — Joel PINHO Portfolio Terminal v2.5
                </p>
                <p>
                    Type
                    <span class="text-sky-600 dark:text-sky-300 font-bold"
                        >help</span
                    >
                    for commands,
                    <span class="text-sky-600 dark:text-sky-300 font-bold"
                        >neofetch</span
                    >
                    for system info, or
                    <span class="text-sky-600 dark:text-sky-300 font-bold"
                        >ls</span
                    >
                    to list files.
                </p>
            </div>

            <!-- Output History -->
            <div
                v-for="(entry, index) in history"
                :key="index"
                class="space-y-1"
            >
                <!-- Command Prompt Line -->
                <div class="flex items-center space-x-2 flex-wrap">
                    <span
                        class="text-emerald-600 dark:text-emerald-400 font-bold"
                    >
                        <span class="hidden sm:inline">guest@portfolio</span>
                        <span class="sm:hidden">guest</span>
                    </span>
                    <span class="text-slate-400 dark:text-slate-500">:</span>
                    <span class="text-sky-600 dark:text-sky-400 font-bold">{{
                        entry.path
                    }}</span>
                    <span class="text-slate-600 dark:text-slate-300">$</span>
                    <span class="text-slate-900 dark:text-white font-medium">{{
                        entry.command
                    }}</span>
                </div>

                <!-- Command Result Output -->
                <div
                    v-if="entry.output"
                    class="pl-3 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-xs border-l-2 border-slate-300 dark:border-white/10 my-1"
                    :class="{
                        'text-rose-600 dark:text-rose-400 border-rose-500/50':
                            entry.isError,
                    }"
                >
                    <div v-html="entry.output"></div>
                </div>
            </div>

            <!-- Active Input Line -->
            <form
                @submit.prevent="executeCommand"
                class="flex items-center space-x-2 pt-1"
            >
                <span
                    class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0"
                >
                    <span class="hidden sm:inline">guest@portfolio</span>
                    <span class="sm:hidden">guest</span>
                </span>
                <span class="text-slate-400 dark:text-slate-500 shrink-0"
                    >:</span
                >
                <span
                    class="text-sky-600 dark:text-sky-400 font-bold shrink-0"
                    >{{ promptPath }}</span
                >
                <span class="text-slate-600 dark:text-slate-300 shrink-0"
                    >$</span
                >
                <div class="relative flex-1 min-w-0">
                    <input
                        ref="inputRef"
                        v-model="currentCommand"
                        type="text"
                        class="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white font-mono focus:ring-0 p-0 text-[16px] sm:text-xs"
                        autofocus
                        spellcheck="false"
                        autocomplete="off"
                        @keydown.tab.prevent="handleTabCompletion"
                        @keydown.up.prevent="navigateHistory('up')"
                        @keydown.down.prevent="navigateHistory('down')"
                    />
                </div>
            </form>
        </div>

        <!-- Mobile Touch Navigation & Command Helper Bar (< 640px) -->
        <div
            class="sm:hidden flex items-center justify-between gap-1 pt-2 pb-1 border-t border-slate-300 dark:border-white/10 shrink-0 text-[11px] overflow-x-auto custom-scrollbar-none"
        >
            <div class="flex items-center gap-1 shrink-0">
                <button
                    type="button"
                    @click.stop="handleTabCompletion"
                    class="px-2 py-1 bg-slate-200 dark:bg-white/10 active:bg-slate-300 dark:active:bg-white/20 rounded text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                >
                    Tab
                </button>

                <button
                    type="button"
                    @click.stop="navigateHistory('up')"
                    class="px-2 py-1 bg-slate-200 dark:bg-white/10 active:bg-slate-300 dark:active:bg-white/20 rounded text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                >
                    ▲
                </button>

                <button
                    type="button"
                    @click.stop="navigateHistory('down')"
                    class="px-2 py-1 bg-slate-200 dark:bg-white/10 active:bg-slate-300 dark:active:bg-white/20 rounded text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                >
                    ▼
                </button>
            </div>

            <div
                class="flex items-center gap-1 overflow-x-auto custom-scrollbar-none shrink-0"
            >
                <button
                    type="button"
                    @click.stop="quickCommand('ls')"
                    class="px-2 py-1 bg-sky-500/15 text-sky-600 dark:text-sky-300 active:bg-sky-500/30 rounded font-medium cursor-pointer shrink-0"
                >
                    ls
                </button>
                <button
                    type="button"
                    @click.stop="quickCommand('cd ..')"
                    class="px-2 py-1 bg-sky-500/15 text-sky-600 dark:text-sky-300 active:bg-sky-500/30 rounded font-medium cursor-pointer shrink-0"
                >
                    cd ..
                </button>
                <button
                    type="button"
                    @click.stop="quickCommand('neofetch')"
                    class="px-2 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-300 active:bg-amber-500/30 rounded font-medium cursor-pointer shrink-0"
                >
                    neofetch
                </button>
                <button
                    type="button"
                    @click.stop="quickCommand('clear')"
                    class="px-2 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 active:bg-slate-300 rounded font-medium cursor-pointer shrink-0"
                >
                    clear
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useWindowManager } from "~/composables/useWindowManager";
import { useTheme } from "~/composables/useTheme";

interface HistoryEntry {
    command: string;
    output?: string;
    path: string;
    isError?: boolean;
}

interface FSNode {
    name: string;
    type: "dir" | "file";
    ext?: string;
    targetAppId?: string;
    demoUrl?: string;
    content?: string;
    children?: Record<string, FSNode>;
}

const { openWindow } = useWindowManager();
const { toggleTheme } = useTheme();

const currentPath = ref<string[]>([]);
const currentCommand = ref("");
const history = ref<HistoryEntry[]>([]);
const cmdHistoryList = ref<string[]>([]);
const cmdHistoryPointer = ref<number>(-1);

const inputRef = ref<HTMLInputElement | null>(null);
const outputRef = ref<HTMLElement | null>(null);

// Virtual File System Definition
const fileSystem: Record<string, FSNode> = {
    desktop: {
        name: "desktop",
        type: "dir",
        children: {
            "About_Me.pdf": {
                name: "About_Me.pdf",
                type: "file",
                ext: "pdf",
                targetAppId: "about",
                content:
                    "About Me Resume PDF\nRole: Full-Stack Developer\nStack: Vue 3, Nuxt 4, FastAPI, Python, PostgreSQL",
            },
            "Contact_Mail.eml": {
                name: "Contact_Mail.eml",
                type: "file",
                ext: "eml",
                targetAppId: "contact",
                content:
                    "Draft email to Joel PINHO\nLaunch the Contact app on desktop to send a direct message!",
            },
        },
    },
    projects: {
        name: "projects",
        type: "dir",
        children: {
            WeDev: {
                name: "WeDev",
                type: "dir",
                children: {
                    "gaia.vue": {
                        name: "gaia.vue",
                        type: "file",
                        ext: "vue",
                        demoUrl: "https://gaia.we-dev.io",
                        content:
                            "<!-- Gaia Nuxt Base Template for Car Rentals -->",
                    },
                    "helios.py": {
                        name: "helios.py",
                        type: "file",
                        ext: "py",
                        content:
                            'from fastapi import FastAPI\n\napp = FastAPI(title="Helios Rental Engine")',
                    },
                    "europcar_mb.vue": {
                        name: "europcar_mb.vue",
                        type: "file",
                        ext: "vue",
                        demoUrl: "https://europcarmontblanc.fr",
                        content: "<!-- Europcar Mont-Blanc Booking System -->",
                    },
                    "README.md": {
                        name: "README.md",
                        type: "file",
                        ext: "md",
                        content:
                            "# WeDev Ecosystem\nSoftware solutions for car rental companies.",
                    },
                },
            },
            Apodis: {
                name: "Apodis",
                type: "dir",
                children: {
                    "README.md": {
                        name: "README.md",
                        type: "file",
                        ext: "md",
                        content:
                            "# Apodis Health Solutions\nHealthcare software for pharmacies & patients.",
                    },
                },
            },
            CGTI_by_Camusat: {
                name: "CGTI_by_Camusat",
                type: "dir",
                children: {
                    "README.md": {
                        name: "README.md",
                        type: "file",
                        ext: "md",
                        content:
                            "# CGTI Fiber Optics Deployment Management Platform",
                    },
                },
            },
        },
    },
    documents: {
        name: "documents",
        type: "dir",
        children: {
            "skills.json": {
                name: "skills.json",
                type: "file",
                ext: "json",
                content:
                    '{\n  "frontend": ["Vue 3", "Nuxt 4", "TypeScript", "Tailwind CSS"],\n  "backend": ["Python", "FastAPI", "PostgreSQL", "Docker", "Valkey", "RabbitMQ"]\n}',
            },
        },
    },
    downloads: {
        name: "downloads",
        type: "dir",
        children: {},
    },
};

const getCurrentNode = (
    pathArr: string[] = currentPath.value,
): FSNode | null => {
    let curr: FSNode = { name: "~", type: "dir", children: fileSystem };
    for (const part of pathArr) {
        if (!curr.children || !curr.children[part]) return null;
        curr = curr.children[part];
    }
    return curr;
};

const promptPath = computed(() => {
    return currentPath.value.length === 0
        ? "~"
        : `~/${currentPath.value.join("/")}`;
});

const focusInput = () => {
    inputRef.value?.focus();
};

const quickCommand = (cmdStr: string) => {
    currentCommand.value = cmdStr;
    executeCommand();
};

const scrollToBottom = () => {
    nextTick(() => {
        if (outputRef.value) {
            outputRef.value.scrollTop = outputRef.value.scrollHeight;
        }
    });
};

// Multi-segment Path Resolver
const resolvePath = (targetPath: string) => {
    let tempPath = [...currentPath.value];

    if (targetPath.startsWith("~") || targetPath.startsWith("/")) {
        tempPath = [];
        targetPath = targetPath.replace(/^[~\/]+/, "");
    }

    const segments = targetPath.split("/").filter(Boolean);

    for (const seg of segments) {
        if (seg === ".") continue;
        if (seg === "..") {
            if (tempPath.length > 0) tempPath.pop();
            continue;
        }

        const node = getCurrentNode(tempPath);
        if (node && node.children && node.children[seg]) {
            if (node.children[seg].type === "dir") {
                tempPath.push(seg);
            } else {
                return { error: `cd: not a directory: ${seg}` };
            }
        } else {
            return { error: `cd: no such file or directory: ${targetPath}` };
        }
    }

    return { path: tempPath };
};

const getNodeByPath = (pathStr: string) => {
    const lastSlashIdx = pathStr.lastIndexOf("/");
    let parentPathStr = "";
    let filename = pathStr;

    if (lastSlashIdx !== -1) {
        parentPathStr = pathStr.slice(0, lastSlashIdx);
        filename = pathStr.slice(lastSlashIdx + 1);
    }

    const parentRes = parentPathStr
        ? resolvePath(parentPathStr)
        : { path: currentPath.value };
    if (parentRes.error || !parentRes.path)
        return { error: parentRes.error || "Invalid path" };

    const parentNode = getCurrentNode(parentRes.path);
    if (!parentNode || !parentNode.children)
        return { error: `No such file or directory: ${pathStr}` };

    if (!filename) return { node: parentNode };

    const targetNode = parentNode.children[filename];
    if (!targetNode) return { error: `No such file or directory: ${pathStr}` };

    return { node: targetNode };
};

// Command History
const navigateHistory = (direction: "up" | "down") => {
    if (cmdHistoryList.value.length === 0) return;

    if (direction === "up") {
        if (cmdHistoryPointer.value < cmdHistoryList.value.length - 1) {
            cmdHistoryPointer.value++;
        }
    } else {
        if (cmdHistoryPointer.value > 0) {
            cmdHistoryPointer.value--;
        } else {
            cmdHistoryPointer.value = -1;
            currentCommand.value = "";
            return;
        }
    }

    const idx = cmdHistoryList.value.length - 1 - cmdHistoryPointer.value;
    if (cmdHistoryList.value[idx] !== undefined) {
        currentCommand.value = cmdHistoryList.value[idx];
    }
};

// Tab Auto-Completion
const handleTabCompletion = () => {
    const text = currentCommand.value;
    if (!text.trim()) return;

    const firstSpaceIdx = text.indexOf(" ");
    if (firstSpaceIdx === -1) {
        const knownCommands = [
            "help",
            "ls",
            "cd",
            "pwd",
            "cat",
            "open",
            "launch",
            "whoami",
            "clear",
            "neofetch",
            "theme",
            "about",
            "projects",
            "contact",
        ];
        const matches = knownCommands.filter((c) =>
            c.startsWith(text.toLowerCase()),
        );
        if (matches.length === 1) {
            currentCommand.value = matches[0] + " ";
        }
        return;
    }

    const cmd = text.slice(0, firstSpaceIdx).toLowerCase();
    const arg = text.slice(firstSpaceIdx + 1);

    const lastSlashIdx = arg.lastIndexOf("/");
    let parentPathStr = "";
    let searchTerm = arg;

    if (lastSlashIdx !== -1) {
        parentPathStr = arg.slice(0, lastSlashIdx + 1);
        searchTerm = arg.slice(lastSlashIdx + 1);
    }

    const targetDirRes = parentPathStr
        ? resolvePath(parentPathStr)
        : { path: currentPath.value };
    if (!targetDirRes.path) return;

    const node = getCurrentNode(targetDirRes.path);
    if (!node || !node.children) return;

    const candidates = Object.keys(node.children);
    const matches = candidates.filter((c) =>
        c.toLowerCase().startsWith(searchTerm.toLowerCase()),
    );

    if (matches.length === 1) {
        const matchNode = node.children[matches[0]];
        const suffix = matchNode.type === "dir" ? "/" : "";
        currentCommand.value = `${cmd} ${parentPathStr}${matches[0]}${suffix}`;
    }
};

const executeCommand = () => {
    const rawInput = currentCommand.value.trim();
    if (!rawInput) return;

    cmdHistoryList.value.push(rawInput);
    cmdHistoryPointer.value = -1;

    const entry: HistoryEntry = {
        command: rawInput,
        path: promptPath.value,
        isError: false,
    };

    const parts = rawInput.split(" ").filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
        case "help":
            entry.output = `Available Commands:
  • <span class="text-sky-600 dark:text-sky-300 font-bold">ls [dir]</span>          - List contents of current or target directory
  • <span class="text-sky-600 dark:text-sky-300 font-bold">cd &lt;dir&gt;</span>        - Navigate directories (supports 'projects/', '..', '~/projects/WeDev')
  • <span class="text-sky-600 dark:text-sky-300 font-bold">pwd</span>             - Print current working directory path
  • <span class="text-sky-600 dark:text-sky-300 font-bold">cat &lt;file&gt;</span>      - Display file contents
  • <span class="text-sky-600 dark:text-sky-300 font-bold">open &lt;file|app&gt;</span> - Launch desktop app window or open live website
  • <span class="text-sky-600 dark:text-sky-300 font-bold">neofetch</span>        - Display system & stack overview
  • <span class="text-sky-600 dark:text-sky-300 font-bold">theme</span>           - Toggle light/dark desktop theme
  • <span class="text-sky-600 dark:text-sky-300 font-bold">whoami</span>          - Print active user session details
  • <span class="text-sky-600 dark:text-sky-300 font-bold">clear</span>           - Reset terminal screen buffer`;
            break;

        case "neofetch":
        case "fetch":
        entry.output = `
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-6 py-1 items-start">
          <!-- Retro Macintosh Classic 128K ASCII Art -->
          <div class="font-mono text-[9px] sm:text-[11px] leading-tight shrink-0 select-none font-bold whitespace-pre">
        <span class="text-slate-400 dark:text-slate-500">       .----------------------------.</span>
        <span class="text-slate-400 dark:text-slate-500">      /  .------------------------.  \\</span>
        <span class="text-slate-400 dark:text-slate-500">     /  /  ______________________  \\  \\</span>
        <span class="text-slate-400 dark:text-slate-500">    |  |  |                      |  |  |</span>
        <span class="text-sky-500 dark:text-sky-400">    |  |  |  macOS               |  |  |</span>
        <span class="text-sky-500 dark:text-sky-400">    |  |  |  Golden Gate         |  |  |</span>
        <span class="text-sky-500 dark:text-sky-400">    |  |  |  27.0.1              |  |  |</span>
        <span class="text-slate-400 dark:text-slate-500">    |  |  |______________________|  |  |</span>
        <span class="text-slate-400 dark:text-slate-500">    |  |                            |  |</span>
        <span class="text-slate-400 dark:text-slate-500">    |  \`----------------------------'  |</span>
        <span class="text-slate-400 dark:text-slate-500">    |                                  |</span>
        <span class="text-rose-500">    |   <span class="text-rose-500">(</span><span class="text-amber-400">c</span><span class="text-emerald-500">)</span>       <span class="text-slate-500 dark:text-slate-400">===================</span>  |</span>
        <span class="text-slate-400 dark:text-slate-500">    |            <span class="text-slate-600 dark:text-slate-400">[___________________]</span> |</span>
        <span class="text-slate-500 dark:text-slate-400">     \\________________________________/</span>
        <span class="text-slate-600 dark:text-slate-500">         [________________________]</span>
          </div>

          <!-- System Information Details -->
          <div class="space-y-1 text-xs font-mono pt-1">
            <div class="border-b border-slate-300 dark:border-white/10 pb-1 mb-1">
              <span class="text-emerald-600 dark:text-emerald-400 font-bold">guest</span><span class="text-slate-400">@</span><span class="text-sky-600 dark:text-sky-400 font-bold">portfolio</span>
              <div class="text-[10px] text-slate-400">------------------</div>
            </div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">OS:</span> macOS Golden Gate 27.0.1 (Nuxt 4)</div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">Host:</span> Joel PINHO — Senior Full-Stack Engineer</div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">Uptime:</span> 99.9% (Continuous Deployment)</div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">Location:</span> Nantes, France / Global Remote</div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">Shell:</span> zsh 5.9 (x86_64-apple-darwin24.0)</div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">Terminal:</span> Zed Integrated Terminal</div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">Primary Stack:</span> Python, FastAPI, Vue 3, Nuxt, Docker</div>
            <div><span class="text-emerald-600 dark:text-emerald-400 font-bold">Theme:</span> 27.0.1 - Golden Gate Dynamic Glass</div>

            <!-- Terminal Color Palette Block -->
            <div class="flex gap-1 pt-2">
              <span class="w-3 h-3 rounded-xs bg-slate-900 dark:bg-slate-100"></span>
              <span class="w-3 h-3 rounded-xs bg-rose-500"></span>
              <span class="w-3 h-3 rounded-xs bg-emerald-500"></span>
              <span class="w-3 h-3 rounded-xs bg-amber-400"></span>
              <span class="w-3 h-3 rounded-xs bg-sky-500"></span>
              <span class="w-3 h-3 rounded-xs bg-purple-500"></span>
              <span class="w-3 h-3 rounded-xs bg-cyan-400"></span>
            </div>
          </div>
        </div>`
            break;

        case "theme":
            toggleTheme();
            entry.output = "Theme toggled successfully.";
            break;

        case "pwd":
            entry.output = promptPath.value;
            break;

        case "ls": {
            const targetPathStr = args[0];
            const targetRes = targetPathStr
                ? getNodeByPath(targetPathStr)
                : { node: getCurrentNode() };

            if (targetRes.error || !targetRes.node) {
                entry.isError = true;
                entry.output =
                    targetRes.error ||
                    `ls: cannot access '${targetPathStr}': No such file or directory`;
                break;
            }

            const node = targetRes.node;
            if (node.type === "file") {
                entry.output = `<span class="text-slate-800 dark:text-slate-200">${node.name}</span>`;
                break;
            }

            if (!node.children) {
                entry.output = "Directory is empty";
                break;
            }

            const items = Object.values(node.children).map((item) => {
                if (item.type === "dir") {
                    return `<span class="text-sky-600 dark:text-sky-400 font-bold">${item.name}/</span>`;
                }
                if (item.ext === "vue")
                    return `<span class="text-emerald-600 dark:text-emerald-400 font-medium">${item.name}</span>`;
                if (item.ext === "py")
                    return `<span class="text-sky-600 dark:text-sky-300">${item.name}</span>`;
                if (item.ext === "pdf")
                    return `<span class="text-rose-600 dark:text-rose-400">${item.name}</span>`;
                return `<span class="text-slate-800 dark:text-slate-200">${item.name}</span>`;
            });

            entry.output = items.join("    ") || "Directory is empty";
            break;
        }

        case "cd": {
            const target = args[0];
            if (!target || target === "~" || target === "/") {
                currentPath.value = [];
                break;
            }

            const res = resolvePath(target);
            if (res.error) {
                entry.isError = true;
                entry.output = res.error;
            } else if (res.path) {
                currentPath.value = res.path;
            }
            break;
        }

        case "cat": {
            const target = args[0];
            if (!target) {
                entry.isError = true;
                entry.output = "cat: missing file operand";
                break;
            }

            const res = getNodeByPath(target);
            if (res.error || !res.node) {
                entry.isError = true;
                entry.output =
                    res.error || `cat: ${target}: No such file or directory`;
            } else if (res.node.type === "file") {
                entry.output = res.node.content || "File is empty";
            } else {
                entry.isError = true;
                entry.output = `cat: ${target}: Is a directory`;
            }
            break;
        }

        case "open":
        case "launch": {
            const targetName = args[0];
            if (!targetName) {
                entry.isError = true;
                entry.output = "open: missing app or file name";
                break;
            }

            const lowerTarget = targetName.toLowerCase();
            if (
                [
                    "projects",
                    "about",
                    "contact",
                    "terminal",
                    "finder",
                    "dice",
                    "zed",
                ].includes(lowerTarget)
            ) {
                const appId =
                    lowerTarget === "finder" ? "projects" : lowerTarget;
                openWindow(appId);
                entry.output = `Launching [${lowerTarget}] app window...`;
                break;
            }

            const res = getNodeByPath(targetName);
            if (res.node) {
                const item = res.node;
                if (item.type === "dir") {
                    openWindow("projects");
                    entry.output = `Opening directory '${item.name}' in Finder...`;
                } else if (item.targetAppId) {
                    openWindow(item.targetAppId);
                    entry.output = `Opening ${item.name} in [${item.targetAppId}] app...`;
                } else if (item.demoUrl) {
                    if (import.meta.client) window.open(item.demoUrl, "_blank");
                    entry.output = `Opening live URL: ${item.demoUrl}`;
                } else {
                    entry.output = item.content || `Inspected ${item.name}`;
                }
            } else {
                entry.isError = true;
                entry.output = `open: command or file not found: ${targetName}`;
            }
            break;
        }

        case "projects":
        case "about":
        case "contact":
        case "dice":
        case "zed":
            openWindow(cmd);
            entry.output = `Launching [${cmd}] app window...`;
            break;

        case "whoami":
            entry.output =
                "guest@visitor-session [Role: Recruiter / Full-Stack Developer]";
            break;

        case "clear":
            history.value = [];
            currentCommand.value = "";
            return;

        default:
            entry.isError = true;
            entry.output = `zsh: command not found: ${cmd}. Type 'help' to see available commands.`;
            break;
    }

    history.value.push(entry);
    currentCommand.value = "";
    scrollToBottom();
};
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
}
:global(.dark) .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
}

.custom-scrollbar-none::-webkit-scrollbar {
    display: none;
}
.custom-scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
