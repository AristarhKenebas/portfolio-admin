<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">
    <template v-if="!pending">
      <NuxtPage v-if="$route.path === '/login'" />
      <template v-else>
        <nav class="border-b border-gray-800 px-6 py-4 flex items-center gap-6">
          <span class="font-mono text-pink-400 font-bold">portfolio/admin</span>
          <NuxtLink to="/" class="text-sm text-gray-400 hover:text-white transition-colors">
            Dashboard
          </NuxtLink>
          <NuxtLink to="/skills" class="text-sm text-gray-400 hover:text-white transition-colors">
            Skills
          </NuxtLink>
          <NuxtLink to="/profile" class="text-sm text-gray-400 hover:text-white transition-colors">
            Profile
          </NuxtLink>
          <NuxtLink to="/currently" class="text-sm text-gray-400 hover:text-white transition-colors">
            Currently
          </NuxtLink>
          <button @click="logout"
            class="ml-auto text-sm text-gray-600 hover:text-red-400 font-mono transition-colors">
            logout
          </button>
        </nav>
        <main class="px-6 py-8 max-w-4xl mx-auto">
          <NuxtPage />
        </main>
      </template>
    </template>

    <!-- Session Modal -->
    <SessionModal v-if="sessionModal.show" />
  </div>
</template>

<script setup lang="ts">
const { get, post } = useApi()
const router = useRouter()
const sessionModal = useState<{ show: boolean }>('sessionModal', () => ({ show: false }))

const pending = ref(true)

onMounted(async () => {
  try {
    await get('/api/auth/me')
  } finally {
    pending.value = false
  }
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