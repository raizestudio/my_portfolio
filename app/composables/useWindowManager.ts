// composables/useWindowManager.ts
export const useWindowManager = () => {
  const windows = useState("windows", () => [
    {
      id: "about",
      title: "About_Me.pdf",
      icon: "lucide:file-text",
      component: "AboutApp",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 80, y: 80 },
      size: { width: 750, height: 550 },
      iconPosition: { x: 24, y: 48 }, // Desktop Icon X/Y Position
    },
    {
      id: "projects",
      title: "Projects",
      icon: "lucide:folder",
      component: "ProjectsApp",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 120, y: 120 },
      size: { width: 700, height: 480 },
      iconPosition: { x: 24, y: 160 },
    },
    {
      id: "terminal",
      title: "Terminal",
      icon: "lucide:terminal",
      component: "TerminalApp",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 160, y: 160 },
      size: { width: 600, height: 400 },
      iconPosition: { x: 24, y: 272 },
    },
    {
      id: "contact",
      title: "Contact Mail",
      icon: "lucide:mail",
      component: "ContactApp",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 200, y: 140 },
      size: { width: 650, height: 480 },
      iconPosition: { x: 24, y: 384 },
    },
  ]);

  const topZIndex = useState("topZIndex", () => 10);
  const activeWindowId = useState<string | null>("activeWindowId", () => null);

  const activeWindow = computed(
    () => windows.value.find((w) => w.id === activeWindowId.value) ?? null,
  );

  const focusWindow = (id: string) => {
    const win = windows.value.find((w) => w.id === id);
    if (win && !win.isMinimized) {
      topZIndex.value++;
      win.zIndex = topZIndex.value;
      activeWindowId.value = id;
    }
  };

  const openWindow = (id: string) => {
    const win = windows.value.find((w) => w.id === id);
    if (win) {
      win.isOpen = true;
      win.isMinimized = false;
      focusWindow(id);
    }
  };

  const closeWindow = (id: string) => {
    const win = windows.value.find((w) => w.id === id);
    if (win) {
      win.isOpen = false;
      if (activeWindowId.value === id) {
        const remaining = windows.value
          .filter((w) => w.isOpen && !w.isMinimized && w.id !== id)
          .sort((a, b) => b.zIndex - a.zIndex);

        activeWindowId.value = remaining[0]?.id ?? null;
      }
    }
  };

  const toggleMinimize = (id: string) => {
    const win = windows.value.find((w) => w.id === id);
    if (win) {
      win.isMinimized = !win.isMinimized;
      if (win.isMinimized && activeWindowId.value === id) {
        activeWindowId.value = null;
      } else if (!win.isMinimized) {
        focusWindow(id);
      }
    }
  };

  const toggleMaximize = (id: string) => {
    const win = windows.value.find((w) => w.id === id);
    if (win) win.isMaximized = !win.isMaximized;
  };

  const isSpotlightOpen = useState("isSpotlightOpen", () => false); // NEW Spotlight State

  const openSpotlight = () => {
    isSpotlightOpen.value = true;
  };

  const closeSpotlight = () => {
    isSpotlightOpen.value = false;
  };

  const toggleSpotlight = () => {
    isSpotlightOpen.value = !isSpotlightOpen.value;
  };

  return {
    windows,
    activeWindow,
    activeWindowId,
    openWindow,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    focusWindow,
    isSpotlightOpen,
    openSpotlight,
    closeSpotlight,
    toggleSpotlight,
  };
};
