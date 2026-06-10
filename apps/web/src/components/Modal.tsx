import { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { css } from "styled-system/css"

const overlay = css({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.55)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  animation: "fadeIn token(durations.fast) token(easings.apple)",
})

const panel = css({
  width: "min(440px, calc(100vw - 32px))",
  maxHeight: "85vh",
  overflowY: "auto",
  backgroundColor: "surface",
  border: "1px solid token(colors.border)",
  borderRadius: "l",
  boxShadow: "card",
  padding: "28px",
  animation: "scaleIn token(durations.normal) token(easings.apple)",
})

const titleStyle = css({
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "20px",
})

type Props = {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return createPortal(
    <div
      className={overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={panel} role="dialog" aria-modal="true" aria-label={title}>
        <h2 className={titleStyle}>{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}
