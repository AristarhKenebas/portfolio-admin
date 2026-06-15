<template>
  <div v-if="stats" class="flex flex-col gap-4">
    <!-- Today -->
    <div v-if="stats.today && settings?.showTodayTime" class="border border-gray-800 p-4 bg-gray-900">
      <p class="text-gray-500 text-xs font-mono mb-3">// today</p>
      <div class="flex items-end gap-2">
        <p class="font-mono text-3xl text-white">{{ stats.today.human }}</p>
        <p class="font-mono text-xs text-gray-600 mb-1">coding</p>
      </div>
    </div>

    <!-- Languages -->
    <div v-if="stats.languages?.length && settings?.showTopLanguages"
      class="border border-gray-800 p-4 bg-gray-900">
      <p class="text-gray-500 text-xs font-mono mb-3">// languages (7 days)</p>
      <div class="flex flex-col gap-2">
        <div v-for="lang in stats.languages" :key="lang.name">
          <div class="flex justify-between font-mono text-xs mb-1">
            <span class="text-white">{{ lang.name }}</span>
            <span class="text-gray-500">{{ lang.percent?.toFixed(1) }}%</span>
          </div>
          <div class="h-1 bg-gray-800 rounded">
            <div class="h-1 bg-pink-400 rounded transition-all duration-500"
              :style="{ width: `${lang.percent}%` }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Projects -->
    <div v-if="stats.projects?.length && settings?.showTopProjects"
      class="border border-gray-800 p-4 bg-gray-900">
      <p class="text-gray-500 text-xs font-mono mb-3">// projects</p>
      <div class="flex flex-col gap-2">
        <div v-for="project in stats.projects" :key="project.name"
          class="flex items-center justify-between">
          <span class="font-mono text-sm text-white">{{ project.name }}</span>
          <a v-if="project.url" :href="project.url" target="_blank"
            class="font-mono text-xs text-gray-600 hover:text-pink-400 transition-colors">
            github →
          </a>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="font-mono text-xs text-gray-600 p-4">
    loading...
  </div>

  <div v-else class="font-mono text-xs text-gray-600 p-4">
    no data
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  settings?: {
    showTodayTime: boolean
    showTopLanguages: boolean
    showTopProjects: boolean
  }
}>()

const { get } = useApi()
const stats = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const data = await get('/api/wakatime/stats')
  if (data.enabled !== false) {
    stats.value = data
  }
  loading.value = false
})
</script>