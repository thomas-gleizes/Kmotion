import React, { useEffect, useRef, useState } from "react"
import { FiLogOut } from "react-icons/fi"
import { useAuthStore } from "../stores"
import { api } from "../utils/api"

function initials(user: { name?: string; email?: string } | null): string {
  if (user?.name) {
    return user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
  }
  return user?.email?.[0]?.toUpperCase() ?? "?"
}

export const AvatarMenu: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const logout = async () => {
    setOpen(false)
    await api.clearAuth()
    useAuthStore.getState().clear()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full bg-accent text-white text-xs font-semibold flex items-center justify-center hover:bg-accent-hover transition-all ease-apple active:scale-95"
        title={user?.name ?? user?.email ?? "Compte"}
      >
        {initials(user)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-raised border border-hairline rounded-m shadow-dropdown overflow-hidden z-10">
          {(user?.name || user?.email) && (
            <div className="px-3 py-2.5 border-b border-hairline">
              {user?.name && (
                <p className="text-sm font-medium text-ink truncate">{user.name}</p>
              )}
              {user?.email && (
                <p className="text-xs text-ink-secondary truncate">{user.email}</p>
              )}
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-white/5 transition"
          >
            <FiLogOut size={15} />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}
