import { useEffect, useRef, useState } from "react"

type Props = {
  text: string
  className?: string
}

// Fait défiler le texte horizontalement quand il dépasse la largeur disponible.
// L'animation se déclenche seulement si le contenu déborde (scrollWidth > clientWidth).
export function MarqueeText({ text, className }: Props) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const measure = () => setOffset(Math.max(0, inner.scrollWidth - outer.clientWidth))

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [text])

  // ~50px/s, avec 20 % du cycle réservé aux pauses de chaque côté (via keyframe).
  const duration = offset > 0 ? offset / 37.5 : 0

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "clip" }}
    >
      <span
        ref={innerRef}
        style={
          offset > 0
            ? ({
                display: "inline-block",
                animation: `marqueeScroll ${duration}s ease-in-out 0.8s infinite alternate`,
                "--marquee-offset": `-${offset}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </div>
  )
}
