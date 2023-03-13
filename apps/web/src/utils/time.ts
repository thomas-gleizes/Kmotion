export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`
}
