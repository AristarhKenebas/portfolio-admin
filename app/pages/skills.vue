<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">Skills</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Додавання -->
      <div class="border border-gray-800 p-6 bg-gray-900 h-fit">
        <p class="text-gray-500 text-xs font-mono mb-4">// add skill</p>
        <div class="flex flex-col gap-3">
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">name</label>
            <input v-model="newSkill.name" @keyup.enter="addSkill"
              placeholder="TypeScript"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">category</label>
            <select v-model="newSkill.category"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none">
              <option value="language">language</option>
              <option value="runtime">runtime</option>
              <option value="tool">tool</option>
              <option value="os">os</option>
              <option value="framework">framework</option>
              <option value="other">other</option>
            </select>
          </div>
          <button @click="addSkill"
            class="border border-pink-400 text-pink-400 px-4 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
            add
          </button>
        </div>
      </div>

      <!-- Список -->
      <div class="border border-gray-800 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono px-4 py-3 border-b border-gray-800">
          // {{ skills.length }} skills
        </p>
        <div v-for="skill in skills" :key="skill.id"
          class="flex justify-between items-center px-4 py-3 border-b border-gray-800 last:border-0 group">
          <div class="flex items-center gap-3">
            <span class="font-mono text-pink-400 text-xs w-20 shrink-0">{{ skill.category }}</span>
            <span class="font-mono text-white text-sm">{{ skill.name }}</span>
          </div>
          <button @click="deleteSkill(skill.id)"
            class="text-gray-800 group-hover:text-red-400 font-mono text-xs transition-colors">
            ✕
          </button>
        </div>
        <div v-if="skills.length === 0" class="px-4 py-6 text-gray-600 font-mono text-xs text-center">
          no skills yet
        </div>
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