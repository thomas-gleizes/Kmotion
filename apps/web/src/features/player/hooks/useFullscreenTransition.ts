import {
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type CSSProperties,
  type TouchEvent as ReactTouchEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react"

// Au-delà de ce déplacement vers le bas, le geste ferme le lecteur.
const CLOSE_THRESHOLD = 110

// Gère le cycle de vie d'affichage du lecteur plein écran : montage différé le
// temps de l'animation d'entrée/sortie, et fermeture par swipe vers le bas
// (mobile). Renvoie de quoi câbler le conteneur sans exposer l'état interne.
export function useFullscreenTransition(open: boolean, onClose: () => void) {
  // Reste monté pendant l'animation de sortie, puis se démonte (`render`).
  const [render, setRender] = useState(open)

  const drag = useRef({ startX: 0, startY: 0, active: false })
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [closing, setClosing] = useState(false)

  const onDragStart = (event: ReactTouchEvent) => {
    if (closing) return
    const touch = event.touches[0]
    drag.current = { startX: touch.clientX, startY: touch.clientY, active: true }
    setDragging(true)
  }

  const onDragMove = (event: ReactTouchEvent) => {
    if (!drag.current.active) return
    const touch = event.touches[0]
    const dy = touch.clientY - drag.current.startY
    const dx = touch.clientX - drag.current.startX
    // Ignorer les gestes plutôt horizontaux.
    if (Math.abs(dx) > Math.abs(dy)) return
    setDragY(dy > 0 ? dy : 0)
  }

  const onDragEnd = () => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    if (dragY > CLOSE_THRESHOLD) {
      // On garde `open` tel quel et on anime soi-même la sortie vers le bas,
      // puis on démonte directement pour éviter de cumuler avec slideDown.
      setClosing(true)
    } else {
      setDragY(0)
    }
  }

  const dragHandlers = {
    onTouchStart: onDragStart,
    onTouchMove: onDragMove,
    onTouchEnd: onDragEnd,
    onTouchCancel: onDragEnd,
  }

  if (open && !render) setRender(true)

  const overlayStyle: CSSProperties = closing
    ? { transform: "translateY(100%)", opacity: 0, transition: "transform 0.3s, opacity 0.3s" }
    : dragY > 0
      ? {
          transform: `translateY(${dragY}px)`,
          opacity: Math.max(1 - dragY / 700, 0.4),
          transition: dragging ? "none" : "transform 0.3s, opacity 0.3s",
        }
      : {}

  const onAnimationEnd = (event: ReactAnimationEvent) => {
    // Ignorer les animations des enfants (elles remontent) ; démonter à la fin de la sortie.
    if (event.target === event.currentTarget && !open) setRender(false)
  }

  const onTransitionEnd = (event: ReactTransitionEvent) => {
    // Fin de l'animation de fermeture par swipe : on démonte et on notifie le parent.
    if (closing && event.target === event.currentTarget && event.propertyName === "transform") {
      setRender(false)
      setClosing(false)
      setDragY(0)
      onClose()
    }
  }

  return { render, closing, dragHandlers, overlayStyle, onAnimationEnd, onTransitionEnd }
}
