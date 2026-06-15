<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">WakaTime / Wakapi</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="border border-gray-800 p-6 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono mb-6">// configuration</p>
        <div class="flex flex-col gap-4">
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">provider</label>
            <select v-model="settings.provider"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none">
              <option value="wakatime">WakaTime (cloud)</option>
              <option value="wakapi">Wakapi (self-hosted)</option>
              <option value="hakatime">Hakatime (self-hosted)</option>
            </select>
          </div>

          <div v-if="settings.provider !== 'wakatime'">
            <label class="font-mono text-xs text-gray-500 mb-1 block">api url</label>
            <input v-model="settings.apiUrl"
              placeholder="https://your-wakapi-instance.com/api/v1"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>

          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">api key</label>
            <input v-model="settings.apiKey" type="password"
              placeholder="your-api-key"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>

          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <p class="font-mono text-sm text-white">enabled</p>
              <p class="font-mono text-xs text-gray-600">show coding stats on portfolio</p>
            </div>
            <div @click="settings.enabled = !settings.enabled"
              :class="['w-10 h-5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0',
                settings.enabled ? 'bg-pink-400' : 'bg-gray-700']">
              <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200',
                settings.enabled ? 'left-5' : 'left-0.5']" />
            </div>
          </label>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// display options</p>
          <div class="flex flex-col gap-4">
            <label class="flex items-center justify-between cursor-pointer">
              <p class="font-mono text-sm text-white">today coding time</p>
              <div @click="settings.showTodayTime = !settings.showTodayTime"
                :class="['w-10 h-5 rounded-full transition-all relative cursor-pointer flex-shrink-0',
                  settings.showTodayTime ? 'bg-pink-400' : 'bg-gray-700']">
                <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                  settings.showTodayTime ? 'left-5' : 'left-0.5']" />
              </div>
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <p class="font-mono text-sm text-white">top languages</p>
              <div @click="settings.showTopLanguages = !settings.showTopLanguages"
                :class="['w-10 h-5 rounded-full transition-all relative cursor-pointer flex-shrink-0',
                  settings.showTopLanguages ? 'bg-pink-400' : 'bg-gray-700']">
                <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                  settings.showTopLanguages ? 'left-5' : 'left-0.5']" />
              </div>
            </label>
            <label class="flex items-center justify-between cursor-pointer">
              <p class="font-mono text-sm text-white">top projects</p>
              <div @click="settings.showTopProjects = !settings.showTopProjects"
                :class="['w-10 h-5 rounded-full transition-all relative cursor-pointer flex-shrink-0',
                  settings.showTopProjects ? 'bg-pink-400' : 'bg-gray-700']">
                <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                  settings.showTopProjects ? 'left-5' : 'left-0.5']" />
              </div>
            </label>
          </div>
        </div>

        <div class="border border-gray-800 bg-gray-900 mt-4">
          <p class="text-gray-500 text-xs font-mono px-4 py-3 border-b border-gray-800">// preview</p>
          <div class="p-4">
            <WakaStats :settings="settings" />
          </div>
        </div>
        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// test connection</p>
          <button @click="testConnection"
            class="border border-gray-700 text-gray-400 px-4 py-2 font-mono text-xs hover:border-pink-400 hover:text-pink-400 transition-all w-full mb-3">
            test
          </button>
          <p v-if="testResult" :class="['font-mono text-xs', testResult.ok ? 'text-green-400' : 'text-red-400']">
            {{ testResult.message }}
          </p>
        </div>

        <button @click="save"
          class="border border-pink-400 text-pink-400 px-6 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
          {{ saved ? '✓ saved' : 'save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, patch } = useApi()

const saved = ref(false)
const testResult = ref<{ ok: boolean; message: string } | null>(null)

const settings = ref({
  provider: 'wakatime',
  apiKey: '',
  apiUrl: 'https://wakatime.com/api/v1',
  enabled: false,
  showTodayTime: true,
  showTopLanguages: true,
  showTopProjects: true,
  languagesLimit: 5,
  projectsLimit: 5,
})

onMounted(async () => {
  const data = await get('/api/wakatime/settings')
  if (data && !data.error) {
    settings.value = { ...settings.value, ...data }
  }
})

const testConnection = async () => {
  testResult.value = null
  const data = await get('/api/wakatime/stats')
  if (data.enabled === false) {
    testResult.value = { ok: false, message: 'not enabled or no api key' }
  } else if (data.today) {
    testResult.value = { ok: true, message: `connected — today: ${data.today.human}` }
  } else {
    testResult.value = { ok: false, message: 'connection failed' }
  }
}

const save = async () => {
  await patch('/api/wakatime/settings', settings.value)
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}
</script>