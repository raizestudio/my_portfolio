<!-- components/apps/ChatApp.vue -->
<template>
  <div class="relative flex h-full w-full bg-slate-900/90 text-slate-100 font-sans select-none overflow-hidden rounded-b-xl backdrop-blur-2xl">

    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="sm:hidden absolute inset-0 bg-black/60 z-20 backdrop-blur-xs transition-opacity"
    />

    <!-- Sidebar: Channels & Online Users -->
    <div
      class="absolute sm:relative inset-y-0 left-0 z-30 w-64 sm:w-60 border-r border-white/10 bg-slate-950/95 sm:bg-slate-950/40 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out"
      :class="[
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full sm:translate-x-0'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="p-3 border-b border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span class="text-xs font-semibold tracking-wide text-slate-300 uppercase">iMessage</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
            {{ onlineUsersCount }} {{ onlineText }}
          </span>
          <!-- Mobile Close Drawer Button -->
          <button
            @click="isSidebarOpen = false"
            class="sm:hidden p-1 text-slate-400 hover:text-white rounded-lg active:bg-white/10 cursor-pointer"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Channels List -->
      <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        <div class="text-[10px] font-semibold text-slate-400 uppercase px-2 py-1 tracking-wider">{{ channelsText }}</div>
        <button
          v-for="channel in channels"
          :key="channel.id"
          @click="selectChannel(channel.id)"
          class="w-full flex items-center gap-2.5 px-2.5 py-2.5 sm:py-2 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-98"
          :class="activeChannel === channel.id ? 'bg-sky-600/80 text-white shadow-md' : 'text-slate-300 hover:bg-white/5'"
        >
          <Icon :name="channel.icon" class="w-4 h-4 text-sky-300 shrink-0" />
          <span class="truncate">{{ channel.name }}</span>
        </button>

        <div class="text-[10px] font-semibold text-slate-400 uppercase px-2 py-1 mt-4 tracking-wider">Online Guests</div>
        <div v-for="user in presenceList" :key="user.id" class="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300">
            <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {{ (user.nickname || 'Guest').slice(0, 2).toUpperCase() }}
            </div>
            <span class="truncate text-slate-200">{{ user.nickname || 'Guest' }}</span>
          <span v-if="user.id === currentUserId" class="text-[9px] text-sky-400 ml-auto font-mono">({{ youText }})</span>
        </div>
      </div>

      <!-- Current User Card -->
      <div class="p-2.5 border-t border-white/10 bg-black/20 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0 flex-1">
            <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
              {{ (userNickname || 'Guest').slice(0, 2).toUpperCase() }}
            </div>
          <!-- text-[16px] sm:text-xs disables mobile zoom on click -->
          <input
            v-model="userNickname"
            @blur="updateNickname"
            @keyup.enter="updateNickname"
            type="text"
            class="bg-transparent text-[16px] sm:text-xs text-white font-medium focus:outline-none focus:bg-white/10 px-1.5 py-0.5 rounded transition-colors w-full truncate border border-transparent focus:border-white/20"
            :title="clickToChangeUsernameText"
          />
        </div>
        <button @click="generateRandomNickname" class="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer" :title="randomizeNicknameText">
          <Icon name="lucide:shuffle" class="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>

    <!-- Main Message Area -->
    <div class="flex-1 flex flex-col justify-between bg-slate-900/40 relative min-w-0">
      <!-- Chat Header -->
      <div class="h-11 px-3 sm:px-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60 backdrop-blur-md shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <!-- Mobile Sidebar Toggle Button -->
          <button
            @click="isSidebarOpen = !isSidebarOpen"
            class="sm:hidden p-1.5 -ml-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Channels"
          >
            <Icon name="lucide:panel-left" class="w-4 h-4 text-sky-400" />
          </button>

          <Icon :name="currentChannelData.icon" class="w-4 h-4 text-sky-400 shrink-0" />
          <h2 class="text-xs font-semibold text-white truncate">#{{ currentChannelData.name }}</h2>
          <span class="text-[11px] text-slate-400 hidden sm:inline truncate">— {{ currentChannelData.description }}</span>
        </div>
      </div>

      <!-- Messages Feed -->
      <div ref="messagesFeedRef" class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar touch-pan-y">
        <div v-if="filteredMessages.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
          <Icon name="lucide:messages-square" class="w-8 h-8 opacity-40 text-sky-400" />
          <!-- <p>No messages in #{{ currentChannelData.name }} yet. Say hi!</p> -->
          <p>{{ channelMessageEmptyText }}</p>
        </div>

        <div
          v-for="msg in filteredMessages"
          :key="msg.id"
          class="flex flex-col"
          :class="msg.user_id === currentUserId ? 'items-end' : 'items-start'"
        >
          <!-- Sender name & timestamp -->
          <div class="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
            <span class="font-medium text-slate-300" :class="msg.user_id === currentUserId ? 'text-sky-300' : ''">
              {{ msg.user_id === currentUserId ? youText : msg.nickname }}
            </span>
            <span>•</span>
            <span>{{ formatTime(msg.created_at) }}</span>
          </div>

          <!-- Message Bubble -->
          <div
            class="max-w-[88%] sm:max-w-[70%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed wrap-break-word shadow-md"
            :class="[
              msg.user_id === currentUserId
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-xs'
                : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-bl-xs'
            ]"
          >
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- Message Input Bar -->
      <div class="p-2.5 sm:p-3 border-t border-white/10 bg-slate-950/60 backdrop-blur-md shrink-0">
        <form @submit.prevent="sendMessage" class="flex items-center gap-2">
          <!-- text-[16px] sm:text-xs prevents iOS Safari auto-zoom on focus -->
          <input
            v-model="newMessage"
            type="text"
            :placeholder="typeMessageText"
            class="flex-1 bg-slate-800/80 border border-white/15 focus:border-sky-500/50 rounded-xl px-3.5 py-2.5 sm:py-2 text-[16px] sm:text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim()"
            class="p-2.5 sm:p-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-lg"
          >
            <Icon name="lucide:send" class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface ChatMessage {
  id: string
  channel_id: string
  user_id: string
  nickname: string
  content: string
  created_at: string
}

