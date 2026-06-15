<template>
  <div>
    <h1 class="font-mono text-2xl text-white mb-8">Integrations</h1>

    <div class="grid md:grid-cols-2 gap-4">
      <!-- Spotify -->
      <div class="border border-gray-800 p-6 bg-gray-900">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">♫</span>
            <div>
              <p class="font-mono text-white text-sm">Spotify</p>
              <p class="font-mono text-xs text-gray-500">currently playing</p>
            </div>
          </div>
          <span class="font-mono text-xs px-2 py-1 border"
            :class="spotify.connected
              ? 'border-green-400/30 text-green-400'
              : 'border-yellow-400/30 text-yellow-400'">
            {{ spotify.connected ? 'connected' : 'pending approval' }}
          </span>
        </div>
        <p class="font-mono text-xs text-gray-600 mb-4">{{ spotify.message }}</p>
        <a href="http://localhost:3001/api/spotify/auth" target="_blank"
          class="border border-gray-700 text-gray-500 px-4 py-2 font-mono text-xs hover:border-pink-400 hover:text-pink-400 transition-all inline-block">
          reconnect
        </a>
      </div>

      <!-- GitHub -->
      <div class="border border-gray-800 p-6 bg-gray-900">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">◈</span>
            <div>
              <p class="font-mono text-white text-sm">GitHub</p>
              <p class="font-mono text-xs text-gray-500">repositories & stats</p>
            </div>
          </div>
          <span class="font-mono text-xs px-2 py-1 border border-green-400/30 text-green-400">
            connected
          </span>
        </div>
        <p class="font-mono text-xs text-gray-600 mb-1">{{ github.publicRepos }} public repos</p>
        <p class="font-mono text-xs text-gray-600">{{ github.followers }} followers</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()

const spotify = ref({
  connected: false,
  message: 'Extended Quota Mode approval pending from Spotify'
})

const github = ref({
  publicRepos: 0,
  followers: 0,
})

onMounted(async () => {
  const [spotifyData, githubData] = await Promise.all([
    get('/api/spotify/now-playing'),
    get('/api/github'),
  ])

  if (!spotifyData.error) {
    spotify.value.connected = true
    spotify.value.message = spotifyData.isPlaying
      ? `Now playing: ${spotifyData.title}`
      : 'Connected, nothing playing'
  }

  github.value.publicRepos = githubData.publicRepos ?? 0
  github.value.followers = githubData.followers ?? 0
})
</script>