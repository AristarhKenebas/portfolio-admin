<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">Currently</h1>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="border border-gray-800 p-6 bg-gray-900 h-fit">
        <p class="text-gray-500 text-xs font-mono mb-4">// add entry</p>
        <div class="flex flex-col gap-3">
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">type</label>
            <select v-model="newEntry.type"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none">
              <option value="reading">reading</option>
              <option value="learning">learning</option>
              <option value="working_on">working on</option>
              <option value="listening">listening</option>
              <option value="watching">watching</option>
            </select>
          </div>
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">value</label>
            <input v-model="newEntry.value" @keyup.enter="addEntry"
              placeholder="TypeScript deep dive..."
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>
          <button @click="addEntry"
            class="border border-pink-400 text-pink-400 px-4 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
            add
          </button>
        </div>
      </div>

      <div class="border border-gray-800 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono px-4 py-3 border-b border-gray-800">
          // {{ entries.length }} entries
        </p>
        <div v-for="entry in entries" :key="entry.id"
          class="flex justify-between items-center px-4 py-3 border-b border-gray-800 last:border-0 group">
          <div class="flex items-center gap-3">
            <span class="font-mono text-pink-400 text-xs w-20 shrink-0">{{ entry.type }}</span>
            <span class="font-mono text-white text-sm">{{ entry.value }}</span>
          </div>
          <button @click="deleteEntry(entry.id)"
            class="text-gray-800 group-hover:text-red-400 font-mono text-xs transition-colors">
            ✕
          </button>
        </div>
        <div v-if="entries.length === 0" class="px-4 py-6 text-gray-600 font-mono text-xs text-center">
          no entries yet
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post, del } = useApi()
const entries = ref<any[]>([])
const newEntry = ref({ type: 'learning', value: '' })

const loadEntries = async () => { entries.value = await get('/api/currently') }
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