import { useCallback, useEffect, useRef, useState } from "react"
import { css } from "styled-system/css"
import { type Track, usePlayer } from "../player/PlayerContext"
import { DotsIcon, NextIcon } from "./icons"

const trigger = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "full",
  border: "none",
  background: "none",
  color: "textTertiary",
  cursor: "pointer",
  transition: "all token(durations.fast) token(easings.apple)",
  _hover: { color: "text", backgroundColor: "overlay" },
})

const menuWrapper = css({ position: "relative" })

const dropdown = css({
  position: "absolute",
  right: 0,
  top: "calc(100% + 4px)",
  backgroundColor: "surfaceRaised",
  border: "1px solid token(colors.border)",
  borderRadius: "m",
  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  minWidth: "170px",
  zIndex: 200,
  overflow: "hidden",
})

const menuItem = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "text",
  cursor: "pointer",
  border: "none",
  background: "none",
  width: "100%",
  textAlign: "left",
  fontFamily: "sans",
  whiteSpace: "nowrap",
  _hover: { backgroundColor: "overlay", color: "accent" },
})

type Props = {
  track: Track
}

export function MusicContextMenu({ track }: Props) {
  const [open, setOpen] = useState(false)
  const player = usePlayer()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  return (
    <div className={menuWrapper} ref={wrapperRef}>
      <button
        type="button"
        className={trigger}
        aria-label="Plus d'options"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      >
        <DotsIcon size={18} />
      </button>
      {open && (
        <div className={dropdown} role="menu">
          <button
            type="button"
            className={menuItem}
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation()
              player.playNext(track)
              close()
            }}
          >
            <NextIcon size={16} />
            Lire ensuite
          </button>
        </div>
      )}
    </div>
  )
}
