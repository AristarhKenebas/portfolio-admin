<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
    <div class="border border-gray-800 p-8 max-w-md w-full bg-gray-900">
      <p class="font-mono text-pink-400 text-xs tracking-widest mb-4">// error</p>
      <h1 class="font-mono text-6xl font-bold text-white mb-2">{{ error.statusCode }}</h1>
      <p class="font-mono text-gray-500 text-sm mb-8">{{ errorMessage }}</p>
      <button @click="handleError"
        class="border border-pink-400 text-pink-400 px-6 py-2 font-mono text-sm hover:bg-pink-400 hover:text-gray-950 transition-all">
        go back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number, message?: string } }>()

const errorMessage = computed(() => {
  switch (props.error.statusCode) {
    case 404: return 'Page not found'
    case 500: return 'Internal server error'
    case 501: return 'Not implemented'
    case 403: return 'Access forbidden'
    case 401: return 'Unauthorized'
    default: return props.error.message ?? 'Something went wrong'
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>