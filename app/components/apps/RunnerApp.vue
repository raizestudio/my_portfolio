<!-- components/apps/RunnerApp.vue -->
<template>
  <div class="h-full flex flex-col bg-slate-900 text-slate-100 font-sans select-none overflow-hidden transition-colors duration-200">
    <!-- macOS Header Toolbar -->
    <div class="h-11 px-3 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-2 shrink-0 text-xs backdrop-blur-md">
      <div class="flex items-center gap-2">
        <button
          v-if="gameState === 'playing'"
          @click="togglePause"
          class="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium px-3 py-1.5 rounded-md transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Icon :name="isPaused ? 'lucide:play' : 'lucide:pause'" class="w-4 h-4" />
          <span>{{ isPaused ? 'Reprendre' : 'Pause' }}</span>
        </button>

        <button
          v-else
          @click="startGame"
          class="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-md transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Icon name="lucide:gamepad-2" class="w-4 h-4" />
          <span>Jouer (Espace)</span>
        </button>

        <!-- Current Score, High Score & Live FPS -->
        <div class="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-md text-[11px] font-mono">
          <span>Score : <strong class="text-amber-400">{{ Math.floor(currentScore) }}</strong></span>
          <span class="text-slate-600">|</span>
          <span>Record : <strong class="text-emerald-400">{{ highScore }}</strong></span>
          <span class="text-slate-600">|</span>
          <span class="flex items-center gap-1">
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="fps >= 50 ? 'bg-emerald-400' : fps >= 30 ? 'bg-amber-400' : 'bg-rose-500'"
            ></span>
            <span class="text-slate-400">{{ fps }} FPS</span>
          </span>
        </div>
      </div>

      <!-- Leaderboard Toggle Button -->
      <button
        @click="showLeaderboard = !showLeaderboard"
        class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-slate-200 transition-colors text-[11px] cursor-pointer"
        :class="{ 'bg-amber-500/20 text-amber-300 border border-amber-500/30': showLeaderboard }"
      >
        <Icon name="lucide:trophy" class="w-3.5 h-3.5 text-amber-400" />
        <span class="hidden sm:inline">Classement</span>
      </button>
    </div>

    <!-- Main Game Canvas Container -->
    <div
      ref="containerRef"
      tabindex="0"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @touchstart.prevent="handleTouchStart"
      @touchend.prevent="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      class="flex-1 relative overflow-hidden bg-slate-950 focus:outline-none cursor-pointer"
    >
      <canvas ref="canvasRef" class="w-full h-full block"></canvas>

      <!-- Double Jump Indicator HUD -->
      <div
        v-if="gameState === 'playing' && !isPaused"
        class="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg backdrop-blur-xs text-[10px] font-mono text-slate-300 pointer-events-none"
      >
        <span>Sauts :</span>
        <div class="flex gap-1">
          <div
            v-for="i in 2"
            :key="i"
            class="w-2.5 h-2.5 rounded-full transition-all duration-150"
            :class="i <= jumpsLeft ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-slate-700/80 scale-75'"
          />
        </div>
      </div>

      <!-- Overlay: Start Screen -->
      <div
        v-if="gameState === 'menu' && !showLeaderboard"
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4"
      >
        <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl">
          <Icon name="lucide:sparkles" class="w-8 h-8 animate-bounce" />
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-extrabold text-white tracking-tight">Pixel Dev Runner</h2>
          <p class="text-xs text-slate-400 max-w-xs">Départ en douceur ! Franchis les paliers (100, 250, 500, 1000 pts) et maîtrise le double saut.</p>
        </div>
        <button
          @click.stop="startGame"
          class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <Icon name="lucide:play" class="w-4 h-4 fill-current" />
          <span>Commencer la partie</span>
        </button>
        <span class="text-[10px] text-slate-500 font-mono">Appuie sur [Espace] ou touche l'écran (x2 pour double saut)</span>
      </div>

      <!-- Overlay: Game Over -->
      <div
        v-if="gameState === 'gameover' && !showLeaderboard"
        class="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-200 z-10"
      >
        <div class="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <Icon name="lucide:skull" class="w-7 h-7" />
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-white">Game Over!</h3>
          <p class="text-xs text-slate-400">Score final : <strong class="text-amber-400 font-mono text-sm">{{ Math.floor(currentScore) }} pts</strong></p>
        </div>

        <!-- Submit Score Form -->
        <div class="w-full max-w-xs space-y-2 pt-2">
          <div class="flex items-center gap-2">
            <input
              v-model="playerName"
              type="text"
              placeholder="Ton pseudo (ex: Alex)"
              maxlength="15"
              @keydown.stop
              class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-[16px] md:text-xs"
            />
            <button
              @click.stop="submitScore"
              :disabled="isSubmitting || !playerName.trim() || isScoreSubmitted"
              class="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {{ isScoreSubmitted ? 'Envoyé !' : 'Envoyer' }}
            </button>
          </div>
        </div>

        <button
          @click.stop="startGame"
          class="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-all cursor-pointer mt-2"
        >
          Rejouer
        </button>
      </div>

      <!-- Overlay: Leaderboard Drawer -->
      <div
        v-if="showLeaderboard"
        class="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 z-20 text-xs"
      >
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center gap-2 text-amber-400 font-bold">
            <Icon name="lucide:trophy" class="w-4 h-4" />
            <span>Top 10 Global</span>
          </div>
          <button @click.stop="showLeaderboard = false" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto py-3 space-y-1.5 font-mono">
          <div v-if="isLoadingLeaderboard" class="text-center py-8 text-slate-500">
            Chargement du classement...
          </div>
          <div v-else-if="leaderboard.length === 0" class="text-center py-8 text-slate-500">
            Aucun score enregistré pour l'instant. Soyez le premier !
          </div>
          <div
            v-else
            v-for="(entry, index) in leaderboard"
            :key="entry.id || index"
            class="flex items-center justify-between p-2 rounded-lg"
            :class="index === 0 ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-slate-900 border border-slate-800 text-slate-300'"
          >
            <div class="flex items-center gap-3">
              <span class="w-5 font-bold text-center" :class="index < 3 ? 'text-amber-400' : 'text-slate-500'">#{{ index + 1 }}</span>
              <span class="font-semibold">{{ entry.player_name }}</span>
            </div>
            <span class="font-bold text-emerald-400">{{ entry.score }} pts</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface LeaderboardEntry {
  id?: string
  player_name: string
  score: number
  created_at?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
  maxLife: number
}

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const gameState = ref<'menu' | 'playing' | 'gameover'>('menu')
const isPaused = ref(false)
const currentScore = ref(0)
const highScore = ref(0)
const fps = ref(60)
const jumpsLeft = ref(2)
const playerName = ref('')
const isSubmitting = ref(false)
const isScoreSubmitted = ref(false)
const showLeaderboard = ref(false)
const isLoadingLeaderboard = ref(false)
const leaderboard = ref<LeaderboardEntry[]>([])

