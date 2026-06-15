<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">GitHub Settings</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="border border-gray-800 p-6 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono mb-6">// display options</p>
        <div class="flex flex-col gap-4">
          <label v-for="toggle in toggles" :key="toggle.key"
            class="flex items-center justify-between cursor-pointer group">
            <div>
              <p class="font-mono text-sm text-white">{{ toggle.label }}</p>
              <p class="font-mono text-xs text-gray-600">{{ toggle.description }}</p>
            </div>
            <div @click="toggleSetting(toggle.key)"
              :class="[
                'w-10 h-5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0',
                settings[toggle.key] ? 'bg-pink-400' : 'bg-gray-700'
              ]">
              <div :class="[
                'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200',
                settings[toggle.key] ? 'left-5' : 'left-0.5'
              ]" />
            </div>
          </label>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// repos limit</p>
          <label class="font-mono text-xs text-gray-500 mb-1 block">
            show last {{ settings.reposLimit }} repos
          </label>
          <input type="range" v-model="settings.reposLimit" min="1" max="12"
            class="w-full accent-pink-400" />
          <div class="flex justify-between font-mono text-xs text-gray-600 mt-1">
            <span>1</span>
            <span>6</span>
            <span>12</span>
          </div>
        </div>

        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// preview</p>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between font-mono text-xs">
              <span class="text-gray-500">stars</span>
              <span :class="settings.showStars ? 'text-green-400' : 'text-gray-700'">
                {{ settings.showStars ? 'visible' : 'hidden' }}
              </span>
            </div>
            <div class="flex justify-between font-mono text-xs">
              <span class="text-gray-500">language</span>
              <span :class="settings.showLanguage ? 'text-green-400' : 'text-gray-700'">
                {{ settings.showLanguage ? 'visible' : 'hidden' }}
              </span>
            </div>
            <div class="flex justify-between font-mono text-xs">
              <span class="text-gray-500">forks</span>
              <span :class="settings.showForks ? 'text-green-400' : 'text-gray-700'">
                {{ settings.showForks ? 'visible' : 'hidden' }}
              </span>
            </div>
            <div class="flex justify-between font-mono text-xs">
              <span class="text-gray-500">repos shown</span>
              <span class="text-pink-400">{{ settings.reposLimit }}</span>
            </div>
          </div>
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
const settings = ref({
  showStars: true,
  showLanguage: true,
  showUpdatedAt: true,
  showForks: false,
  showDescription: true,
  reposLimit: 6,
  showContributions: true,
  showFollowers: true,
  showPublicRepos: true,
  pinnedOnly: false,
})

const toggleSetting = (key: SettingsKey) => {
  if (typeof settings.value[key] === 'boolean') {
    (settings.value[key] as boolean) = !settings.value[key]
  }
}

type SettingsKey = keyof typeof settings.value

const toggles: { key: SettingsKey; label: string; description: string }[] = [
  { key: 'showStars', label: 'Stars', description: 'Show star count on repos' },
  { key: 'showLanguage', label: 'Language', description: 'Show primary language' },
  { key: 'showForks', label: 'Forks', description: 'Show fork count' },
  { key: 'showDescription', label: 'Description', description: 'Show repo description' },
  { key: 'showUpdatedAt', label: 'Last updated', description: 'Show last update date' },
  { key: 'showFollowers', label: 'Followers', description: 'Show follower count' },
  { key: 'showPublicRepos', label: 'Public repos', description: 'Show total repo count' },
  { key: 'showContributions', label: 'Contributions', description: 'Show contribution graph' },
]

onMounted(async () => {
  const data = await get('/api/github-settings')
  if (data && !data.error) {
    settings.value = { ...settings.value, ...data }
  }
})

const save = async () => {
  await patch('/api/github-settings', settings.value)
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}
</script>