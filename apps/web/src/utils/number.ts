export function roundMinMax(value: number, min: number, max: number, target: number) {
  if (value < min + target) return min
  if (value > max + target) return max
  return value
}