let animationFrameId: number | null = null
let resizeObserver: ResizeObserver | null = null
let supabase: any = null
let ctx: CanvasRenderingContext2D | null = null

// DPI & Canvas dimensions
let canvasWidth = 600
let canvasHeight = 400
let dpr = 1

// Timing & Speed variables
let lastTime = 0
const INITIAL_SPEED = 3.2
let gameSpeed = INITIAL_SPEED

// Milestones System
const MILESTONES = [100, 250, 500, 1000, 1500, 2000, 3000, 5000]
let reachedMilestones = new Set<number>()
let activeMilestoneText = ''
let milestoneTimer = 0

// Camera Shake & Parallax
let shakeIntensity = 0
let parallaxBg = 0

// Physics constants
const GRAVITY = 0.65
const FIRST_JUMP_FORCE = -12.5
const DOUBLE_JUMP_FORCE = -11.0
const MIN_JUMP_CUT = 0.45
const COYOTE_TIME = 0.12
const JUMP_BUFFER_TIME = 0.12

// Player State
const player = {
  x: 60,
  y: 0,
  width: 28,
  height: 38,
  vy: 0,
  isGrounded: false,
  coyoteTimer: 0,
  jumpBufferTimer: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'bug' | 'server' | 'drone'
  color: string
  hitboxPadding: number
}

let obstacles: Obstacle[] = []
let particles: Particle[] = []
let obstacleTimer = 0

