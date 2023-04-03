import { RefObject, useEffect, useRef, useState } from "react"
import { useEvent } from "react-use"

import { elementIsDisplay } from "../utils/helpers"

export function useIsDisplay<E extends Element>(marge: number = 1): [boolean, RefObject<E>] {
  const ref = useRef<E>(null)

  const [isDisplay, setIsDisplay] = useState<boolean>(
    ref.current ? elementIsDisplay(ref.current, marge) : false
  )

  function handler(): void {
    if (ref.current && !isDisplay) setIsDisplay(elementIsDisplay(ref.current, marge))
  }

  useEffect(() => void setTimeout(handler, 100), [])

  useEvent("scroll", handler, window, { capture: true })

  return [isDisplay, ref]
}
