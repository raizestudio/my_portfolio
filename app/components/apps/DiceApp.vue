<!-- components/apps/DiceApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans select-none overflow-hidden transition-colors duration-200">
    <!-- Toolbar macOS -->
    <div class="h-11 px-3 bg-white/80 dark:bg-slate-900/80 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-2 shrink-0 text-xs backdrop-blur-md">
      <div class="flex items-center gap-2">
        <!-- Bouton Lancer -->
        <button
          @click="rollDice"
          :disabled="isRolling"
          class="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-3 py-1.5 rounded-md transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Icon name="lucide:dices" class="w-4 h-4" :class="{ 'animate-spin': isRolling }" />
          <span>{{ isRolling ? 'Lancement...' : 'Lancer (Espace)' }}</span>
        </button>

        <!-- Sélecteur de nombre de dés -->
        <div class="flex items-center gap-1.5 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md text-[11px] font-mono">
          <span class="text-slate-500 dark:text-slate-400">Dés :</span>
          <button
            v-for="num in [1, 2, 3, 4]"
            :key="num"
            @click="setDiceCount(num)"
            :disabled="isRolling"
            class="w-5 h-5 rounded flex items-center justify-center font-bold transition-colors cursor-pointer"
            :class="diceCount === num ? 'bg-indigo-600 text-white' : 'hover:bg-black/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300'"
          >
            {{ num }}
          </button>
        </div>
      </div>

      <!-- Action Réinitialiser les stats -->
      <button
        @click="resetHistory"
        class="flex items-center gap-1 px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-[11px] cursor-pointer"
        title="Réinitialiser l'historique"
      >
        <Icon name="lucide:rotate-ccw" class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Effacer</span>
      </button>
    </div>

    <!-- Zone principale 3D & Résultat -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-transparent to-black/5 dark:to-black/20">

      <!-- Affichage du Score Total -->
      <div class="text-center mb-6 transition-all duration-300 transform" :class="{ 'scale-110': isRolling }">
        <div class="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Total obtenu
        </div>
        <div class="text-5xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 drop-shadow-md">
          {{ isRolling ? '?' : currentTotal }}
        </div>
      </div>

      <!-- Tapis de tirage (Scène 3D) -->
      <div
        tabindex="0"
        @keydown.space.prevent="rollDice"
        class="flex flex-wrap items-center justify-center gap-8 sm:gap-12 min-h-[160px] p-4 focus:outline-none"
      >
        <div
          v-for="(die, index) in dice"
          :key="index"
          class="dice-scene relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer"
          @click="rollDice"
        >
          <div
            class="dice-cube w-full h-full relative"
            :style="{ transform: die.transform }"
          >
            <!-- Face 1 -->
            <div class="dice-face face-1">
              <span class="pip"></span>
            </div>
            <!-- Face 2 -->
            <div class="dice-face face-2">
              <span class="pip"></span><span class="pip"></span>
            </div>
            <!-- Face 3 -->
            <div class="dice-face face-3">
              <span class="pip"></span><span class="pip"></span><span class="pip"></span>
            </div>
            <!-- Face 4 -->
            <div class="dice-face face-4">
              <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span>
            </div>
            <!-- Face 5 -->
            <div class="dice-face face-5">
              <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span>
            </div>
            <!-- Face 6 -->
            <div class="dice-face face-6">
              <span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span><span class="pip"></span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Historique du bas -->
    <div class="h-28 bg-white/90 dark:bg-slate-900/90 border-t border-black/10 dark:border-white/10 p-3 flex flex-col justify-between shrink-0 font-mono text-xs">
      <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pb-1.5 border-b border-black/5 dark:border-white/5">
        <span class="font-semibold uppercase tracking-wider">Historique & Stats</span>
        <div class="flex gap-3 text-[10px]">
          <span>Moyenne : <strong class="text-slate-700 dark:text-slate-200">{{ averageScore }}</strong></span>
          <span>Tirages : <strong class="text-slate-700 dark:text-slate-200">{{ history.length }}</strong></span>
        </div>
      </div>

      <!-- Feed des derniers tirages -->
      <div v-if="history.length > 0" class="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
        <div
          v-for="(item, idx) in history"
          :key="idx"
          class="shrink-0 bg-slate-100 dark:bg-slate-800/80 border border-black/5 dark:border-white/10 px-2.5 py-1 rounded-lg text-center leading-tight space-y-0.5"
        >
          <div class="text-[10px] text-slate-400">{{ item.time }}</div>
          <div class="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
            {{ item.total }}
          </div>
          <div class="text-[9px] text-slate-500 dark:text-slate-400">
            [{{ item.values.join(', ') }}]
          </div>
        </div>
      </div>

      <div v-else class="text-center py-2 text-slate-400 text-[11px]">
        Cliquez sur les dés ou appuyez sur [Espace] pour lancer.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface DieState {
  value: number
  transform: string
}

interface HistoryItem {
  time: string
  values: number[]
  total: number
}

const diceCount = ref(2)
const isRolling = ref(false)
const history = ref<HistoryItem[]>([])

const faceRotations: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 180, y: 0 }
}

const dice = ref<DieState[]>([])

const currentTotal = computed(() => {
  return dice.value.reduce((sum, d) => sum + d.value, 0)
})

