<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">Dashboard</h1>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-600 text-xs font-mono mb-2">repos</p>
        <p class="text-3xl font-mono text-white">{{ github?.publicRepos ?? '—' }}</p>
      </div>
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-600 text-xs font-mono mb-2">followers</p>
        <p class="text-3xl font-mono text-white">{{ github?.followers ?? '—' }}</p>
      </div>
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-600 text-xs font-mono mb-2">skills</p>
        <p class="text-3xl font-mono text-white">{{ skills?.length ?? '—' }}</p>
      </div>
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-600 text-xs font-mono mb-2">status</p>
        <p class="text-sm font-mono mt-1" :class="profile?.available ? 'text-green-400' : 'text-gray-600'">
          {{ profile?.available ? 'open to work' : 'not available' }}
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="border border-gray-800 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono px-4 py-3 border-b border-gray-800">// recent repos</p>
        <div v-for="repo in github?.repos" :key="repo.name"
          class="flex justify-between items-center px-4 py-3 border-b border-gray-800 last:border-0">
          <a :href="repo.url" target="_blank"
            class="font-mono text-pink-400 text-sm hover:underline">{{ repo.name }}</a>
          <span class="font-mono text-xs text-gray-600">{{ repo.language ?? '—' }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="border border-gray-800 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono px-4 py-3 border-b border-gray-800">// currently</p>
          <div v-for="entry in currently" :key="entry.id"
            class="flex items-center gap-3 px-4 py-3 border-b border-gray-800 last:border-0">
            <span class="font-mono text-pink-400 text-xs w-20 shrink-0">{{ entry.type }}</span>
            <span class="font-mono text-white text-xs">{{ entry.value }}</span>
          </div>
          <div v-if="currently.length === 0" class="px-4 py-4 text-gray-600 font-mono text-xs">
            no entries
          </div>
        </div>

        <div class="border border-gray-800 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono px-4 py-3 border-b border-gray-800">// coding today</p>
          <div class="p-4">
            <WakaStats :settings="wakaSettings" />
          </div>
        </div>

        <div class="border border-gray-800 p-4 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-3">// profile</p>
          <p class="font-mono text-white text-sm">{{ profile?.name ?? '—' }}</p>
          <p class="font-mono text-xs text-gray-500 mt-1">{{ profile?.title ?? '—' }}</p>
          <p class="font-mono text-xs text-gray-600 mt-1">{{ profile?.location ?? '—' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const github = ref<any>(null)
const skills = ref<any[]>([])
const profile = ref<any>(null)
const currently = ref<any[]>([])
const wakaSettings = ref<any>(null)

onMounted(async () => {
  const [g, s, p, c, w] = await Promise.all([
    get('/api/github'),
    get('/api/skills'),
    get('/api/profile'),
    get('/api/currently'),
    get('/api/wakatime/settings'),
  ])
  github.value = g
  skills.value = s
  profile.value = p
  currently.value = c
  wakaSettings.value = w
})
</script>