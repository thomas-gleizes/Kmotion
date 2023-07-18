import { RefObject, useEffect, useState, useRef } from "react"
import { useEvent } from "react-use"

import { elementIsDisplay } from "../utils/helpers"

export function useIsDisplay<E extends Element>(
  marge: number = 1,
  elementRef?: RefObject<E>,
): [boolean, RefObject<E>] {
  const internalRef = useRef<E>(null)

  const ref = elementRef ?? internalRef

  const [isDisplay, setIsDisplay] = useState<boolean>(
    ref.current ? elementIsDisplay(ref.current, marge) : false,
  )

  function handler(): void {
    if (ref.current) {
      const display = elementIsDisplay(ref.current, marge)
      if (display !== isDisplay) setIsDisplay(display)
    }
  }

  useEffect(() => void setTimeout(handler, 100), [])

  useEvent("scroll", handler, window, { capture: true })

  return [isDisplay, ref]
}
