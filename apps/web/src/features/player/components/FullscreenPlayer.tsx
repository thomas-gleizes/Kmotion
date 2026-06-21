import { useRef, useState, type CSSProperties, type TouchEvent as ReactTouchEvent } from "react"
import { css, cx } from "styled-system/css"
import { usePlayer, usePlayerProgress } from "@/features/player/state/PlayerContext"
import { thumbnailPath } from "@/shared/lib/audioCache"
import { useAuthedBlobUrl } from "@/shared/hooks/useAuthedBlobUrl"
import { formatDuration } from "@/shared/lib/format"
import { AuthImage } from "@/shared/ui/AuthImage"
import { MarqueeText } from "@/features/player/components/MarqueeText"
import {
  ChevronDownIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  ShuffleIcon,
  SpinnerIcon,
  VolumeIcon,
} from "@/shared/ui/icons"
import { truncate } from "@/shared/lib/styles"

const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: "linear-gradient(160deg, #0f0a0b 0%, #0a0a0c 55%, #080810 100%)",
  _light: {
    background: "linear-gradient(160deg, #fafafc 0%, #f5f5f7 55%, #efeff2 100%)",
  },
})

const overlayEntering = css({ animation: "slideUp 0.35s token(easings.apple)" })

const overlayExiting = css({ animation: "slideDown 0.28s token(easings.apple) both" })

// Calque ambiant : la pochette floutée et saturée colore le fond avec les
// teintes du morceau en cours (à la Apple Music / Spotify).
const ambientBg = css({
  position: "absolute",
  inset: "-10%",
  zIndex: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(72px) saturate(1.7)",
  transform: "scale(1.25)",
  opacity: 0.55,
  animation: "ambientIn 0.8s token(easings.apple) both",
  pointerEvents: "none",
})

// Voile dégradé pour garder titres, contrôles et file de lecture lisibles.
// Sur mobile (layout vertical), le dégradé part du haut pour laisser la
// couleur ambiante apparaître derrière la pochette, comme sur desktop.
const scrim = css({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  background:
    "radial-gradient(140% 60% at 50% 0%, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.75) 55%, rgba(8,8,16,0.92) 100%)",
  pointerEvents: "none",
  md: {
    background:
      "radial-gradient(120% 90% at 30% 0%, rgba(10,10,12,0.35) 0%, rgba(10,10,12,0.72) 60%, rgba(8,8,16,0.9) 100%)",
  },
  _light: {
    background:
      "radial-gradient(140% 60% at 50% 0%, rgba(245,245,247,0.4) 0%, rgba(245,245,247,0.82) 55%, rgba(239,239,242,0.95) 100%)",
    md: {
      background:
        "radial-gradient(120% 90% at 30% 0%, rgba(245,245,247,0.45) 0%, rgba(245,245,247,0.8) 60%, rgba(239,239,242,0.94) 100%)",
    },
  },
})

// Poignée de glissement (mobile) : zone tactile en haut pour fermer le lecteur
// d'un swipe vers le bas. Masquée sur desktop (souris/clavier).
const grabberZone = css({
  position: "relative",
  zIndex: 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "calc(8px + env(safe-area-inset-top))",
  paddingBottom: "4px",
  flexShrink: 0,
  touchAction: "none",
  md: { display: "none" },
})

const grabber = css({
  width: "38px",
  height: "5px",
  borderRadius: "full",
  backgroundColor: "rgba(255,255,255,0.35)",
  _light: { backgroundColor: "rgba(0,0,0,0.25)" },
})

const header = css({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 24px",
  flexShrink: 0,
  touchAction: "none",
})

const closeBtn = css({
  background: "none",
  border: "none",
  color: "textSecondary",
  cursor: "pointer",
  display: "flex",
  padding: "8px",
  borderRadius: "full",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "text", backgroundColor: "overlayStrong" },
})

const nowPlayingLabel = css({
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "textTertiary",
})

const body = css({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "20px",
  padding: "8px 20px calc(24px + env(safe-area-inset-bottom))",
  minHeight: 0,
  md: { flexDirection: "row", gap: "40px", padding: "8px 48px 40px" },
})

const artSection = css({
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 0,
  minWidth: 0,
  md: { flex: 1 },
})

const artBase = css({
  width: "100%",
  aspectRatio: "16/9",
  maxHeight: "38dvh",
  md: { width: "auto", height: "60vh", maxWidth: "100%", maxHeight: "none" },
  borderRadius: "m",
  overflow: "hidden",
  transformOrigin: "center",
  transform: "scale(1)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
  transition: "transform 0.4s token(easings.apple), box-shadow 0.4s token(easings.apple)",
})

// En pause, la pochette se réduit légèrement (à la Apple Music / Spotify).
const artPaused = css({
  transform: "scale(0.9)",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
})

const infoSection = css({
  flex: 1,
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  overflowY: "auto",
  minWidth: 0,
  paddingRight: "4px",
  md: { flex: "0 0 30%", maxWidth: "30%", width: "auto" },
})

