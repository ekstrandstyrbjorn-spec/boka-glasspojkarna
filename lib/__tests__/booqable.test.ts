import { vi, test, expect, beforeEach } from 'vitest'
import { booqable } from '@/lib/booqable/client'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  vi.resetAllMocks()
  process.env.BOOQABLE_API_KEY = 'test-key'
  process.env.BOOQABLE_SUBDOMAIN = 'test-subdomain'
})

test('GET request sends correct auth header', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: [] }),
  })
  await booqable.get('/products')
  expect(mockFetch).toHaveBeenCalledWith(
    'https://test-subdomain.booqable.com/api/boomerang/products',
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer test-key',
      }),
    })
  )
})

test('GET throws on non-ok response', async () => {
  mockFetch.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) })
  await expect(booqable.get('/products')).rejects.toThrow('Booqable API error 401')
})
