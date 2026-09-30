// composables/useWindowManager.ts
export const useWindowManager = () => {
  const windows = useState('windows', () => [
    {
      id: 'projects',
      title: 'Projets',
      icon: 'lucide:folder',
      component: 'ProjectsApp',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 50, y: 50 },
      size: { width: 700, height: 450 }
    },
    {
      id: 'terminal',
      title: 'Terminal',
      icon: 'lucide:terminal',
      component: 'TerminalApp',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 100, y: 150 },
      size: { width: 600, height: 400 }
    }
  ])

  const topZIndex = useState('topZIndex', () => 10)
  const activeWindowId = useState<string | null>('activeWindowId', () => null)

  const activeWindow = computed(() =>
    windows.value.find(w => w.id === activeWindowId.value) ?? null
  )

  const focusWindow = (id: string) => {
    const win = windows.value.find(w => w.id === id)
    if (win && !win.isMinimized) {
      topZIndex.value++
      win.zIndex = topZIndex.value
      activeWindowId.value = id
    }
  }

  const openWindow = (id: string) => {
    const win = windows.value.find(w => w.id === id)
    if (win) {
      win.isOpen = true
      win.isMinimized = false
      focusWindow(id)
    }
  }

  const closeWindow = (id: string) => {
    const win = windows.value.find(w => w.id === id)
    if (win) {
      win.isOpen = false
      if (activeWindowId.value === id) {
        // Shift focus to the next highest zIndex open window
        const remaining = windows.value
          .filter(w => w.isOpen && !w.isMinimized && w.id !== id)
          .sort((a, b) => b.zIndex - a.zIndex)

        activeWindowId.value = remaining[0]?.id ?? null
      }
    }
  }

  const toggleMinimize = (id: string) => {
    const win = windows.value.find(w => w.id === id)
    if (win) {
      win.isMinimized = !win.isMinimized
      if (win.isMinimized && activeWindowId.value === id) {
        activeWindowId.value = null
      } else if (!win.isMinimized) {
        focusWindow(id)
      }
    }
  }

  const toggleMaximize = (id: string) => {
    const win = windows.value.find(w => w.id === id)
    if (win) win.isMaximized = !win.isMaximized
  }

  return {
    windows,
    activeWindow,
    activeWindowId,
    openWindow,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    focusWindow
  }
}
