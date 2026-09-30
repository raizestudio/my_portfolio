<!-- components/desktop/MenuBar.vue -->
<template>
    <div
        class="menu-bar-container fixed top-0 left-0 right-0 h-7 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-2 z-[100] text-white text-[13px] font-medium select-none"
    >
        <!-- Left: Apple Menu & Dynamic Active App Menus -->
        <div class="flex items-center space-x-1">
            <!-- Apple Logo Menu -->
            <div class="relative">
                <button
                    @click.stop="toggleMenu('apple')"
                    class="px-2 py-0.5 rounded transition-colors flex items-center justify-center focus:outline-none"
                    :class="
                        activeMenu === 'apple'
                            ? 'bg-white/20'
                            : 'hover:bg-white/10'
                    "
                >
                    <Icon
                        name="simple-icons:apple"
                        class="w-3.5 h-3.5 fill-current"
                    />
                </button>

                <!-- Apple Dropdown -->
                <div
                    v-if="activeMenu === 'apple'"
                    class="absolute left-0 top-7 w-52 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 text-slate-200 z-50 text-[12px]"
                >
                    <button
                        @click="openWindow('about')"
                        class="w-full text-left px-3 py-1 hover:bg-sky-600 hover:text-white flex items-center justify-between"
                    >
                        <span>About Portfolio</span>
                        <span class="text-[10px] opacity-60">⌘I</span>
                    </button>
                    <div class="my-1 border-t border-white/10" />
                    <a
                        href="https://github.com/raizestudio"
                        target="_blank"
                        class="w-full text-left px-3 py-1 hover:bg-sky-600 hover:text-white flex items-center justify-between"
                    >
                        <span>GitHub Profile</span>
                        <Icon
                            name="lucide:external-link"
                            class="w-3 h-3 opacity-60"
                        />
                    </a>
                    <div class="my-1 border-t border-white/10" />
                    <button
                        @click="reloadPage"
                        class="w-full text-left px-3 py-1 hover:bg-sky-600 hover:text-white"
                    >
                        Restart Desktop
                    </button>
                </div>
            </div>

            <!-- Active Application Name -->
            <div class="relative">
                <button
                    @click.stop="toggleMenu('app')"
                    class="px-2 py-0.5 rounded font-bold transition-colors focus:outline-none"
                    :class="
                        activeMenu === 'app'
                            ? 'bg-white/20'
                            : 'hover:bg-white/10'
                    "
                >
                    {{ activeAppName }}
                </button>

                <!-- Active App Dropdown -->
                <div
                    v-if="activeMenu === 'app' && activeWindow"
                    class="absolute left-0 top-7 w-48 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 text-slate-200 z-50 text-[12px]"
                >
                    <div
                        class="px-3 py-1 text-slate-400 font-semibold text-[11px] uppercase tracking-wider"
                    >
                        {{ activeWindow.title }}
                    </div>
                    <div class="my-1 border-t border-white/10" />
                    <button
                        @click="closeWindow(activeWindow.id)"
                        class="w-full text-left px-3 py-1 hover:bg-rose-600 hover:text-white flex items-center justify-between text-rose-300"
                    >
                        <span>Quit {{ activeWindow.title }}</span>
                        <span class="text-[10px] opacity-60">⌘Q</span>
                    </button>
                </div>
            </div>

            <!-- Standard Menu Items -->
            <button
                class="hidden sm:inline-block px-2 py-0.5 rounded hover:bg-white/10 transition-colors focus:outline-none"
            >
                File
            </button>
            <button
                class="hidden sm:inline-block px-2 py-0.5 rounded hover:bg-white/10 transition-colors focus:outline-none"
            >
                Edit
            </button>
            <button
                class="hidden sm:inline-block px-2 py-0.5 rounded hover:bg-white/10 transition-colors focus:outline-none"
            >
                View
            </button>
        </div>

        <!-- Right: Control Center Widgets & Clock -->
        <div class="flex items-center space-x-1">
            <!-- Dynamic macOS Battery & Status Icons -->
            <div class="flex items-center space-x-1 text-white/90">
                <!-- macOS Filled Battery Capsule -->
                <div
                    class="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer flex items-center gap-1.5 text-[11px]"
                    :title="`${batteryLevel}% ${isCharging ? '(Charging)' : ''}`"
                >
                    <span class="font-mono text-[11px] opacity-90"
                        >{{ batteryLevel }}%</span
                    >

                    <div class="relative flex items-center">
                        <svg
                            width="22"
                            height="11"
                            viewBox="0 0 22 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <!-- Outer Battery Shell -->
                            <rect
                                x="0.75"
                                y="0.75"
                                width="18.5"
                                height="9.5"
                                rx="2.25"
                                stroke="currentColor"
                                stroke-opacity="0.8"
                                stroke-width="1.2"
                            />
                            <!-- Battery Cap -->
                            <path
                                d="M20.5 3.5C21.0523 3.5 21.5 3.94772 21.5 4.5V6.5C21.5 7.05228 21.0523 7.5 20.5 7.5V3.5Z"
                                fill="currentColor"
                                fill-opacity="0.6"
                            />
                            <!-- Proportional Fill Bar -->
                            <rect
                                x="2.25"
                                y="2.25"
                                :width="
                                    Math.max(1, (batteryLevel / 100) * 15.5)
                                "
                                height="6.5"
                                rx="1.2"
                                :class="[
                                    isCharging
                                        ? 'fill-emerald-400'
                                        : batteryLevel <= 20
                                          ? 'fill-rose-500'
                                          : 'fill-white',
                                ]"
                            />
                        </svg>
                        <!-- Lightning Bolt Overlay for Charging -->
                        <Icon
                            v-if="isCharging"
                            name="lucide:zap"
                            class="w-2.5 h-2.5 text-slate-950 fill-slate-950 absolute left-[7px] top-[1px]"
                        />
                    </div>
                </div>

                <div
                    @click.stop="toggleSpotlight"
                    class="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
                    title="Spotlight Search (⌘ + Space)"
                >
                    <Icon name="lucide:search" class="w-3.5 h-3.5" />
                </div>

                <div
                    class="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
                >
                    <Icon name="lucide:wifi" class="w-4 h-4" />
                </div>

                <div
                    @click="openWindow('terminal')"
                    class="px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
                    title="Open Terminal / Search"
                >
                    <Icon name="lucide:search" class="w-3.5 h-3.5" />
                </div>
            </div>

            <!-- Control Center Toggle -->
            <div class="relative">
                <button
                    @click.stop="toggleMenu('controlCenter')"
                    class="px-1.5 py-0.5 rounded transition-colors focus:outline-none flex items-center"
                    :class="
                        activeMenu === 'controlCenter'
                            ? 'bg-white/20'
                            : 'hover:bg-white/10'
                    "
                >
                    <Icon
                        name="lucide:sliders-horizontal"
                        class="w-3.5 h-3.5"
                    />
                </button>

                <!-- Control Center Popover -->
                <div
                    v-if="activeMenu === 'controlCenter'"
                    class="absolute right-0 top-7 w-64 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 text-slate-200 z-50 space-y-3"
                >
                    <div class="grid grid-cols-2 gap-2">
                        <div
                            class="bg-white/10 p-2 rounded-xl flex items-center space-x-2"
                        >
                            <div
                                class="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white"
                            >
                                <Icon name="lucide:wifi" class="w-4 h-4" />
                            </div>
                            <div class="text-[11px] leading-tight">
                                <div class="font-semibold text-white">
                                    Wi-Fi
                                </div>
                                <div class="text-slate-400">Connected</div>
                            </div>
                        </div>

                        <div
                            class="bg-white/10 p-2 rounded-xl flex items-center space-x-2"
                        >
                            <div
                                class="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white"
                            >
                                <Icon name="lucide:bluetooth" class="w-4 h-4" />
                            </div>
                            <div class="text-[11px] leading-tight">
                                <div class="font-semibold text-white">
                                    Bluetooth
                                </div>
                                <div class="text-slate-400">On</div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/10 p-2.5 rounded-xl space-y-1">
                        <div
                            class="text-[11px] text-slate-300 font-medium flex justify-between"
                        >
                            <span>Display</span>
                            <Icon name="lucide:sun" class="w-3.5 h-3.5" />
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            value="90"
                            class="w-full accent-sky-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div class="bg-white/10 p-2.5 rounded-xl space-y-1">
                        <div
                            class="text-[11px] text-slate-300 font-medium flex justify-between"
                        >
                            <span>Sound</span>
                            <Icon name="lucide:volume-2" class="w-3.5 h-3.5" />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value="70"
                            class="w-full accent-sky-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <!-- Clock Display -->
            <div
                class="px-2 py-0.5 rounded hover:bg-white/10 cursor-default text-[12px]"
            >
                {{ formattedTime }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useWindowManager } from "~/composables/useWindowManager";

