import React from "react"

/**
 * Primary accent "pill" button matching the web app's Apple Music style.
 * Sizing/width is left to the caller via `className` (e.g. "w-full py-2.5").
 */
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-45 text-white font-semibold rounded-full transition-all ease-apple active:scale-[0.97] ${className}`}
    {...props}
  />
)
