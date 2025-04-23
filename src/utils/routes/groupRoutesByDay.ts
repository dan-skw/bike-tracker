// src/utils/groupRoutesByDay.ts
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export function groupRoutesByDay(routes: any[]) {
  const groups: Record<string, any[]> = {}

  for (const route of routes) {
    const date = route.createdAt?.toDate?.() ?? new Date(route.createdAt)
    const key = format(date, 'EEEE, dd MMMM', { locale: pl })

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(route)
  }

  return groups
}
