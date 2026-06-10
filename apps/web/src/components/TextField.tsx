import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"
import { css } from "styled-system/css"

const wrapper = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "100%",
})

const labelStyle = css({
  fontSize: "13px",
  fontWeight: "500",
  color: "textSecondary",
})

const inputStyle = css({
  width: "100%",
  padding: "12px 16px",
  borderRadius: "s",
  border: "1px solid token(colors.border)",
  backgroundColor: "surfaceRaised",
  color: "text",
  fontSize: "15px",
  fontFamily: "sans",
  transition: "all token(durations.fast) token(easings.apple)",
  _placeholder: { color: "textTertiary" },
  _focus: {
    outline: "none",
    borderColor: "accent",
    boxShadow: "0 0 0 3px rgba(250, 45, 72, 0.25)",
  },
})

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string }

export function TextField({ label, ...props }: InputProps) {
  const id = useId()
  return (
    <div className={wrapper}>
      {label && (
        <label htmlFor={id} className={labelStyle}>
          {label}
        </label>
      )}
      <input id={id} className={inputStyle} {...props} />
    </div>
  )
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }

export function TextArea({ label, ...props }: TextAreaProps) {
  const id = useId()
  return (
    <div className={wrapper}>
      {label && (
        <label htmlFor={id} className={labelStyle}>
          {label}
        </label>
      )}
      <textarea id={id} rows={3} className={inputStyle} {...props} />
    </div>
  )
}
