export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  const sessionModal = useState<{ show: boolean }>('sessionModal', () => ({ show: false }))

  const handleResponse = async (res: Response) => {
    if (res.status === 401) {
      const data = await res.json()
      if (data.error === 'Unauthorized') {
        sessionModal.value.show = true
      }
      return data
    }
    return res.json()
  }

  const get = async (path: string) => {
    const res = await fetch(`${baseUrl}${path}`, {
      credentials: 'include',
    })
    return handleResponse(res)
  }

  const post = async (path: string, body: unknown) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    return handleResponse(res)
  }

  const patch = async (path: string, body: unknown) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    return handleResponse(res)
  }
  
  const del = async (path: string) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return handleResponse(res)
  }
  
  return { get, post, patch, del }
}