<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex">
    <template v-if="!pending">
      <div v-if="$route.path === '/login'" class="fixed inset-0 flex items-center justify-center">
        <NuxtPage />
      </div>
      <template v-else>

        <!-- Sidebar -->
        <aside :class="[
          'border-r border-gray-800 bg-gray-900 flex flex-col transition-all duration-300',
          collapsed ? 'w-14' : 'w-56'
        ]">
          <!-- Logo -->
          <div class="flex items-center justify-between px-3 py-4 border-b border-gray-800">
            <span v-if="!collapsed" class="font-mono text-pink-400 text-sm font-bold">portfolio/admin</span>
            <button @click="collapsed = !collapsed"
              class="text-gray-600 hover:text-pink-400 transition-colors ml-auto">
              <span class="font-mono text-xs">{{ collapsed ? '→' : '←' }}</span>
            </button>
          </div>

          <!-- Nav -->
          <nav class="flex flex-col gap-1 p-2 flex-1">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
              class="flex items-center gap-3 px-2 py-2 font-mono text-sm transition-colors rounded"
              :class="$route.path === item.path
                ? 'text-pink-400 bg-pink-400/10'
                : 'text-gray-500 hover:text-white hover:bg-gray-800'">
              <span class="text-base flex-shrink-0">{{ item.icon }}</span>
              <span v-if="!collapsed">{{ item.label }}</span>
            </NuxtLink>
          </nav>

          <!-- Bottom -->
          <div class="p-2 border-t border-gray-800">
            <button @click="logout"
              class="flex items-center gap-3 px-2 py-2 font-mono text-sm text-gray-600 hover:text-red-400 transition-colors w-full rounded hover:bg-gray-800">
              <span class="flex-shrink-0">✕</span>
              <span v-if="!collapsed">logout</span>
            </button>
          </div>
        </aside>

        <!-- Main -->
        <div class="flex-1 flex flex-col min-w-0">
          <!-- Topbar -->
          <header class="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
            <p class="font-mono text-xs text-gray-600">{{ currentPageTitle }}</p>
            <div class="flex items-center gap-3">
              <span class="font-mono text-xs text-gray-600">{{ currentTime }}</span>
              <span class="w-2 h-2 rounded-full bg-green-400" title="API online"></span>
            </div>
          </header>

          <main class="flex-1 p-6 overflow-auto">
            <NuxtPage />
          </main>
        </div>

      </template>
    </template>

    <SessionModal v-if="sessionModal.show" />
  </div>
</template>

<script setup lang="ts">
const { get, post } = useApi()
const router = useRouter()
const route = useRoute()
const sessionModal = useState<{ show: boolean }>('sessionModal', () => ({ show: false }))

const pending = ref(true)
const collapsed = ref(false)

const navItems = [
  { path: '/', label: 'dashboard', icon: '⊞' },
  { path: '/profile', label: 'profile', icon: '◉' },
  { path: '/skills', label: 'skills', icon: '◈' },
  { path: '/currently', label: 'currently', icon: '◎' },
  { path: '/github', label: 'github', icon: '◆' },
  { path: '/wakatime', label: 'wakatime', icon: '◷' },
  { path: '/integrations', label: 'integrations', icon: '⊕' },
]

const currentPageTitle = computed(() => {
  return navItems.find(i => i.path === route.path)?.label ?? 'admin'
})

const currentTime = ref('')

onMounted(async () => {
  try {
    await get('/api/auth/me')
  } finally {
    pending.value = false
  }

  const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
  }
  updateTime()
  setInterval(updateTime, 1000)
})

const logout = async () => {
  await post('/api/auth/logout', {})
  await router.push('/login')
}
</script>

<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Inter', sans-serif; }
</style>