import React from "react"

type Variant = "success" | "warning" | "error"

const variants: Record<Variant, string> = {
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  error: "bg-danger/10 border-danger/20 text-danger",
}

/** Colored status chip with a leading icon (converted / in-progress / error). */
export const Banner: React.FC<{
  variant: Variant
  icon: React.ReactNode
  children: React.ReactNode
}> = ({ variant, icon, children }) => (
  <div
    className={`flex items-center gap-2 border rounded-m px-3 py-2.5 text-sm ${variants[variant]}`}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span>{children}</span>
  </div>
)
