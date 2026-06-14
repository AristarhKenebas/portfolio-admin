<template>
  <div>
    <h1 class="font-mono text-2xl text-white mb-8">Currently</h1>

    <div class="border border-gray-800 p-6 bg-gray-900 mb-6">
      <p class="text-gray-500 text-xs font-mono mb-4">// add entry</p>
      <div class="flex gap-3">
        <select v-model="newEntry.type"
          class="bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none">
          <option value="reading">reading</option>
          <option value="learning">learning</option>
          <option value="working_on">working on</option>
          <option value="listening">listening</option>
        </select>
        <input v-model="newEntry.value" placeholder="value"
        @keyup.enter="addEntry"
          class="bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none flex-1" />
        <button @click="addEntry"
          class="border border-pink-400 text-pink-400 px-4 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
          add
        </button>
      </div>
    </div>

    <div class="border border-gray-800 bg-gray-900">
      <div v-for="entry in entries" :key="entry.id"
        class="flex justify-between items-center px-6 py-3 border-b border-gray-800 last:border-0">
        <div>
          <span class="font-mono text-xs text-pink-400 mr-3">{{ entry.type }}</span>
          <span class="font-mono text-white text-sm">{{ entry.value }}</span>
        </div>
        <button @click="deleteEntry(entry.id)"
          class="text-gray-600 hover:text-red-400 font-mono text-xs transition-colors">
          delete
        </button>
      </div>
      <div v-if="entries.length === 0" class="px-6 py-4 text-gray-500 font-mono text-sm">
        no entries yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post, del } = useApi()

const entries = ref<any[]>([])
const newEntry = ref({ type: 'learning', value: '' })

const loadEntries = async () => {
  entries.value = await get('/api/currently')
}

const addEntry = async () => {
  if (!newEntry.value.value.trim()) return
  await post('/api/currently', newEntry.value)
  newEntry.value.value = ''
  await loadEntries()
}

const deleteEntry = async (id: number) => {
  await del(`/api/currently/${id}`)
  await loadEntries()
}

onMounted(loadEntries)
</script>