const trackTitle = cx(
  truncate,
  css({
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    lineHeight: "1.2",
    color: "text",
    md: { fontSize: "28px" },
  }),
)

const trackArtist = cx(
  truncate,
  css({ fontSize: "17px", color: "textSecondary", fontWeight: "500" }),
)

const progressBlock = css({ display: "flex", flexDirection: "column", gap: "6px" })

const progressSlider = css({
  width: "100%",
  appearance: "none",
  height: "4px",
  borderRadius: "full",
  backgroundColor: "rgba(255,255,255,0.16)",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "14px",
    height: "14px",
    borderRadius: "full",
    backgroundColor: "text",
    transition: "transform token(durations.fast) token(easings.apple)",
  },
  "&:hover::-webkit-slider-thumb": { transform: "scale(1.3)" },
})

const timesRow = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  color: "textTertiary",
  fontVariantNumeric: "tabular-nums",
})

const controlsRow = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  gap: "20px",
})

const ctrlBtn = css({
  background: "none",
  border: "none",
  color: "text",
  cursor: "pointer",
  display: "flex",
  padding: "8px",
  borderRadius: "full",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "accent", transform: "scale(1.1)" },
  _disabled: { color: "textTertiary", transform: "none", cursor: "default" },
})

const playBtnExtra = css({
  background: "white",
  color: "black !important",
  width: "52px",
  height: "52px",
  alignItems: "center",
  justifyContent: "center",
  _hover: { transform: "scale(1.06) !important" },
})

const toggleActive = css({
  color: "accent !important",
  _hover: { color: "accentHover !important", transform: "none" },
})

const repeatWrap = css({ position: "relative" })

const repeatBadge = css({
  position: "absolute",
  top: "2px",
  right: "2px",
  minWidth: "13px",
  height: "13px",
  padding: "0 2px",
  borderRadius: "full",
  backgroundColor: "accent",
  color: "white",
  fontSize: "9px",
  fontWeight: "700",
  lineHeight: "13px",
  textAlign: "center",
})

// Masqué sur mobile : le volume se règle avec les boutons physiques.
const volumeRow = css({
  display: "none",
  md: { display: "flex" },
  alignItems: "center",
  gap: "10px",
  width: "100%",
  color: "textSecondary",
})

const volumeSlider = css({
  flex: 1,
  appearance: "none",
  height: "3px",
  borderRadius: "full",
  backgroundColor: "rgba(255,255,255,0.16)",
  cursor: "pointer",
  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "12px",
    height: "12px",
    borderRadius: "full",
    backgroundColor: "text",
  },
})

const queueSection = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: 1,
  minHeight: 0,
})

const queueLabel = css({
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  color: "textTertiary",
  paddingBottom: "8px",
  borderBottom: "1px solid token(colors.border)",
})

const queueList = css({
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
})

const queueItem = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 10px",
  borderRadius: "s",
  cursor: "pointer",
  background: "none",
  border: "none",
  color: "textSecondary",
  textAlign: "left",
  width: "100%",
  transition:
    "background token(durations.fast) token(easings.apple), color token(durations.fast) token(easings.apple)",
  _hover: { backgroundColor: "overlay", color: "text" },
})

const queueItemActive = css({ color: "accent !important" })

const queueIdx = css({
  fontSize: "12px",
  color: "textTertiary",
  width: "20px",
  textAlign: "center",
  flexShrink: 0,
  fontVariantNumeric: "tabular-nums",
})

const queueTrackTitle = cx(truncate, css({ fontSize: "14px", fontWeight: "500" }))
const queueTrackArtist = cx(truncate, css({ fontSize: "12px", color: "textSecondary" }))

const queueDur = css({
  fontSize: "12px",
  color: "textTertiary",
  flexShrink: 0,
  marginLeft: "auto",
  fontVariantNumeric: "tabular-nums",
})