const fetchLeaderboard = async () => {
  isLoadingLeaderboard.value = true
  if (supabase) {
    const { data, error } = await supabase
      .from('runner_leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)

    if (!error && data) {
      leaderboard.value = data
    }
  } else {
    leaderboard.value = [
      { player_name: 'DevMaster', score: 1420 },
      { player_name: 'CoffeeAddict', score: 980 },
      { player_name: 'BugHunter', score: 650 }
    ]
  }
  isLoadingLeaderboard.value = false
}

const resizeCanvas = () => {
  if (!containerRef.value || !canvasRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  dpr = window.devicePixelRatio || 1

  canvasWidth = rect.width
  canvasHeight = rect.height

  canvasRef.value.width = canvasWidth * dpr
  canvasRef.value.height = canvasHeight * dpr

  if (ctx) {
    ctx.resetTransform()
    ctx.scale(dpr, dpr)
  }

  const groundY = canvasHeight - 40
  if (player.isGrounded) {
    player.y = groundY - player.height
  }
}

const triggerShake = (intensity = 8) => {
  shakeIntensity = intensity
}

const spawnParticles = (x: number, y: number, count = 6, color = '#cbd5e1') => {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 3.5 - 0.5,
      size: Math.random() * 3.5 + 2,
      color,
      alpha: 1,
      life: 0,
      maxLife: Math.random() * 0.4 + 0.2
    })
  }
}

const triggerMilestone = (milestone: number) => {
  activeMilestoneText = `⚡ PALIER: ${milestone} PTS ! ⚡`
  milestoneTimer = 2.2
  triggerShake(6)

  // Gold celebration particle explosion across center top
  const colors = ['#f59e0b', '#fbbf24', '#38bdf8', '#34d399', '#a855f7']
  for (let i = 0; i < 30; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    spawnParticles(
      canvasWidth / 2 + (Math.random() - 0.5) * 120,
      canvasHeight / 3 + (Math.random() - 0.5) * 40,
      1,
      color
    )
  }
}

const startGame = () => {
  gameState.value = 'playing'
  isPaused.value = false
  currentScore.value = 0
  isScoreSubmitted.value = false
  gameSpeed = INITIAL_SPEED
  obstacles = []
  particles = []
  obstacleTimer = 0
  shakeIntensity = 0
  jumpsLeft.value = 2
  reachedMilestones = new Set<number>()
  milestoneTimer = 0
  activeMilestoneText = ''

  const groundY = canvasHeight - 40
  player.y = groundY - player.height
  player.vy = 0
  player.isGrounded = true
  player.coyoteTimer = 0
  player.jumpBufferTimer = 0
  player.scaleX = 1
  player.scaleY = 1

  lastTime = performance.now()
  if (!animationFrameId) {
    loop(lastTime)
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (!isPaused.value) {
    lastTime = performance.now()
  }
}

const triggerJump = () => {
  if (gameState.value !== 'playing' || isPaused.value) return
  player.jumpBufferTimer = JUMP_BUFFER_TIME
}

const executeJump = () => {
  const groundY = canvasHeight - 40

  if (player.coyoteTimer > 0 || player.isGrounded) {
    player.vy = FIRST_JUMP_FORCE
    player.isGrounded = false
    player.coyoteTimer = 0
    player.jumpBufferTimer = 0
    jumpsLeft.value = 1

    player.scaleX = 0.75
    player.scaleY = 1.35
    spawnParticles(player.x + player.width / 2, groundY, 8, '#f59e0b')
  }
  else if (jumpsLeft.value > 0) {
    player.vy = DOUBLE_JUMP_FORCE
    player.jumpBufferTimer = 0
    jumpsLeft.value = 0

    player.scaleX = 0.65
    player.scaleY = 1.45
    player.rotation = -0.4
    spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 12, '#38bdf8')
  }
}

const releaseJump = () => {
  if (gameState.value !== 'playing') return
  if (player.vy < -2) {
    player.vy *= MIN_JUMP_CUT
  }
}

const handleMouseDown = (e: MouseEvent) => {
  if (e.target === canvasRef.value) {
    if (gameState.value === 'menu' || gameState.value === 'gameover') {
      startGame()
    } else {
      triggerJump()
    }
  }
}

