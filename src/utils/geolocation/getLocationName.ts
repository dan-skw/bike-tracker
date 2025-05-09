export const getLocationName = async (lat: number, lon: number) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    const res = await fetch(url)
    const data = await res.json()
    const city: string = data.address.city || data.address.town || data.address.village
    const state: string = data.address.state
    const road: string = data.address.road
    return {
      city: city ?? '',
      state: state ?? '',
      road: road ?? '',
    }
  } catch (error) {
    console.error('Reverse geocoding error: ', error)
  }
}
