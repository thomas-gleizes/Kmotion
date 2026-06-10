import type { ButtonHTMLAttributes } from "react"
import { css, cx } from "styled-system/css"

type Variant = "primary" | "ghost" | "danger"

const base = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "10px 20px",
  borderRadius: "full",
  fontSize: "15px",
  fontWeight: "600",
  fontFamily: "sans",
  cursor: "pointer",
  border: "none",
  transition: "all token(durations.fast) token(easings.apple)",
  _disabled: { opacity: 0.45, cursor: "default" },
  _focusVisible: { outline: "2px solid token(colors.accent)", outlineOffset: "2px" },
})

const variants: Record<Variant, string> = {
  primary: css({
    backgroundColor: "accent",
    color: "white",
    _hover: { backgroundColor: "accentHover" },
    _active: { transform: "scale(0.97)" },
  }),
  ghost: css({
    backgroundColor: "surfaceRaised",
    color: "text",
    _hover: { backgroundColor: "rgba(255, 255, 255, 0.14)" },
    _active: { transform: "scale(0.97)" },
  }),
  danger: css({
    backgroundColor: "transparent",
    color: "danger",
    _hover: { backgroundColor: "rgba(255, 69, 58, 0.12)" },
  }),
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }

export function Button({ variant = "primary", className, ...props }: Props) {
  return <button className={cx(base, variants[variant], className)} {...props} />
}
