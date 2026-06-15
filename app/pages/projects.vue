<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">Projects</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="border border-gray-800 p-6 bg-gray-900 h-fit">
        <p class="text-gray-500 text-xs font-mono mb-4">// add project</p>
        <div class="flex flex-col gap-3">
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">name</label>
            <input v-model="newProject.name" @keyup.enter="addProject"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">description</label>
            <textarea v-model="newProject.description" rows="3"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none resize-none" />
          </div>
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">url</label>
            <input v-model="newProject.url"
              placeholder="https://github.com/..."
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>
          <div>
            <label class="font-mono text-xs text-gray-500 mb-1 block">tags (comma separated)</label>
            <input v-model="tagsInput"
              placeholder="TypeScript, Bun, Hono"
              class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
          </div>
          <button @click="addProject"
            class="border border-pink-400 text-pink-400 px-4 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
            add
          </button>
        </div>
      </div>

      <div class="border border-gray-800 bg-gray-900">
        <p class="text-gray-500 text-xs font-mono px-4 py-3 border-b border-gray-800">
          // {{ projects.length }} projects
        </p>
        <div v-for="project in projects" :key="project.id"
          class="px-4 py-3 border-b border-gray-800 last:border-0 group">
          <div class="flex justify-between items-start">
            <div class="flex-1 min-w-0 mr-3">
              <p class="font-mono text-white text-sm mb-1">{{ project.name }}</p>
              <p class="font-mono text-xs text-gray-600 mb-2 truncate">{{ project.description }}</p>
              <div class="flex gap-1 flex-wrap">
                <span v-for="tag in project.tags" :key="tag"
                  class="font-mono text-xs text-pink-400 border border-pink-400/20 px-1">
                  {{ tag }}
                </span>
              </div>
            </div>
            <button @click="deleteProject(project.id)"
              class="text-gray-800 group-hover:text-red-400 font-mono text-xs transition-colors flex-shrink-0">
              ✕
            </button>
          </div>
        </div>
        <div v-if="projects.length === 0" class="px-4 py-6 text-gray-600 font-mono text-xs text-center">
          no projects yet
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post, del } = useApi()

const projects = ref<any[]>([])
const tagsInput = ref('')
const newProject = ref({ name: '', description: '', url: '', tags: [] as string[] })

const loadProjects = async () => {
  projects.value = await get('/api/projects')
}

const addProject = async () => {
  if (!newProject.value.name.trim()) return
  newProject.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  await post('/api/projects', newProject.value)
  newProject.value = { name: '', description: '', url: '', tags: [] }
  tagsInput.value = ''
  await loadProjects()
}

const deleteProject = async (id: number) => {
  await del(`/api/projects/${id}`)
  await loadProjects()
}

onMounted(loadProjects)
</script>