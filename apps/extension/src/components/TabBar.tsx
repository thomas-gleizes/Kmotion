import React from "react"
import { FiPlayCircle, FiMusic } from "react-icons/fi"

export type Tab = "video" | "library"

interface TabBarProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "video", label: "Vidéo", Icon: FiPlayCircle },
  { id: "library", label: "Musiques", Icon: FiMusic },
]

export const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <nav className="flex border-t border-hairline bg-surface-translucent backdrop-blur-xl">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
              isActive ? "text-accent" : "text-ink-secondary hover:text-ink"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