interface UserPresence {
  id: string
  nickname: string
}

const { t } = useI18n()

const onlineText = t('apps.chat.online')
const channelsText = t('apps.chat.channels')
const youText = t('apps.chat.you')
const clickToChangeUsernameText = t('apps.chat.clickToChangeUsername')
const randomizeNicknameText = t('apps.chat.randomizeNickname')
const channelMessageEmptyText = computed(() => t('apps.chat.channelMessageEmpty', { channel: currentChannelData.value.name }))
const typeMessageText = t('apps.chat.typeMessage')
const generalChannelTitle = t('apps.chat.chatChannels.general.name')
const generalChannelDescription = t('apps.chat.chatChannels.general.description')
const techStackChannelTitle = t('apps.chat.chatChannels.techStack.name')
const techStackChannelDescription = t('apps.chat.chatChannels.techStack.description')
const feedbackChannelTitle = t('apps.chat.chatChannels.feedback.name')
const feedbackChannelDescription = t('apps.chat.chatChannels.feedback.description')


const channels = [
  { id: 'general', name: generalChannelTitle, icon: 'lucide:hash', description: generalChannelDescription },
  { id: 'tech-stack', name: techStackChannelTitle, icon: 'lucide:code-2', description: techStackChannelDescription },
  { id: 'feedback', name: feedbackChannelTitle, icon: 'lucide:sparkles', description: feedbackChannelDescription },
]

const activeChannel = ref('general')
const isSidebarOpen = ref(false)
const newMessage = ref('')
const messages = ref<ChatMessage[]>([])
const presenceList = ref<UserPresence[]>([])
const messagesFeedRef = ref<HTMLElement | null>(null)
const justNowText = t('apps.chat.justNow')

// Current User State
const currentUserId = ref(`user_${Math.random().toString(36).substring(2, 9)}`)
const userNickname = ref('')

const currentChannelData = computed(() => {
  return channels.find(c => c.id === activeChannel.value) || channels[0]
})

const filteredMessages = computed(() => {
  return messages.value.filter(m => m.channel_id === activeChannel.value)
})

const onlineUsersCount = computed(() => presenceList.value.length || 1)

let supabase: any = null
let realtimeChannel: any = null

