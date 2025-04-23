export function calculateDistance(coords: [number, number][]) {
  function haversine(coord1: [number, number], coord2: [number, number]) {
    const toRad = (x: number) => (x * Math.PI) / 180
    const [lat1, lon1] = coord1
    const [lat2, lon2] = coord2
    const R = 6371

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  let distance = 0
  for (let i = 1; i < coords.length; i++) {
    distance += haversine(coords[i - 1], coords[i])
  }
  return distance
}
