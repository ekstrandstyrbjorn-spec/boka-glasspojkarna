import { booqable } from './client'

interface PlanningResponse {
  data: Array<{ attributes: { available: boolean } }>
}

export async function checkAvailability(
  productGroupId: string,
  startDate: string,
  endDate: string,
): Promise<boolean> {
  const params = new URLSearchParams({
    'filter[item_id]': productGroupId,
    'filter[starts_at]': `${startDate}T00:00:00Z`,
    'filter[ends_at]': `${endDate}T23:59:59Z`,
  })
  const res = await booqable.get<PlanningResponse>(`/planning_suggestions?${params}`)
  if (!res.data || res.data.length === 0) return true  // no data = assume available
  return res.data.every(d => d.attributes.available)
}
