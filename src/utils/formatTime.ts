export function formatTime(seconds: number): string {
  const hr = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  return `${hr ? hr.toString().padStart(2, '0') + ' h' : ''}  ${min.toString().padStart(2, '0')} min`
}
