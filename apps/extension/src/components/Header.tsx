import React from "react"
import { AvatarMenu } from "./AvatarMenu"

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-surface-translucent backdrop-blur-xl border-b border-hairline">
      <div className="flex items-center gap-1.5 text-accent">
        <span className="text-lg leading-none">♪</span>
        <h1 className="font-bold text-ink text-sm tracking-tight">kMotion</h1>
      </div>
      <AvatarMenu />
    </header>
  )
}
