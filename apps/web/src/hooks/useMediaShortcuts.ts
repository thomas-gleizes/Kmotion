import { useEffect } from "react"
import { usePlayer } from "../player/PlayerContext"

const SEEK_STEP = 10
const VOLUME_STEP = 0.05

// Raccourcis clavier globaux de l'application (actifs hors champ de saisie) :
//
//   Espace / K      Lecture / Pause
//   F               Ouvrir / fermer le lecteur plein écran
//   Échap           Fermer le lecteur plein écran
//   → / ←           Avancer / reculer de 10 s
//   ↑ / ↓           Volume +/- 5 %
//   N / P           Titre suivant / précédent
//   S               Lecture aléatoire (on/off)
//   R               Répétition (off → file → titre)
//   M               Couper / rétablir le son
//
// Ils sont ignorés pendant la frappe dans un input/textarea (ou un élément
// éditable) afin de ne pas perturber la recherche ou les formulaires.

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable
}

export function useMediaShortcuts(opts: {
  fullscreen: boolean
  setFullscreen: (open: boolean) => void
}) {
  const { current, toggle, next, prev, seekBy, adjustVolume, toggleShuffle, cycleRepeat, toggleMute } =
    usePlayer()
  const { fullscreen, setFullscreen } = opts

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return

      // Lettres normalisées en minuscules (insensible à Maj / Verr. Maj).
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      switch (key) {
        case " ":
        case "k":
          if (!current) return
          event.preventDefault()
          toggle()
          break
        case "f":
          if (!current) return
          event.preventDefault()
          setFullscreen(!fullscreen)
          break
        case "Escape":
          if (fullscreen) {
            event.preventDefault()
            setFullscreen(false)
          }
          break
        case "ArrowRight":
          if (!current) return
          event.preventDefault()
          seekBy(SEEK_STEP)
          break
        case "ArrowLeft":
          if (!current) return
          event.preventDefault()
          seekBy(-SEEK_STEP)
          break
        case "ArrowUp":
          event.preventDefault()
          adjustVolume(VOLUME_STEP)
          break
        case "ArrowDown":
          event.preventDefault()
          adjustVolume(-VOLUME_STEP)
          break
        case "n":
          if (!current) return
          event.preventDefault()
          next()
          break
        case "p":
          if (!current) return
          event.preventDefault()
          prev()
          break
        case "s":
          event.preventDefault()
          toggleShuffle()
          break
        case "r":
          event.preventDefault()
          cycleRepeat()
          break
        case "m":
          event.preventDefault()
          toggleMute()
          break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [
    current,
    toggle,
    next,
    prev,
    seekBy,
    adjustVolume,
    toggleShuffle,
    cycleRepeat,
    toggleMute,
    fullscreen,
    setFullscreen,
  ])
}
