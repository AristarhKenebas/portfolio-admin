<template>
  <div class="flex flex-col xl:flex-row gap-8 items-start w-full">
    
    <div class="flex-1 w-full max-w-4xl">
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h1 class="font-mono text-2xl text-white">Projects</h1>
          <button @click="importFromGithub"
            class="border border-gray-700 text-gray-400 px-4 py-2 font-mono text-xs hover:border-pink-400 hover:text-pink-400 transition-all">
            import from github
          </button>
        </div>
        <p class="font-mono text-xs text-gray-600">
          // manage your portfolio projects and sync external data
        </p>
      </div>

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
              <input v-model="newProject.url" placeholder="https://github.com/..."
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">tags (comma separated)</label>
              <input v-model="tagsInput" placeholder="TypeScript, Bun, Hono"
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
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-mono text-white text-sm">{{ project.name }}</p>
                  <span class="font-mono text-xs px-1 border"
                    :class="project.featured ? 'border-green-400/30 text-green-400' : 'border-gray-700 text-gray-600'">
                    {{ project.featured ? 'shown' : 'hidden' }}
                  </span>
                </div>
                <p class="font-mono text-xs text-gray-600 mb-2">{{ project.description }}</p>
                <div class="flex gap-1 flex-wrap">
                  <span v-for="tag in project.tags" :key="tag"
                    class="font-mono text-xs text-pink-400 border border-pink-400/20 px-1">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 flex-shrink-0">
                <button @click="toggleFeatured(project)"
                  class="text-gray-600 hover:text-green-400 font-mono text-xs transition-colors">
                  {{ project.featured ? 'hide' : 'show' }}
                </button>
                <button @click="startEdit(project)"
                  class="text-gray-600 hover:text-pink-400 font-mono text-xs transition-colors">
                  edit
                </button>
                <button @click="deleteProject(project.id)"
                  class="text-gray-800 group-hover:text-red-400 font-mono text-xs transition-colors">
                  ✕
                </button>
              </div>
            </div>
          </div>
          <div v-if="projects.length === 0" class="px-4 py-6 text-gray-600 font-mono text-xs text-center">
            no projects yet
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-xl xl:w-[450px] flex-shrink-0">
      <h2 class="font-mono text-lg text-gray-400 mb-1">Project Cards Display</h2>
      <p class="font-mono text-xs text-gray-600/70 mb-8">
        // controls what metadata is shown on project cards on the public site
      </p>

      <div class="border border-gray-800 p-6 bg-gray-900">
        <div class="flex flex-col gap-4">
          <label v-for="toggle in toggles" :key="toggle.key"
            class="flex items-center justify-between cursor-pointer">
            <div>
              <p class="font-mono text-sm text-white">{{ toggle.label }}</p>
              <p class="font-mono text-xs text-gray-600">{{ toggle.description }}</p>
            </div>
            <div @click.prevent="settings[toggle.key] = !settings[toggle.key]"
              :class="['w-10 h-5 rounded-full transition-all duration-200 relative cursor-pointer flex-shrink-0',
                settings[toggle.key] ? 'bg-pink-400' : 'bg-gray-700']">
              <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200',
                settings[toggle.key] ? 'left-5' : 'left-0.5']" />
            </div>
          </label>
        </div>

        <button @click="saveSettings"
          class="border border-pink-400 text-pink-400 px-6 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all mt-6 w-full sm:w-auto">
          {{ saved ? '✓ saved' : 'save' }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="editingProject" class="fixed inset-0 bg-gray-950/90 z-50 flex items-center justify-center p-6">
    <div class="border border-gray-800 p-6 bg-gray-900 w-full max-w-md">
      <p class="text-gray-500 text-xs font-mono mb-4">// edit project</p>
      <div class="flex flex-col gap-3">
        <div>
          <label class="font-mono text-xs text-gray-500 mb-1 block">name</label>
          <input v-model="editingProject.name" class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
        </div>
        <div>
          <label class="font-mono text-xs text-gray-500 mb-1 block">description</label>
          <textarea v-model="editingProject.description" rows="3" class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none resize-none" />
        </div>
        <div>
          <label class="font-mono text-xs text-gray-500 mb-1 block">url</label>
          <input v-model="editingProject.url" class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
        </div>
        <div>
          <label class="font-mono text-xs text-gray-500 mb-1 block">tags</label>
          <input v-model="editTagsInput" class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
        </div>
        <div class="flex gap-3 mt-2">
          <button @click="saveEdit" class="border border-pink-400 text-pink-400 px-4 py-2 font-mono text-xs hover:bg-pink-400 hover:text-gray-950 transition-all flex-1">save</button>
          <button @click="editingProject = null" class="border border-gray-700 text-gray-500 px-4 py-2 font-mono text-xs hover:border-gray-500 transition-all">cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Используем useApi один раз для всех запросов
const { get, post, patch, del } = useApi()

// === ЛОГИКА ПРОЕКТОВ ===
const projects = ref<any[]>([])
const tagsInput = ref('')
const newProject = ref({ name: '', description: '', url: '', tags: [] as string[] })
const editingProject = ref<any>(null)
const editTagsInput = ref('')

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

const importFromGithub = async () => {
  const [github, existing] = await Promise.all([
    get('/api/github/raw-repos'),
    get('/api/projects'),
  ])
  if (!github?.repos) return
  const existingNames = new Set(existing.map((p: any) => p.name))
  for (const repo of github.repos) {
    if (existingNames.has(repo.name)) continue
    await post('/api/projects', {
      name: repo.name,
      description: repo.description,
      url: repo.url,
      tags: repo.language ? [repo.language] : [],
      featured: true,
      stars: repo.stars,
      forks: repo.forks,
      language: repo.language,
      repoUpdatedAt: repo.repoUpdatedAt,
    })
  }
  await loadProjects()
}

const toggleFeatured = async (project: any) => {
  await patch(`/api/projects/${project.id}`, { featured: !project.featured })
  await loadProjects()
}

const startEdit = (project: any) => {
  editingProject.value = { ...project }
  editTagsInput.value = project.tags?.join(', ') ?? ''
}

const saveEdit = async () => {
  if (!editingProject.value) return
  editingProject.value.tags = editTagsInput.value.split(',').map((t: string) => t.trim()).filter(Boolean)
  await patch(`/api/projects/${editingProject.value.id}`, editingProject.value)
  editingProject.value = null
  await loadProjects()
}

// === ЛОГИКА НАСТРОЕК (SETTINGS) ===
const saved = ref(false)
const settings = ref({
  showStars: true,
  showForks: true,
  showLanguage: true,
  showUpdatedAt: true,
})

type SettingsKey = keyof typeof settings.value

const toggles: { key: SettingsKey; label: string; description: string }[] = [
  { key: 'showStars', label: 'Stars', description: 'Show ★ star count on project cards (from GitHub at import time)' },
  { key: 'showForks', label: 'Forks', description: 'Show ⑂ fork count on project cards' },
  { key: 'showLanguage', label: 'Language', description: 'Show primary language dot + name on project cards' },
  { key: 'showUpdatedAt', label: 'Last updated', description: 'Show "X days ago" on project cards' },
]

// Переименовали функцию в saveSettings для ясности
const saveSettings = async () => {
  await patch('/api/project-settings', settings.value)
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
onMounted(async () => {
  // Запускаем загрузку проектов
  loadProjects()
  
  // Запускаем загрузку настроек
  const data = await get('/api/project-settings')
  if (data && !data.error) {
    settings.value = { ...settings.value, ...data }
  }
})
</script>