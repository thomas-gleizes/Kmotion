import { css, cx } from "styled-system/css"
import { usePlayer, usePlayerProgress } from "../player/PlayerContext"
import { thumbnailPath } from "../player/audioCache"
import { useAuthedBlobUrl } from "../hooks/useAuthedBlobUrl"
import { formatDuration } from "../lib/format"
import { AuthImage } from "./AuthImage"
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
} from "./icons"
import { truncate } from "../lib/styles"

const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: "linear-gradient(160deg, #0f0a0b 0%, #0a0a0c 55%, #080810 100%)",
  animation: "slideUp 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)",
})

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
const scrim = css({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  background:
    "radial-gradient(120% 90% at 30% 0%, rgba(10,10,12,0.35) 0%, rgba(10,10,12,0.72) 60%, rgba(8,8,16,0.9) 100%)",
  pointerEvents: "none",
})

const header = css({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 24px",
  flexShrink: 0,
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
  _hover: { color: "text", backgroundColor: "rgba(255,255,255,0.08)" },
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
  gap: "40px",
  padding: "8px 48px 40px",
  minHeight: 0,
})

const artSection = css({
  flex: "0 0 60%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 0,
})

const artBase = css({
  width: "100%",
  aspectRatio: "16/9",
  maxHeight: "65vh",
  borderRadius: "m",
  overflow: "hidden",
  boxShadow: "0 20px 56px rgba(0,0,0,0.55)",
})

const infoSection = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  overflowY: "auto",
  minWidth: 0,
  paddingRight: "4px",
})

const trackTitle = cx(
  truncate,
  css({ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px", lineHeight: "1.2" }),
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
    backgroundColor: "white",
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

const volumeRow = css({
  display: "flex",
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
    backgroundColor: "white",
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
  _hover: { backgroundColor: "rgba(255,255,255,0.06)", color: "text" },
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

export function FullscreenPlayer({ onClose }: { onClose: () => void }) {
  const player = usePlayer()
  const { currentTime, duration } = usePlayerProgress()
  const { url: artUrl } = useAuthedBlobUrl(player.current ? thumbnailPath(player.current.id) : null)

  if (!player.current) return null
  const { current } = player

  return (
    <div className={overlay}>
      {artUrl && (
        <div
          key={current.id}
          className={ambientBg}
          style={{ backgroundImage: `url(${artUrl})` }}
          aria-hidden
        />
      )}
      <div className={scrim} aria-hidden />
      <div className={header}>
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
          <div
            className={artBase}
            style={
              player.isPlaying ? { animation: "albumBreath 3s ease-in-out infinite" } : undefined
            }
          >
            <AuthImage path={thumbnailPath(current.id)} alt={current.title} />
          </div>
        </div>

        <div className={infoSection}>
          <div>
            <div className={trackTitle}>{current.title}</div>
            <div className={trackArtist}>{current.artist}</div>
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
