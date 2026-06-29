export async function checkAvailability(
  _productGroupId: string,
  _startDate: string,
  _endDate: string,
): Promise<boolean> {
  // Booqable enforces availability at order creation time.
  // Returning true here lets users proceed; Booqable will reject double-bookings.
  return true
}
