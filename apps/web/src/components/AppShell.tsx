import { useState } from "react"
import { Outlet } from "@tanstack/react-router"
import { css } from "styled-system/css"
import { Sidebar } from "./Sidebar"
import { PlayerBar } from "./PlayerBar"
import { FullscreenPlayer } from "./FullscreenPlayer"
import { useMediaShortcuts } from "../hooks/useMediaShortcuts"

const shell = css({
  display: "grid",
  gridTemplateAreas: '"sidebar main" "player player"',
  gridTemplateColumns: "240px 1fr",
  gridTemplateRows: "1fr auto",
  height: "100vh",
  overflow: "hidden",
})

const main = css({
  gridArea: "main",
  overflowY: "auto",
  padding: "32px 40px 48px",
})

export function AppShell() {
  const [fullscreen, setFullscreen] = useState(false)
  useMediaShortcuts({ fullscreen, setFullscreen })

  return (
    <div className={shell}>
      <Sidebar />
      <main className={main}>
        <Outlet />
      </main>
      <PlayerBar onExpand={() => setFullscreen(true)} />
      {fullscreen && <FullscreenPlayer onClose={() => setFullscreen(false)} />}
    </div>
  )
}
