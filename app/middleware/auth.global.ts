export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  if (to.path === '/login') return

  const { get } = useApi()

  try {
    const res = await get('/api/auth/me')
    if (!res.authenticated) {
      return navigateTo('/login')
    }
  } catch {
    return navigateTo('/login')
  }
})