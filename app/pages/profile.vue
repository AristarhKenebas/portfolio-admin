<template>
  <div class="max-w-4xl">
    <h1 class="font-mono text-2xl text-white mb-8">Profile</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-4">
        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// identity</p>
          <div class="flex flex-col gap-4">
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">name</label>
              <input v-model="form.name"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">title</label>
              <input v-model="form.title"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">location</label>
              <input v-model="form.location"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
          </div>
        </div>

        <div class="border border-gray-800 p-6 bg-gray-900 mb-4">
          <p class="text-gray-500 text-xs font-mono mb-4">// avatar</p>
          
          <div class="flex items-center gap-4 mb-4">
            <div class="w-20 h-20 border border-gray-700 overflow-hidden flex-shrink-0">
              <img v-if="avatarUrl" :src="avatarUrl" alt="avatar"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
                <span class="font-mono text-xs text-gray-600">no photo</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="border border-gray-700 text-gray-400 px-4 py-2 font-mono text-xs hover:border-pink-400 hover:text-pink-400 transition-all cursor-pointer">
                upload photo
                <input type="file" accept="image/jpeg,image/png,image/webp"
                  class="hidden" @change="handleFileSelect" />
              </label>
              <p class="font-mono text-xs text-gray-600">JPEG, PNG or WebP · max 5MB</p>
            </div>
          </div>

          <p v-if="uploadError" class="font-mono text-xs text-red-400">{{ uploadError }}</p>
          <p v-if="uploadSuccess" class="font-mono text-xs text-green-400">✓ avatar updated</p>
        </div>

        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// status</p>
          <div class="flex items-center gap-3 mb-4">
            <input type="checkbox" v-model="form.available" id="available" class="accent-pink-400" />
            <label for="available" class="font-mono text-sm text-gray-300">open to work</label>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full"
              :class="form.available ? 'bg-green-400' : 'bg-gray-600'"></span>
            <span class="font-mono text-xs text-gray-500">
              {{ form.available ? 'visible to recruiters' : 'hidden from recruiters' }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// about</p>
          <div class="flex flex-col gap-4">
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">description</label>
              <textarea v-model="form.description" rows="5"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none resize-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">github username</label>
              <input v-model="form.githubUsername"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">email</label>
              <input v-model="form.email"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">telegram</label>
              <input v-model="form.telegramUsername" placeholder="@username"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
            <div>
              <label class="font-mono text-xs text-gray-500 mb-1 block">discord</label>
              <input v-model="form.discordUsername" placeholder="@username"
                class="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-sm font-mono text-white focus:border-pink-400 outline-none" />
            </div>
          </div>
        </div>

        <div class="border border-gray-800 p-6 bg-gray-900">
          <p class="text-gray-500 text-xs font-mono mb-4">// preview</p>
          <p class="font-mono text-white text-sm mb-1">{{ form.name || 'Your Name' }}</p>
          <p class="font-mono text-xs text-gray-500 mb-1">{{ form.title || 'Your Title' }}</p>
          <p class="font-mono text-xs text-gray-600">{{ form.location || 'Your Location' }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <button @click="saveProfile"
        class="border border-pink-400 text-pink-400 px-6 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
        {{ saved ? '✓ saved' : 'save' }}
      </button>
    </div>

    <div v-if="showCropper" class="fixed inset-0 z-50 bg-gray-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-gray-900 border border-gray-800 p-6 max-w-lg w-full shadow-2xl">
        <p class="text-gray-500 text-xs font-mono mb-4">// crop image</p>
        
        <div class="w-full bg-gray-950 border border-gray-800 mb-6 overflow-hidden flex justify-center" style="height: 400px;">
          <img ref="imageElement" :src="selectedImage || undefined" class="block max-w-full" alt="To crop" />
        </div>
        
        <div class="flex justify-end gap-4">
          <button @click="cancelCrop" 
            class="text-gray-500 hover:text-white font-mono text-sm px-4 py-2 transition-colors">
            cancel
          </button>
          <button @click="uploadAvatar" :disabled="uploading"
            class="border border-pink-400 text-pink-400 px-6 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
            {{ uploading ? 'uploading...' : 'crop & save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css' // CSS библиотеки

const { get, post } = useApi()
const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl

const avatarUrl = ref<string | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref(false)
const saved = ref(false)

const form = ref({
  name: '',
  title: '',
  location: '',
  description: '',
  githubUsername: '',
  email: '',
  telegramUsername: '',
  discordUsername: '',
  available: true,
})

const showCropper = ref(false)
const selectedImage = ref<string | null>(null)
const imageElement = ref<HTMLImageElement | null>(null)
let cropperInstance: Cropper | null = null

onMounted(async () => {
  const profile = await get('/api/profile')
  if (profile && !profile.error) {
    form.value = { ...form.value, ...profile }
    avatarUrl.value = profile.avatarUrl
      ? `${baseUrl}/api/profile/avatar?t=${Date.now()}`
      : null
  }
})

const saveProfile = async () => {
  await post('/api/profile', form.value)
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImage.value = e.target?.result as string
    showCropper.value = true
    
    nextTick(() => {
      if (imageElement.value) {
        cropperInstance = new Cropper(imageElement.value, {
          aspectRatio: 1,
          viewMode: 1,
          background: false,
          guides: false,
          autoCropArea: 0.9,
          dragMode: 'move',
        })
      }
    })
  }
  reader.readAsDataURL(file)
  input.value = ''
}

const cancelCrop = () => {
  if (cropperInstance) {
    cropperInstance.destroy()
    cropperInstance = null
  }
  showCropper.value = false
  selectedImage.value = null
}

const uploadAvatar = async () => {
  if (!cropperInstance) return

  uploading.value = true
  uploadError.value = ''
  uploadSuccess.value = false

  cropperInstance.getCroppedCanvas({
    width: 256,
    height: 256,
  }).toBlob(async (blob: Blob | null) => {
    if (!blob) {
      uploadError.value = 'Crop failed'
      uploading.value = false
      return
    }

    try {
      const formData = new FormData()
      formData.append('avatar', blob, 'avatar.webp')

      const res = await fetch(`${baseUrl}/api/profile/avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        uploadError.value = data.error ?? 'Upload failed'
        return
      }

      avatarUrl.value = `${baseUrl}/api/profile/avatar?t=${Date.now()}`
      uploadSuccess.value = true
      cancelCrop()
      setTimeout(() => uploadSuccess.value = false, 2000)
    } catch {
      uploadError.value = 'Connection error'
    } finally {
      uploading.value = false
    }
  }, 'image/webp', 0.9)
}
</script>

<style>
.cropper-view-box,
.cropper-face {
  border-radius: 0;
}

/* Изменяем цвет рамок и ползунков на розовый */
.cropper-line,
.cropper-point {
  background-color: #f472b6 !important;
}

.cropper-view-box {
  outline: 1px solid #f472b6 !important;
  outline-color: rgba(244, 114, 182, 0.7) !important;
}

.cropper-modal {
  background-color: rgba(3, 7, 18, 0.8) !important;
}
</style>