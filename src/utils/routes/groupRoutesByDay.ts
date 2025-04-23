// src/utils/groupRoutesByDay.ts
import type { RouteEntry } from '@/types/RouteEntry'
import { formatDateToPl } from '../formatDateToPl'

export function groupRoutesByDay(routes: RouteEntry[]) {
  const groupedMap = new Map<string, { date: Date; entries: RouteEntry[] }>()

  for (const route of routes) {
    const date = route.createdAt.toDate()
    const key = formatDateToPl(route.createdAt)

    if (!groupedMap.has(key)) {
      groupedMap.set(key, { date, entries: [] })
    }
    groupedMap.get(key)!.entries.push(route)
  }

  const sortedEntries = [...groupedMap.entries()]
    .sort((a, b) => b[1].date.getTime() - a[1].date.getTime())
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value.entries
        return acc
      },
      {} as Record<string, RouteEntry[]>,
    )

  return sortedEntries
}
