import { useState } from "react"
import { Outlet } from "@tanstack/react-router"
import { css } from "styled-system/css"
import { Sidebar } from "./Sidebar"
import { BottomTabBar } from "./BottomTabBar"
import { PlayerBar } from "./PlayerBar"
import { FullscreenPlayer } from "./FullscreenPlayer"
import { useMediaShortcuts } from "../hooks/useMediaShortcuts"
import { useIsMobile } from "../hooks/useMediaQuery"

const shell = css({
  display: "grid",
  gridTemplateAreas: '"main" "player" "tabbar"',
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr auto auto",
  height: "100dvh",
  overflow: "hidden",
  md: {
    gridTemplateAreas: '"sidebar main" "player player"',
    gridTemplateColumns: "240px 1fr",
    gridTemplateRows: "1fr auto",
  },
})

const main = css({
  gridArea: "main",
  overflowY: "auto",
  padding: "20px 16px 24px",
  md: { padding: "32px 40px 48px" },
})

export function AppShell() {
  const [fullscreen, setFullscreen] = useState(false)
  const isMobile = useIsMobile()
  useMediaShortcuts({ fullscreen, setFullscreen })

  return (
    <div className={shell}>
      {!isMobile && <Sidebar />}
      <main className={main}>
        <Outlet />
      </main>
      <PlayerBar onExpand={() => setFullscreen(true)} />
      {isMobile && <BottomTabBar />}
      <FullscreenPlayer open={fullscreen} onClose={() => setFullscreen(false)} />
    </div>
  )
}
