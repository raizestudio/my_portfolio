<!-- components/desktop/MenuBar.vue -->
<template>
  <div
    class="menu-bar-container fixed top-0 left-0 right-0 h-7 flex items-center justify-between px-2 z-[100] text-slate-800 dark:text-white text-[13px] font-medium select-none transition-colors duration-200 transform-gpu bg-transparent border-none"
  >
    <!-- Left: Apple Menu & Dynamic Active App Menus -->
    <div class="flex items-center space-x-1 min-w-0 shrink">
      <!-- Apple Logo Menu -->
      <div class="relative shrink-0">
        <button
          @click.stop="toggleMenu('apple')"
          class="px-2 py-1 rounded-full transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
          :class="activeMenu === 'apple' ? 'bg-black/10 dark:bg-white/15' : 'hover:bg-black/5 dark:hover:bg-white/10'"
        >
          <Icon name="simple-icons:apple" class="w-3.5 h-3.5 fill-current" />
        </button>

        <!-- Apple Dropdown -->
        <div
          v-if="activeMenu === 'apple'"
          class="absolute left-0 top-8 w-56 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl backdrop-saturate-180 border border-black/10 dark:border-white/20 ring-1 ring-black/5 dark:ring-white/10 rounded-xl shadow-2xl text-slate-800 dark:text-slate-100 z-[110] text-[12px] space-y-0.5 transform-gpu transition-colors duration-200"
          style="-webkit-backdrop-filter: blur(24px) saturate(180%);"
        >
          <button
            @click="openWindow('about')"
            class="w-full text-left px-2.5 py-1 rounded-lg hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-between group/item cursor-pointer"
          >
            <span>{{ aboutPortfolioText }}</span>
            <span class="text-[10px] opacity-50 group-hover/item:opacity-80 font-mono">⌘I</span>
          </button>

          <div class="my-1 border-t border-gray-200 dark:border-white/10 mx-1" />

          <a
            href="https://github.com/raizestudio"
            target="_blank"
            class="w-full text-left px-2.5 py-1 rounded-lg hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-between group/item cursor-pointer"
          >
            <span>{{ githubProfileText }}</span>
            <Icon name="lucide:external-link" class="w-3 h-3 opacity-50 group-hover/item:opacity-80" />
          </a>

          <div class="my-1 border-t border-gray-200 dark:border-white/10 mx-1" />

          <button
            @click="reloadPage"
            class="w-full text-left px-2.5 py-1 rounded-lg hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
          >
            {{ restartDesktopText }}
          </button>
        </div>
      </div>

      <!-- Active Application Name -->
      <div class="relative min-w-0">
        <button
          @click.stop="toggleMenu('app')"
          class="px-2 py-0.5 rounded font-bold transition-colors focus:outline-none truncate max-w-[120px] sm:max-w-none cursor-pointer"
          :class="activeMenu === 'app' ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'"
        >
          {{ activeAppName }}
        </button>

        <!-- Active App Dropdown -->
        <div
          v-if="activeMenu === 'app' && activeWindow"
          class="absolute left-0 top-7 w-48 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl backdrop-saturate-180 border border-black/10 dark:border-white/15 rounded-xl shadow-2xl text-slate-800 dark:text-slate-200 z-50 text-[12px] space-y-0.5 transform-gpu transition-colors duration-200"
          style="-webkit-backdrop-filter: blur(24px) saturate(180%);"
        >
          <div class="px-2.5 py-1 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            {{ activeWindow.title }}
          </div>
          <div class="my-1 border-t border-gray-200 dark:border-white/10 mx-1" />
          <button
            @click="closeWindow(activeWindow.id)"
            class="w-full text-left px-2.5 py-1 rounded-lg hover:bg-rose-600 hover:text-white flex items-center justify-between text-rose-600 dark:text-rose-300 transition-colors cursor-pointer"
          >
            <span>Quit {{ activeWindow.title }}</span>
            <span class="text-[10px] opacity-60 font-mono">⌘Q</span>
          </button>
        </div>
      </div>

      <!-- Standard Menu Items -->
      <button
        v-for="option in optionsText"
        :key="option.key"
        class="hidden sm:inline-block px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
      >
        {{ option.text }}
      </button>
    </div>

    <!-- Right: Status Icons, Control Center & Clock -->
    <div class="flex items-center space-x-1 shrink-0 ml-auto">
      <div class="flex items-center space-x-1 text-slate-800/90 dark:text-white/90">
        <!-- Battery Capsule -->
        <div
          @click="toggleBatteryCharging"
          class="px-1.5 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center gap-1 text-[11px]"
          :title="`${batteryLevel}% ${isCharging ? '(Charging)' : '(Discharging)'}`"
        >
          <span class="font-mono text-[11px] opacity-90 hidden sm:inline">{{ batteryLevel }}%</span>

          <!-- Battery Icon with Centered Zap Overlay -->
          <div class="relative w-[22px] h-[11px] flex items-center justify-center">
            <svg
              width="22"
              height="11"
              viewBox="0 0 22 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-0"
            >
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
              <path
                d="M20.5 3.5C21.0523 3.5 21.5 3.94772 21.5 4.5V6.5C21.5 7.05228 21.0523 7.5 20.5 7.5V3.5Z"
                fill="currentColor"
                fill-opacity="0.6"
              />
              <rect
                x="2.25"
                y="2.25"
                :width="Math.max(1, (batteryLevel / 100) * 15.5)"
                height="6.5"
                rx="1.2"
                :class="[
                  isCharging
                    ? 'fill-emerald-500 dark:fill-emerald-400'
                    : batteryLevel <= 20
                      ? 'fill-rose-500'
                      : 'fill-slate-800 dark:fill-white',
                ]"
              />
            </svg>

            <!-- Centered Lightning Bolt Overlay -->
            <div
              v-if="isCharging"
              class="absolute inset-0 flex items-center justify-center -translate-x-[1px] pointer-events-none"
            >
              <Icon
                name="lucide:zap"
                class="w-2.5 h-2.5 text-slate-900 dark:text-slate-950 fill-slate-900 dark:fill-slate-950 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
              />
            </div>
          </div>
        </div>

        <!-- Spotlight Trigger -->
        <div
          @click.stop="toggleSpotlight"
          class="px-1.5 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          title="Spotlight Search (⌘ + Space)"
        >
          <Icon name="lucide:search" class="w-3.5 h-3.5" />
        </div>

        <!-- Network Wi-Fi Status Icon -->
        <div
          class="px-1.5 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer hidden sm:flex items-center"
          :title="isOnline ? 'Wi-Fi: Connected' : 'Wi-Fi: Disconnected'"
        >
          <Icon
            :name="isOnline ? 'lucide:wifi' : 'lucide:wifi-off'"
            class="w-4 h-4"
            :class="{ 'text-rose-500 dark:text-rose-400': !isOnline }"
          />
        </div>
      </div>

      <!-- Control Center Toggle -->
      <div class="relative">
        <button
          @click.stop="toggleMenu('controlCenter')"
          class="px-1.5 py-0.5 rounded transition-colors focus:outline-none flex items-center cursor-pointer"
          :class="activeMenu === 'controlCenter' ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'"
        >
          <Icon name="lucide:sliders-horizontal" class="w-3.5 h-3.5" />
        </button>

        <!-- Control Center Popover -->
        <div
          v-if="activeMenu === 'controlCenter'"
          class="absolute right-0 top-7 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl backdrop-saturate-180 border border-black/10 dark:border-white/15 ring-1 ring-black/5 dark:ring-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-3 text-slate-800 dark:text-slate-200 z-50 space-y-3 transform-gpu transition-colors duration-200"
          style="-webkit-backdrop-filter: blur(24px) saturate(180%);"
        >
          <div class="grid grid-cols-2 gap-2">
            <!-- Dynamic Wi-Fi Card -->
            <div class="bg-black/5 dark:bg-white/10 p-2 rounded-xl flex items-center space-x-2">
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 transition-colors"
                :class="isOnline ? 'bg-sky-500' : 'bg-slate-400 dark:bg-slate-600'"
              >
                <Icon :name="isOnline ? 'lucide:wifi' : 'lucide:wifi-off'" class="w-4 h-4" />
              </div>
              <div class="text-[11px] leading-tight min-w-0">
                <div class="font-semibold text-slate-900 dark:text-white truncate">Wi-Fi</div>
                <div class="text-slate-500 dark:text-slate-400 truncate">
                  {{ isOnline ? 'Connected' : 'Disconnected' }}
                </div>
              </div>
            </div>

            <!-- Bluetooth Card -->
            <div class="bg-black/5 dark:bg-white/10 p-2 rounded-xl flex items-center space-x-2">
              <div class="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white shrink-0">
                <Icon name="lucide:bluetooth" class="w-4 h-4" />
              </div>
              <div class="text-[11px] leading-tight min-w-0">
                <div class="font-semibold text-slate-900 dark:text-white truncate">Bluetooth</div>
                <div class="text-slate-500 dark:text-slate-400 truncate">On</div>
              </div>
            </div>
          </div>

          <!-- Isolated Theme & Locale Controls -->
          <div class="grid grid-cols-2 gap-2">
            <ThemeToggle />
            <LocaleToggle />
          </div>

          <div class="bg-black/5 dark:bg-white/10 p-2.5 rounded-xl space-y-1">
            <div class="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex justify-between">
              <span>Display</span>
              <Icon name="lucide:sun" class="w-3.5 h-3.5" />
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value="90"
              class="w-full accent-sky-500 dark:accent-sky-400 h-1 bg-black/10 dark:bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div class="bg-black/5 dark:bg-white/10 p-2.5 rounded-xl space-y-1">
            <div class="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex justify-between">
              <span>Sound</span>
              <Icon name="lucide:volume-2" class="w-3.5 h-3.5" />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value="70"
              class="w-full accent-sky-500 dark:accent-sky-400 h-1 bg-black/10 dark:bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <!-- Clock Display & Notification Center Toggle -->
      <div class="relative">
        <button
          @click.stop="toggleMenu('notificationCenter')"
          class="px-1.5 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-[12px] tabular-nums font-medium whitespace-nowrap flex items-center gap-1.5 focus:outline-none"
          :class="activeMenu === 'notificationCenter' ? 'bg-black/10 dark:bg-white/20' : ''"
        >
          <span class="hidden sm:inline">{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
        </button>

        <!-- Separate NotificationCenter Component -->
        <NotificationCenter
          :is-open="activeMenu === 'notificationCenter'"
          @close="closeMenus"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useWindowManager } from "~/composables/useWindowManager";