const averageScore = computed(() => {
  if (history.value.length === 0) return '0.0'
  const totalSum = history.value.reduce((acc, h) => acc + h.total, 0)
  return (totalSum / history.value.length).toFixed(1)
})

const initDice = (count: number) => {
  const newDice: DieState[] = []
  for (let i = 0; i < count; i++) {
    const val = Math.floor(Math.random() * 6) + 1
    const rot = faceRotations[val]
    newDice.push({
      value: val,
      transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`
    })
  }
  dice.value = newDice
}

const setDiceCount = (count: number) => {
  if (isRolling.value) return
  diceCount.value = count
  initDice(count)
}

const rollDice = () => {
  if (isRolling.value) return

  isRolling.value = true

  const newValues: number[] = []

  dice.value = dice.value.map((d) => {
    const nextVal = Math.floor(Math.random() * 6) + 1
    newValues.push(nextVal)

    const extraRotX = (Math.floor(Math.random() * 3) + 3) * 360
    const extraRotY = (Math.floor(Math.random() * 3) + 3) * 360

    const targetRot = faceRotations[nextVal]

    return {
      value: nextVal,
      transform: `rotateX(${targetRot.x + extraRotX}deg) rotateY(${targetRot.y + extraRotY}deg)`
    }
  })

  setTimeout(() => {
    isRolling.value = false

    const now = new Date()
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const total = newValues.reduce((a, b) => a + b, 0)

    history.value.unshift({
      time: timeStr,
      values: newValues,
      total
    })

    if (history.value.length > 20) history.value.pop()
  }, 750)
}

const resetHistory = () => {
  history.value = []
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.code === 'Space') {
    e.preventDefault()
    rollDice()
  }
}

onMounted(() => {
  initDice(diceCount.value)
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* Perspective 3D du conteneur */
.dice-scene {
  perspective: 600px;
}

/* Cube 3D */
.dice-cube {
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.3, 1);
}

/* Style de chaque face du dé avec Grille 3x3 */
.dice-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #ffffff, #f1f5f9);
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 18px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.08), 0 10px 25px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 10px;
  box-sizing: border-box;
}

.dark .dice-face {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 0.5);
}

/* Points du dé (Pips) */
.pip {
  width: 11px;
  height: 11px;
  background-color: #0f172a;
  border-radius: 50%;
  place-self: center;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.6);
}

.dark .pip {
  background-color: #f8fafc;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

/* Placement 3D des 6 faces */
.face-1 { transform: rotateY(0deg) translateZ(40px); }
.face-2 { transform: rotateX(90deg) translateZ(40px); }
.face-3 { transform: rotateY(90deg) translateZ(40px); }
.face-4 { transform: rotateY(-90deg) translateZ(40px); }
.face-5 { transform: rotateX(-90deg) translateZ(40px); }
.face-6 { transform: rotateY(180deg) translateZ(40px); }

@media (min-width: 640px) {
  .face-1 { transform: rotateY(0deg) translateZ(48px); }
  .face-2 { transform: rotateX(90deg) translateZ(48px); }
  .face-3 { transform: rotateY(90deg) translateZ(48px); }
  .face-4 { transform: rotateY(-90deg) translateZ(48px); }
  .face-5 { transform: rotateX(-90deg) translateZ(48px); }
  .face-6 { transform: rotateY(180deg) translateZ(48px); }

  .pip {
    width: 13px;
    height: 13px;
  }
}

/* Positionnement strict sur grille 3x3 pour un alignement parfait */
.face-1 .pip:nth-child(1) { grid-area: 2 / 2; }

.face-2 .pip:nth-child(1) { grid-area: 1 / 1; }
.face-2 .pip:nth-child(2) { grid-area: 3 / 3; }

.face-3 .pip:nth-child(1) { grid-area: 1 / 1; }
.face-3 .pip:nth-child(2) { grid-area: 2 / 2; }
.face-3 .pip:nth-child(3) { grid-area: 3 / 3; }

.face-4 .pip:nth-child(1) { grid-area: 1 / 1; }
.face-4 .pip:nth-child(2) { grid-area: 1 / 3; }
.face-4 .pip:nth-child(3) { grid-area: 3 / 1; }
.face-4 .pip:nth-child(4) { grid-area: 3 / 3; }

.face-5 .pip:nth-child(1) { grid-area: 1 / 1; }
.face-5 .pip:nth-child(2) { grid-area: 1 / 3; }
.face-5 .pip:nth-child(3) { grid-area: 2 / 2; }
.face-5 .pip:nth-child(4) { grid-area: 3 / 1; }
.face-5 .pip:nth-child(5) { grid-area: 3 / 3; }

.face-6 .pip:nth-child(1) { grid-area: 1 / 1; }
.face-6 .pip:nth-child(2) { grid-area: 1 / 3; }
.face-6 .pip:nth-child(3) { grid-area: 2 / 1; }
.face-6 .pip:nth-child(4) { grid-area: 2 / 3; }
.face-6 .pip:nth-child(5) { grid-area: 3 / 1; }
.face-6 .pip:nth-child(6) { grid-area: 3 / 3; }

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.2);
  border-radius: 9999px;
}
</style>