const handleMouseUp = () => {
  releaseJump()
}

const handleTouchStart = () => {
  if (gameState.value === 'menu' || gameState.value === 'gameover') {
    startGame()
  } else {
    triggerJump()
  }
}

const handleTouchEnd = () => {
  releaseJump()
}

const handleKeydown = (e: KeyboardEvent) => {
  e.stopPropagation()
  if (e.code === 'Space') {
    e.preventDefault()
    if (gameState.value === 'menu' || gameState.value === 'gameover') {
      startGame()
    } else {
      triggerJump()
    }
  }
}

const handleKeyup = (e: KeyboardEvent) => {
  e.stopPropagation()
  if (e.code === 'Space') {
    releaseJump()
  }
}

const spawnObstacle = () => {
  const groundY = canvasHeight - 40
  const rand = Math.random()

  let type: 'bug' | 'server' | 'drone' = 'bug'
  let width = 32
  let height = 26
  let y = groundY - height
  let color = '#f43f5e'

  if (rand < 0.45) {
    type = 'bug'
    width = 30
    height = 24
    y = groundY - height
    color = '#f43f5e'
  } else if (rand < 0.72) {
    type = 'server'
    width = 28
    height = 50
    y = groundY - height
    color = '#38bdf8'
  } else {
    type = 'drone'
    width = 34
    height = 22
    color = '#a855f7'
    const flyHeights = [65, 85, 105]
    const elevation = flyHeights[Math.floor(Math.random() * flyHeights.length)]
    y = groundY - elevation
  }

  obstacles.push({
    x: canvasWidth + 20,
    y,
    width,
    height,
    type,
    color,
    hitboxPadding: 1
  })
}

const update = (dt: number) => {
  if (gameState.value !== 'playing' || isPaused.value) return

  const currentFps = 1 / Math.max(dt, 0.001)
  fps.value = Math.round(fps.value * 0.9 + currentFps * 0.1)

  const groundY = canvasHeight - 40

  // 1. Score & Smooth Speed Progression Curve
  // Starts slowly at 3.2, ramps up naturally with a smooth power curve
  currentScore.value += dt * 10
  if (currentScore.value > highScore.value) {
    highScore.value = Math.floor(currentScore.value)
  }

  gameSpeed = INITIAL_SPEED + Math.pow(currentScore.value / 180, 0.72) * 2.2
  parallaxBg += dt * gameSpeed * 12

  // 2. Milestone Checker
  for (const m of MILESTONES) {
    if (currentScore.value >= m && !reachedMilestones.has(m)) {
      reachedMilestones.add(m)
      triggerMilestone(m)
      break
    }
  }

  if (milestoneTimer > 0) {
    milestoneTimer = Math.max(0, milestoneTimer - dt)
  }

  // 3. Timers
  if (player.isGrounded) {
    player.coyoteTimer = COYOTE_TIME
    jumpsLeft.value = 2
  } else {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - dt)
  }
  player.jumpBufferTimer = Math.max(0, player.jumpBufferTimer - dt)

  // 4. Jump Execution
  if (player.jumpBufferTimer > 0) {
    if (player.coyoteTimer > 0 || player.isGrounded || jumpsLeft.value > 0) {
      executeJump()
    }
  }

  // 5. Physics & Gravity
  player.vy += GRAVITY * (dt * 60)
  player.y += player.vy * (dt * 60)

  // Ground check
  if (player.y >= groundY - player.height) {
    if (!player.isGrounded) {
      player.scaleX = 1.3
      player.scaleY = 0.7
      spawnParticles(player.x + player.width / 2, groundY, 6, '#64748b')
    }
    player.y = groundY - player.height
    player.vy = 0
    player.isGrounded = true
    jumpsLeft.value = 2
  }

  // Decay squash & stretch
  player.scaleX += (1 - player.scaleX) * 0.18
  player.scaleY += (1 - player.scaleY) * 0.18

  // Tilt rotation
  player.rotation += ( (player.isGrounded ? 0 : Math.min(Math.max(player.vy * 0.03, -0.2), 0.3)) - player.rotation ) * 0.2

  // Running dust
  if (player.isGrounded && Math.random() < 0.35) {
    spawnParticles(player.x, groundY - 2, 1, '#475569')
  }

  // 6. Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.life += dt
    p.x += p.vx * (dt * 60)
    p.y += p.vy * (dt * 60)
    p.alpha = 1 - p.life / p.maxLife

    if (p.life >= p.maxLife) {
      particles.splice(i, 1)
    }
  }

  // 7. Obstacles Spawning & Logic
  obstacleTimer += dt
  const spawnThreshold = Math.max(0.9, 2.3 - (gameSpeed - INITIAL_SPEED) * 0.25)
  if (obstacleTimer >= spawnThreshold) {
    spawnObstacle()
    obstacleTimer = 0
  }

  // Move & Collision Check
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i]
    obs.x -= gameSpeed * (dt * 60)

    const px = player.x + 2
    const py = player.y + 2
    const pw = player.width - 4
    const ph = player.height - 4

    const ox = obs.x + obs.hitboxPadding
    const oy = obs.y + obs.hitboxPadding
    const ow = obs.width - obs.hitboxPadding * 2
    const oh = obs.height - obs.hitboxPadding * 2

    if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
      triggerShake(12)
      gameState.value = 'gameover'
      fetchLeaderboard()
      break
    }

    if (obs.x + obs.width < -30) {
      obstacles.splice(i, 1)
    }
  }

  if (shakeIntensity > 0) {
    shakeIntensity = Math.max(0, shakeIntensity - dt * 25)
  }
}