const selectChannel = (id: string) => {
  activeChannel.value = id
  isSidebarOpen.value = false
}

const generateRandomNickname = () => {
  const adjectives = ['Quantum', 'Neon', 'Cosmic', 'Pixel', 'Turbo', 'Cyber', 'Aura']
  const nouns = ['Coder', 'Visitor', 'Dev', 'Ninja', 'Rider', 'Architect', 'Wizard']
  const randAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randNoun = nouns[Math.floor(Math.random() * nouns.length)]
  userNickname.value = `${randAdj}${randNoun}_${Math.floor(Math.random() * 90 + 10)}`
  if (import.meta.client) {
    localStorage.setItem('chat_nickname', userNickname.value)
    updatePresence()
  }
}

const updateNickname = () => {
  if (!userNickname.value.trim()) generateRandomNickname()
  if (import.meta.client) {
    localStorage.setItem('chat_nickname', userNickname.value)
    updatePresence()
  }
}

const formatTime = (isoString: string) => {
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return justNowText
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesFeedRef.value) {
      messagesFeedRef.value.scrollTop = messagesFeedRef.value.scrollHeight
    }
  })
}

const fetchMessages = async () => {
  if (!supabase) return
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(100)

  if (!error && data) {
    messages.value = data
    scrollToBottom()
  }
}

const sendMessage = async () => {
  const content = newMessage.value.trim()
  if (!content) return

  const msgPayload = {
    channel_id: activeChannel.value,
    user_id: currentUserId.value,
    nickname: userNickname.value,
    content: content,
    created_at: new Date().toISOString()
  }

  newMessage.value = ''

  const localMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...msgPayload
  }
  messages.value.push(localMsg)
  scrollToBottom()

  if (supabase) {
    const { error } = await supabase
      .from('messages')
      .insert([msgPayload])

    if (error) {
      console.error('Error saving message to Supabase:', error.message)
    }
  }

  // 3. Broadcast real-time message to other active clients
  if (realtimeChannel) {
    await realtimeChannel.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: localMsg,
    })
  }
}

const updatePresence = () => {
  const safeNickname = userNickname.value?.trim() || 'Guest'

  if (realtimeChannel && typeof realtimeChannel.track === 'function') {
    realtimeChannel.track({
      id: currentUserId.value,
      nickname: safeNickname,
    })
  } else {
    presenceList.value = [{ id: currentUserId.value, nickname: safeNickname }]
  }
}

const initSupabaseChat = () => {
  try {
    const supabaseClient = useSupabaseClient()
    if (!supabaseClient) return false

    supabase = supabaseClient

    // Fetch existing database history on load
    fetchMessages()

    realtimeChannel = supabase.channel('global_portfolio_chat', {
      config: { presence: { key: currentUserId.value } }
    })

    realtimeChannel.on('broadcast', { event: 'chat_message' }, ({ payload }: { payload: ChatMessage }) => {
      if (payload.user_id !== currentUserId.value) {
        messages.value.push(payload)
        scrollToBottom()
      }
    })

    realtimeChannel.on('presence', { event: 'sync' }, () => {
      const state = realtimeChannel.presenceState()
      const users: UserPresence[] = []

      Object.keys(state).forEach(key => {
        const presences = state[key] as any[]
        if (presences && presences.length > 0) {
          const p = presences[0]
          users.push({
            id: p.id || key,
            nickname: p.nickname?.trim() || 'Guest'
          })
        }
      })
      presenceList.value = users
    })

    realtimeChannel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        updatePresence()
      }
    })

    return true
  } catch (err) {
    return false
  }
}

onMounted(() => {
  if (import.meta.client) {
    const savedName = localStorage.getItem('chat_nickname')
    if (savedName) {
      userNickname.value = savedName
    } else {
      generateRandomNickname()
    }

    const connected = initSupabaseChat()

    if (!connected) {
      presenceList.value = [{ id: currentUserId.value, nickname: userNickname.value }]
      messages.value = [
        {
          id: 'welcome_1',
          channel_id: 'general',
          user_id: 'system_bot',
          nickname: 'macOS Assistant',
          content: 'Welcome to the live chat!',
          created_at: new Date().toISOString()
        }
      ]
    }
  }
})

onUnmounted(() => {
  if (realtimeChannel && supabase) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
