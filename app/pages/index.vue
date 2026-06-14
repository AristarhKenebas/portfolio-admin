<template>
  <div>
    <h1 class="font-mono text-2xl text-white mb-8">Dashboard</h1>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono mb-1">repos</p>
        <p class="text-2xl font-mono text-pink-400">{{ github?.publicRepos ?? '...' }}</p>
      </div>
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono mb-1">followers</p>
        <p class="text-2xl font-mono text-pink-400">{{ github?.followers ?? '...' }}</p>
      </div>
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono mb-1">skills</p>
        <p class="text-2xl font-mono text-pink-400">{{ skills?.length ?? '...' }}</p>
      </div>
      <div class="border border-gray-800 p-4 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono mb-1">status</p>
        <p class="text-sm font-mono" :class="profile?.available ? 'text-green-400' : 'text-red-400'">
          {{ profile?.available ? 'open to work' : 'not available' }}
        </p>
      </div>
    </div>

    <div class="border border-gray-800 p-6 bg-gray-900 mb-4">
      <p class="text-gray-500 text-xs font-mono mb-4">// recent repos</p>
      <div class="flex flex-col gap-3">
        <div v-for="repo in github?.repos" :key="repo.name"
          class="flex justify-between items-center text-sm">
          <a :href="repo.url" target="_blank"
            class="font-mono text-pink-400 hover:underline">
            {{ repo.name }}
          </a>
          <span class="text-gray-500 font-mono text-xs">{{ repo.language ?? 'unknown' }}</span>
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

onMounted(async () => {
  const [g, s, p] = await Promise.all([
    get('/api/github'),
    get('/api/skills'),
    get('/api/profile'),
  ])
  github.value = g
  skills.value = s
  profile.value = p
})
</script>