// Draw custom vector graphics for obstacles
const drawObstacle = (c: CanvasRenderingContext2D, obs: Obstacle) => {
  const { x, y, width, height, type } = obs

  c.save()

  if (type === 'bug') {
    c.fillStyle = '#f43f5e'
    c.beginPath()
    c.roundRect(x, y + 4, width, height - 4, 6)
    c.fill()

    c.fillStyle = '#9f1239'
    c.fillRect(x + 6, y + 8, width - 12, 3)
    c.fillRect(x + 4, y + 15, width - 8, 3)

    c.strokeStyle = '#fda4af'
    c.lineWidth = 2
    c.beginPath()
    c.moveTo(x + 6, y + 4)
    c.lineTo(x + 2, y - 2)
    c.moveTo(x + width - 6, y + 4)
    c.lineTo(x + width - 2, y - 2)
    c.stroke()

    c.fillStyle = '#fef08a'
    c.fillRect(x + 4, y + 10, 4, 4)
    c.fillRect(x + width - 8, y + 10, 4, 4)

    c.strokeStyle = 'rgba(244, 63, 94, 0.4)'
    c.lineWidth = 1
    c.strokeRect(x, y, width, height)
  }
  else if (type === 'server') {
    c.fillStyle = '#0f172a'
    c.strokeStyle = '#38bdf8'
    c.lineWidth = 2
    c.beginPath()
    c.roundRect(x, y, width, height, 4)
    c.fill()
    c.stroke()

    c.fillStyle = '#1e293b'
    c.fillRect(x + 4, y + 6, width - 8, 10)
    c.fillRect(x + 4, y + 20, width - 8, 10)
    c.fillRect(x + 4, y + 34, width - 8, 10)

    const blink = Math.floor(Date.now() / 300) % 2 === 0
    c.fillStyle = blink ? '#22c55e' : '#ef4444'
    c.fillRect(x + 6, y + 9, 3, 3)
    c.fillStyle = '#38bdf8'
    c.fillRect(x + 12, y + 9, 3, 3)

    c.fillStyle = '#eab308'
    c.fillRect(x + 6, y + 23, 3, 3)
    c.fillStyle = blink ? '#38bdf8' : '#22c55e'
    c.fillRect(x + 12, y + 23, 3, 3)

    c.fillStyle = '#22c55e'
    c.fillRect(x + 6, y + 37, 3, 3)
  }
  else if (type === 'drone') {
    c.fillStyle = '#06b6d4'
    c.beginPath()
    c.ellipse(x + width / 2, y + height / 2, width / 2, height / 3, 0, 0, Math.PI * 2)
    c.fill()

    c.fillStyle = '#64748b'
    c.fillRect(x - 2, y + 4, 6, 3)
    c.fillRect(x + width - 4, y + 4, 6, 3)

    c.strokeStyle = '#e2e8f0'
    c.lineWidth = 1.5
    const spin = (Date.now() / 40) % Math.PI
    c.beginPath()
    c.arc(x + 1, y + 5, 6, spin, spin + Math.PI)
    c.arc(x + width - 1, y + 5, 6, spin, spin + Math.PI)
    c.stroke()

    c.fillStyle = '#a855f7'
    c.beginPath()
    c.arc(x + width / 2, y + height / 2, 4, 0, Math.PI * 2)
    c.fill()

    c.strokeStyle = 'rgba(6, 182, 212, 0.4)'
    c.lineWidth = 1
    c.strokeRect(x, y, width, height)
  }

  c.restore()
}

