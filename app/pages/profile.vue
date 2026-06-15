<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">Profile</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Ліва колонка -->
      <div class="flex flex-col gap-4">
        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// identity</p>
          <div class="flex flex-col gap-4">
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">name</label>
              <input v-model="form.name"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">title</label>
              <input v-model="form.title"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">location</label>
              <input v-model="form.location"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
          </div>
        </div>

        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// status</p>
          <div class="flex items-center gap-3 mb-4">
            <input type="checkbox" v-model="form.available" id="available" class="accent-pink-400" />
            <label for="available" class="font-mono text-sm text-gray-300">open to work</label>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full"
              :class="form.available ? 'bg-green-400' : 'bg-gray-600'"></span>
            <span class="font-mono text-xs text-gray-500">
              {{ form.available ? 'visible to recruiters' : 'hidden from recruiters' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Права колонка -->
      <div class="flex flex-col gap-4">
        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// about</p>
          <div class="flex flex-col gap-4">
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">description</label>
              <textarea v-model="form.description" rows="5"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none resize-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">github username</label>
              <input v-model="form.githubUsername"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
          </div>
        </div>

        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// preview</p>
          <p class="font-mono text-white text-sm mb-1">{{ form.name || 'Your Name' }}</p>
          <p class="font-mono text-xs text-gray-500 mb-1">{{ form.title || 'Your Title' }}</p>
          <p class="font-mono text-xs text-gray-600">{{ form.location || 'Your Location' }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <button @click="saveProfile"
        class="border border-pink-400 text-pink-400 px-6 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
        {{ saved ? '✓ saved' : 'save' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post } = useApi()

const saved = ref(false)
const form = ref({
  name: '',
  title: '',
  location: '',
  description: '',
  githubUsername: '',
  available: true,
})

onMounted(async () => {
  const profile = await get('/api/profile')
  if (profile && !profile.error) {
    form.value = { ...form.value, ...profile }
  }
})

const saveProfile = async () => {
  await post('/api/profile', form.value)
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}
</script>