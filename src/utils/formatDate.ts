export const formatDate = (timestamp: any) => {
  const date = timestamp?.toDate?.() ?? new Date(timestamp)
  return date.toLocaleDateString()
}
