import type { Timestamp } from 'firebase/firestore'

export const formatDate = (timestamp: Timestamp) => {
  const date = (timestamp as Timestamp).toDate()
  return date.toLocaleDateString()
}
