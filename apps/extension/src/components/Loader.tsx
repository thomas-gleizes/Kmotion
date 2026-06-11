import React from "react"
import { FiLoader } from "react-icons/fi"

/** Full-height centered spinner with an optional label. */
export const Loader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="h-full flex items-center justify-center gap-2 text-ink-secondary">
    <FiLoader className="animate-spin" />
    {text && <span className="text-sm">{text}</span>}
  </div>
)
