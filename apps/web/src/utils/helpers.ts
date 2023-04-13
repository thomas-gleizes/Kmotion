import { EventHandler } from "react"

export function elementIsDisplay(element: Element, marge: number = 1): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom * marge <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function handleStopPropagation(callback: (event: MouseEvent) => void): EventHandler<any> {
  return (event: MouseEvent) => {
    event.stopPropagation()
    callback(event)
  }
}
