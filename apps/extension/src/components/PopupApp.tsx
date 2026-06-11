import React, { useEffect, useState } from "react"
import { FiLoader } from "react-icons/fi"
import { LoginForm } from "./LoginForm"
import { Header } from "./Header"
import { TabBar, type Tab } from "./TabBar"
import { VideoTab } from "./tabs/VideoTab"
import { LibraryTab } from "./tabs/LibraryTab"
import { useAuthStore, useVideoStore } from "../stores"
import { api } from "../utils/api"

export const PopupApp: React.FC = () => {
  const token = useAuthStore((state) => state.token)
  const [hydrated, setHydrated] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("video")
  const setTab = useVideoStore((state) => state.setTab)

  // Detect the active tab's video + listen for SPA navigation messages.
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]?.url)
    })

    const listener = (request: { type?: string; videoId?: string | null }) => {
      if (request?.type === "YOUTUBE_VIDEO_DETECTED" || request?.type === "VIDEO_ID_CHANGED") {
        useVideoStore.setState({ videoId: request.videoId ?? null })
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [setTab])

  // Hydrate the session from chrome.storage and validate the token.
  useEffect(() => {
    let active = true
    ;(async () => {
      const stored = await api.loadToken()
      if (!active) return
      if (!stored) {
        setHydrated(true)
        return
      }
      try {
        const user = await api.getProfile()
        if (!active) return
        useAuthStore.getState().setSession(stored, user)
      } catch {
        await api.clearAuth()
        if (active) useAuthStore.getState().clear()
      } finally {
        if (active) setHydrated(true)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  if (!hydrated) {
    return (
      <div className="h-full flex items-center justify-center bg-bg">
        <FiLoader className="animate-spin text-ink-tertiary" size={24} />
      </div>
    )
  }

  if (!token) {
    return <LoginForm />
  }

  return (
    <div className="h-full flex flex-col bg-bg text-ink">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {activeTab === "video" ? <VideoTab /> : <LibraryTab />}
      </main>
      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