export function FullscreenPlayer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const player = usePlayer()
  const { currentTime, duration } = usePlayerProgress()
  // Reste monté pendant l'animation de sortie, puis se démonte (`render`).
  const [render, setRender] = useState(open)
  const { url: artUrl } = useAuthedBlobUrl(
    render && player.current ? thumbnailPath(player.current.id) : null,
  )

  // Swipe vers le bas (mobile) pour fermer le lecteur plein écran.
  const drag = useRef({ startX: 0, startY: 0, active: false })
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [closing, setClosing] = useState(false)
  // Au-delà de ce déplacement vers le bas, le geste ferme le lecteur.
  const CLOSE_THRESHOLD = 110

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

  if (!render || !player.current) return null
  const { current } = player

  const overlayStyle: CSSProperties = closing
    ? { transform: "translateY(100%)", opacity: 0, transition: "transform 0.3s, opacity 0.3s" }
    : dragY > 0
      ? {
          transform: `translateY(${dragY}px)`,
          opacity: Math.max(1 - dragY / 700, 0.4),
          transition: dragging ? "none" : "transform 0.3s, opacity 0.3s",
        }
      : {}

  return (
    <div
      className={cx(overlay, !closing && (open ? overlayEntering : overlayExiting))}
      style={overlayStyle}
      onAnimationEnd={(event) => {
        // Ignorer les animations des enfants (elles remontent) ; démonter à la fin de la sortie.
        if (event.target === event.currentTarget && !open) setRender(false)
      }}
      onTransitionEnd={(event) => {
        // Fin de l'animation de fermeture par swipe : on démonte et on notifie le parent.
        if (closing && event.target === event.currentTarget && event.propertyName === "transform") {
          setRender(false)
          setClosing(false)
          setDragY(0)
          onClose()
        }
      }}
    >
      <div className={grabberZone} {...dragHandlers}>
        <span className={grabber} aria-hidden />
      </div>
      {artUrl && (
        <div
          key={current.id}
          className={ambientBg}
          style={{ backgroundImage: `url(${artUrl})` }}
          aria-hidden
        />
      )}
      <div className={scrim} aria-hidden />
      <div className={header} {...dragHandlers}>
        <button
          type="button"
          className={closeBtn}
          onClick={onClose}
          aria-label="Réduire"
          title="Réduire (F / Échap)"
        >
          <ChevronDownIcon size={22} />
        </button>
        <span className={nowPlayingLabel}>En lecture</span>
        <div style={{ width: 38 }} />
      </div>

      <div className={body}>
        <div className={artSection}>
          <div className={cx(artBase, !player.isPlaying && artPaused)}>
            <AuthImage path={thumbnailPath(current.id)} alt={current.title} />
          </div>
        </div>

        <div className={infoSection}>
          <div>
            <MarqueeText text={current.title} className={trackTitle} />
            <MarqueeText text={current.artist} className={trackArtist} />
          </div>

          <div className={progressBlock}>
            <input
              type="range"
              className={progressSlider}
              min={0}
              max={duration || current.duration || 0}
              step={1}
              value={currentTime}
              onChange={(e) => player.seek(Number(e.target.value))}
              aria-label="Position de lecture"
            />
            <div className={timesRow}>
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration || current.duration)}</span>
            </div>
          </div>

          <div className={controlsRow}>
            <button
              type="button"
              className={cx(ctrlBtn, player.shuffle && toggleActive)}
              onClick={player.toggleShuffle}
              aria-label="Lecture aléatoire"
              aria-pressed={player.shuffle}
              title="Lecture aléatoire (S)"
            >
              <ShuffleIcon size={22} />
            </button>
            <button
              type="button"
              className={ctrlBtn}
              onClick={player.prev}
              aria-label="Titre précédent"
              title="Titre précédent (P)"
            >
              <PrevIcon size={28} />
            </button>
            <button
              type="button"
              className={`${ctrlBtn} ${playBtnExtra}`}
              onClick={player.toggle}
              aria-label={player.isPlaying ? "Pause" : "Lecture"}
              title={player.isPlaying ? "Pause (Espace)" : "Lecture (Espace)"}
            >
              {player.isLoading ? (
                <SpinnerIcon size={22} />
              ) : player.isPlaying ? (
                <PauseIcon size={22} />
              ) : (
                <PlayIcon size={22} />
              )}
            </button>
            <button
              type="button"
              className={ctrlBtn}
              onClick={player.next}
              disabled={!player.hasNext}
              aria-label="Titre suivant"
              title="Titre suivant (N)"
            >
              <NextIcon size={28} />
            </button>
            <button
              type="button"
              className={cx(ctrlBtn, repeatWrap, player.repeat !== "off" && toggleActive)}
              onClick={player.cycleRepeat}
              aria-label={
                player.repeat === "one"
                  ? "Répéter le titre"
                  : player.repeat === "all"
                    ? "Répéter la file"
                    : "Répétition désactivée"
              }
              aria-pressed={player.repeat !== "off"}
              title="Répétition (R)"
            >
              <RepeatIcon size={22} />
              {player.repeat === "one" && <span className={repeatBadge}>1</span>}
            </button>
          </div>

          <div className={volumeRow}>
            <VolumeIcon size={16} />
            <input
              type="range"
              className={volumeSlider}
              min={0}
              max={1}
              step={0.01}
              value={player.volume}
              onChange={(e) => player.setVolume(Number(e.target.value))}
              aria-label="Volume"
            />
          </div>

          {player.queue.length > 0 && (
            <div className={queueSection}>
              <div className={queueLabel}>File de lecture</div>
              <div className={queueList}>
                {player.queue.map((track, i) => (
                  <button
                    key={track.id}
                    type="button"
                    className={cx(queueItem, i === player.index && queueItemActive)}
                    onClick={() => player.playQueue(player.queue, i)}
                  >
                    <span className={queueIdx}>{i + 1}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className={queueTrackTitle}>{track.title}</div>
                      <div className={queueTrackArtist}>{track.artist}</div>
                    </div>
                    <span className={queueDur}>{formatDuration(track.duration)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
