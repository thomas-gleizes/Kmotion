export function roundMinMax(value: number, min: number, max: number, target: number) {
  if (value < min + target) return min
  if (value > max + target) return max
  return value
}

export function randomMinMax(min: number, max: number) {
  return Math.random() * (max - min) + min
}
