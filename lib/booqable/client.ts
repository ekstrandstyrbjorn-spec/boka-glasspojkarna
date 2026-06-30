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
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
}

// Legacy v1 API — simpler format, supports /orders/:id/lines
function v1BaseUrl() {
  const subdomain = process.env.BOOQABLE_SUBDOMAIN
  if (!subdomain) throw new Error('BOOQABLE_SUBDOMAIN is not set')
  return `https://${subdomain}.booqable.com/api/1`
}

async function v1Request<T>(path: string, init: RequestInit): Promise<T> {
  const key = process.env.BOOQABLE_API_KEY
  if (!key) throw new Error('BOOQABLE_API_KEY is not set')
  const url = `${v1BaseUrl()}${path}?api_key=${key}`
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers as Record<string, string> ?? {}) },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Booqable v1 API error ${res.status}: ${body}`)
  }
  const text = await res.text()
  return (text ? JSON.parse(text) : {}) as T
}

export const booqableV1 = {
  get: <T>(path: string) => v1Request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    v1Request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    v1Request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
}