const { activeWindow, openWindow, closeWindow, toggleSpotlight } =
    useWindowManager();
const { locale } = useI18n();

const activeMenu = ref<string | null>(null);

const activeAppName = computed(() => {
    return activeWindow.value ? activeWindow.value.title : "Finder";
});

const toggleMenu = (menuName: string) => {
    activeMenu.value = activeMenu.value === menuName ? null : menuName;
};

const closeMenus = () => {
    activeMenu.value = null;
};

const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (activeMenu.value && !target.closest(".menu-bar-container")) {
        closeMenus();
    }
};

const reloadPage = () => {
    if (import.meta.client) {
        window.location.reload();
    }
};

// macOS Clock & Battery Logic
const formattedTime = ref("");
let timer: ReturnType<typeof setInterval>;

const batteryLevel = ref(100);
const isCharging = ref(false);
let batteryObj: any = null;

const updateBatteryStatus = (battery: any) => {
    if (battery && typeof battery.level === "number" && !isNaN(battery.level)) {
        batteryLevel.value = Math.round(battery.level * 100);
        isCharging.value = Boolean(battery.charging);
    }
};

const updateTime = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString(locale.value, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
    const timeStr = now.toLocaleTimeString(locale.value, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    });
    formattedTime.value = `${dateStr} ${timeStr}`;
};

onMounted(async () => {
    updateTime();
    timer = setInterval(updateTime, 1000);

    if (import.meta.client) {
        window.addEventListener("click", handleOutsideClick);

        if ("getBattery" in navigator) {
            try {
                // @ts-ignore
                batteryObj = await navigator.getBattery();
                updateBatteryStatus(batteryObj);

                batteryObj.addEventListener("levelchange", () =>
                    updateBatteryStatus(batteryObj),
                );
                batteryObj.addEventListener("chargingchange", () =>
                    updateBatteryStatus(batteryObj),
                );
            } catch (e) {
                console.warn("Battery status API restricted or unavailable.");
            }
        }
    }
});

onUnmounted(() => {
    if (timer) clearInterval(timer);

    if (import.meta.client) {
        window.removeEventListener("click", handleOutsideClick);

        if (batteryObj) {
            batteryObj.removeEventListener("levelchange", () =>
                updateBatteryStatus(batteryObj),
            );
            batteryObj.removeEventListener("chargingchange", () =>
                updateBatteryStatus(batteryObj),
            );
        }
    }
});
</script>