import ThemeToggle from "~/components/desktop/controls/ThemeToggle.vue";
import LocaleToggle from "~/components/desktop/controls/LocaleToggle.vue";
import NotificationCenter from "~/components/desktop/NotificationCenter.vue";

const { activeWindow, openWindow, closeWindow, toggleSpotlight } = useWindowManager();
const { locale, t } = useI18n();

// Reactive computed i18n strings
const aboutPortfolioText = computed(() => t("menuBar.aboutPortfolio"));
const githubProfileText = computed(() => t("menuBar.githubProfile"));
const restartDesktopText = computed(() => t("menuBar.restartDesktop"));
const optionsText = computed(() => [
  { text: t("menuBar.options.file"), key: "file" },
  { text: t("menuBar.options.edit"), key: "edit" },
  { text: t("menuBar.options.view"), key: "view" },
]);

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

// Network Online/Offline State
const isOnline = ref(true);

const handleOnline = () => { isOnline.value = true; };
const handleOffline = () => { isOnline.value = false; };

// macOS Clock & Battery Logic
const formattedDate = ref("");
const formattedTime = ref("");
let timer: ReturnType<typeof setInterval>;

const batteryLevel = ref(88);
const isCharging = ref(false);
let batteryObj: any = null;

const updateBatteryStatus = (battery: any) => {
  if (battery && typeof battery.level === "number" && !isNaN(battery.level)) {
    const realLevel = Math.round(battery.level * 100);
    if (realLevel < 100 || battery.charging === false) {
      batteryLevel.value = realLevel;
      isCharging.value = Boolean(battery.charging);
      return;
    }
  }
  batteryLevel.value = 88;
  isCharging.value = false;
};

