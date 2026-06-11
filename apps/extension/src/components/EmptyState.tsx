import React from "react"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  message?: string
  children?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, children }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
      <div className="text-ink-tertiary mb-3">{icon}</div>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {message && <p className="text-xs text-ink-secondary mt-1.5 max-w-[240px]">{message}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
