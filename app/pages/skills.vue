<template>
  <div>
    <h1 class="font-mono text-2xl text-white mb-8">Skills</h1>

    <!-- Форма добавления -->
    <div class="border border-gray-800 p-6 bg-gray-900 mb-6">
      <p class="text-gray-500 text-xs font-mono mb-4">// add skill</p>
      <div class="flex gap-3">
        <input v-model="newSkill.name" placeholder="name"
        @keyup.enter="addSkill"
          class="bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none flex-1" />
        <select v-model="newSkill.category"
          class="bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none">
          <option value="language">language</option>
          <option value="runtime">runtime</option>
          <option value="tool">tool</option>
          <option value="os">os</option>
          <option value="other">other</option>
        </select>
        <button @click="addSkill"
          class="border border-pink-400 text-pink-400 px-4 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
          add
        </button>
      </div>
    </div>

    <!-- Список навыков -->
    <div class="border border-gray-800 bg-gray-900">
      <div v-for="skill in skills" :key="skill.id"
        class="flex justify-between items-center px-6 py-3 border-b border-gray-800 last:border-0">
        <div>
          <span class="font-mono text-white text-sm">{{ skill.name }}</span>
          <span class="ml-3 font-mono text-xs text-gray-500">{{ skill.category }}</span>
        </div>
        <button @click="deleteSkill(skill.id)"
          class="text-gray-600 hover:text-red-400 font-mono text-xs transition-colors">
          delete
        </button>
      </div>
      <div v-if="skills.length === 0" class="px-6 py-4 text-gray-500 font-mono text-sm">
        no skills yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post, del } = useApi()

const skills = ref<any[]>([])
const newSkill = ref({ name: '', category: 'language' })

const loadSkills = async () => {
  skills.value = await get('/api/skills')
}

const addSkill = async () => {
  if (!newSkill.value.name.trim()) return
  await post('/api/skills', newSkill.value)
  newSkill.value.name = ''
  await loadSkills()
}

const deleteSkill = async (id: number) => {
  await del(`/api/skills/${id}`)
  await loadSkills()
}

onMounted(loadSkills)
</script>