const handleBatteryChange = () => {
  if (batteryObj) {
    updateBatteryStatus(batteryObj);
  }
};

const toggleBatteryCharging = () => {
  isCharging.value = !isCharging.value;
  if (isCharging.value) {
    batteryLevel.value = Math.min(100, batteryLevel.value + 5);
  } else {
    batteryLevel.value = Math.max(15, batteryLevel.value - 3);
  }
};

const updateTime = () => {
  const now = new Date();
  formattedDate.value = now.toLocaleDateString(locale.value, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  formattedTime.value = now.toLocaleTimeString(locale.value, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

onMounted(async () => {
  updateTime();
  timer = setInterval(updateTime, 1000);

  if (import.meta.client) {
    window.addEventListener("click", handleOutsideClick);

    isOnline.value = navigator.onLine;
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (
      "getBattery" in navigator &&
      typeof (navigator as any).getBattery === "function"
    ) {
      try {
        batteryObj = await (navigator as any).getBattery();
        if (batteryObj) {
          updateBatteryStatus(batteryObj);

          if (typeof batteryObj.addEventListener === "function") {
            batteryObj.addEventListener("levelchange", handleBatteryChange);
            batteryObj.addEventListener("chargingchange", handleBatteryChange);
          }
        }
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
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);

    if (
      batteryObj &&
      typeof batteryObj.removeEventListener === "function"
    ) {
      batteryObj.removeEventListener("levelchange", handleBatteryChange);
      batteryObj.removeEventListener("chargingchange", handleBatteryChange);
    }
  }
});
</script>
