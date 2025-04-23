import type { Timestamp } from 'firebase/firestore'

export interface RouteEntry {
  id: string
  createdAt: Timestamp
  distanceKm: number
  durationSeconds: number
  location: {
    city: string
    road: string
    state: string
  }
  path: {
    lat: number
    lng: number
  }[]
}
