import { EventHandler } from "react"

export function elementIsDisplay(element: Element, marge: number): boolean {
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

export function isMobileOrTablet(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function isIos(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function resizeImage(src: string, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    console.log("Img", img)

    img.onload = function () {
      console.log("Onload")
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (!context) return reject("Context is null")

      const ratio = Math.min(width / img.width, height / img.height)

      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      context.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          console.log("Blob", blob)

          if (blob) resolve(blob)
          else reject(new Error("Blob is null"))
        },
        "image/jpeg",
        0.95,
      )
    }

    img.src = src
  })
}

export function getImageResolution(src: string): Promise<{ width: number; height: number }> {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image()

    img.onload = function () {
      resolve({ width: img.width, height: img.height })
    }

    img.src = src
  })
}
