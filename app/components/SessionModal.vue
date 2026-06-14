<template>
  <Teleport to="body">
    <div v-if="show"
      class="fixed inset-0 bg-gray-950/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="border border-gray-800 p-8 w-full max-w-sm bg-gray-900">
        <p class="font-mono text-pink-400 text-sm mb-2">session expired</p>
        <p class="font-mono text-gray-500 text-xs mb-6">Please login to continue</p>

        <div class="flex flex-col gap-4">
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">username</label>
            <input v-model="form.username" @keyup.enter="login"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">password</label>
            <input v-model="form.password" type="password" @keyup.enter="login"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>

          <p v-if="error" class="font-mono text-xs text-red-400">{{ error }}</p>

          <button @click="login"
            class="border border-pink-400 text-pink-400 px-6 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
            {{ loading ? 'logging in...' : 'login' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { post } = useApi()

const show = ref(false)
const form = ref({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

const login = async () => {
  if (!form.value.username || !form.value.password) return
  loading.value = true
  error.value = ''

  try {
    const res = await post('/api/auth/login', form.value)
    if (res.success) {
      show.value = false
      form.value = { username: '', password: '' }
    } else {
      error.value = res.error ?? 'Invalid credentials'
    }
  } catch {
    error.value = 'Connection error'
  } finally {
    loading.value = false
  }
}

defineExpose({ show })
</script>