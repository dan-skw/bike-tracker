/*
Using reverse geocoding via nominatim api to get user's current loaction by name of the city/village/town and a road.
*/

export const getLocationName = async (lat: number, lon: number)=> {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        const res = await fetch(url)
        const data = await res.json()
        const city = data.address.city || data.address.town || data.address.village
        const state = data.address.state
        const road = data.address.road 
        // return `${road ? road + ', ' : ''}${city ?? 'nieznana lokalizacja.'}`
        return {
            city: city ?? 'nieznana lokalizacja.',
            state: state ?? '',
            road: road ?? ''
        }
    } catch (error) {
        console.error('Reverse geocoding error: ', error)
        return 'nieznana lokalizacja.'
    }
}