const draw = () => {
  if (!ctx) return

  ctx.save()

  if (shakeIntensity > 0) {
    const dx = (Math.random() - 0.5) * shakeIntensity
    const dy = (Math.random() - 0.5) * shakeIntensity
    ctx.translate(dx, dy)
  }

  // Background
  ctx.fillStyle = '#090d16'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Parallax Grid
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1
  const gridSpacing = 40
  const offsetX = parallaxBg % gridSpacing

  for (let x = -offsetX; x < canvasWidth; x += gridSpacing) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasHeight)
    ctx.stroke()
  }

  // Ground Platform
  const groundY = canvasHeight - 40
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, groundY, canvasWidth, 40)

  // Ground Accent Line
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(canvasWidth, groundY)
  ctx.stroke()

  // Particles
  for (const p of particles) {
    ctx.fillStyle = p.color
    ctx.globalAlpha = Math.max(0, p.alpha)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Player Block
  ctx.save()
  const playerCenterX = player.x + player.width / 2
  const playerCenterY = player.y + player.height
  ctx.translate(playerCenterX, playerCenterY)
  ctx.rotate(player.rotation)
  ctx.scale(player.scaleX, player.scaleY)

  ctx.fillStyle = '#f59e0b'
  ctx.beginPath()
  ctx.roundRect(-player.width / 2, -player.height, player.width, player.height, 6)
  ctx.fill()

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(-player.width / 2 + 14, -player.height + 8, 10, 6)

  ctx.restore()

  // Draw procedural obstacles
  for (const obs of obstacles) {
    drawObstacle(ctx, obs)
  }

  // Milestone Banner Toast Overlay
  if (milestoneTimer > 0) {
    ctx.save()
    const bannerAlpha = Math.min(1, milestoneTimer)
    ctx.globalAlpha = bannerAlpha

    const bannerW = 220
    const bannerH = 32
    const bannerX = canvasWidth / 2 - bannerW / 2
    const bannerY = 48

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 8)
    ctx.fill()
    ctx.stroke()

    ctx.font = 'bold 12px sans-serif'
    ctx.fillStyle = '#fbbf24'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(activeMilestoneText, canvasWidth / 2, bannerY + bannerH / 2)

    ctx.restore()
  }

  ctx.restore()
}

const loop = (timestamp: number) => {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
  lastTime = timestamp

  update(dt)
  draw()

  if (gameState.value === 'playing') {
    animationFrameId = requestAnimationFrame(loop)
  } else {
    animationFrameId = null
  }
}

const submitScore = async () => {
  if (!playerName.value.trim() || isSubmitting.value) return
  isSubmitting.value = true

  const payload = {
    player_name: playerName.value.trim(),
    score: Math.floor(currentScore.value)
  }

  if (supabase) {
    await supabase.from('runner_leaderboard').insert([payload])
  }

  isScoreSubmitted.value = true
  isSubmitting.value = false
  showLeaderboard.value = true
  fetchLeaderboard()
}

onMounted(() => {
  if (import.meta.client) {
    try {
      supabase = useSupabaseClient()
    } catch {}

    fetchLeaderboard()

    nextTick(() => {
      if (canvasRef.value) {
        ctx = canvasRef.value.getContext('2d')
      }
      resizeCanvas()

      if (containerRef.value) {
        resizeObserver = new ResizeObserver(() => resizeCanvas())
        resizeObserver.observe(containerRef.value)
      }
    })
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>
