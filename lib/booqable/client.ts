function baseUrl() {
  const subdomain = process.env.BOOQABLE_SUBDOMAIN
  if (!subdomain) throw new Error('BOOQABLE_SUBDOMAIN is not set')
  return `https://${subdomain}.booqable.com/api/boomerang`
}

function authHeaders() {
  const key = process.env.BOOQABLE_API_KEY
  if (!key) throw new Error('BOOQABLE_API_KEY is not set')
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init.headers as Record<string, string> ?? {}) },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Booqable API error ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

export const booqable = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}
