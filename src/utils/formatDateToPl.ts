import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { Timestamp } from 'firebase/firestore'

export const formatDateToPl = (date: Timestamp): string => {
  if (!date) return ''
  return format((date as Timestamp).toDate(), 'dd MMMM yyyy', { locale: pl })
}
