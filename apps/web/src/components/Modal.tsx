import { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { css, cx } from "styled-system/css"

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

const overlayClosing = css({
  animation: "fadeOut 0.22s token(easings.apple) forwards",
  pointerEvents: "none",
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

const panelClosing = css({ animation: "scaleOut 0.22s token(easings.apple) forwards" })

const titleStyle = css({
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "20px",
})

type Props = {
  title: string
  onClose: () => void
  children: ReactNode
  /** Passe à false pour jouer l'animation de sortie avant le démontage. */
  open?: boolean
}

export function Modal({ title, onClose, children, open = true }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, open])

  return createPortal(
    <div
      className={cx(overlay, !open && overlayClosing)}
      onMouseDown={(event) => {
        if (open && event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={cx(panel, !open && panelClosing)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h2 className={titleStyle}>{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}
