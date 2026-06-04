import React, { useEffect, useState } from "react"
import { LoginForm } from "./LoginForm"
import { VideoDetails } from "./VideoDetails"
import { NoVideo } from "./NoVideo"
import { useAuthStore, useVideoStore } from "../stores"
import { api } from "../utils/api"
import { extractVideoId } from "../utils/youtube"
import { FiLogOut } from "react-icons/fi"

export const PopupApp: React.FC = () => {
  const token = useAuthStore((state) => state.token)
  const clearToken = useAuthStore((state) => state.clearToken)
  const { videoId, isYoutube } = useVideoStore()
  const [isCheckingAuth, setIsCheckingAuth] = useState(!!token)
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)

  useEffect(() => {
    // Get current tab URL to extract video ID
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (tab.url) {
        const id = extractVideoId(tab.url)
        useVideoStore.setState({ videoId: id })
      }
    })

    // Listen for video ID changes from content script
    const messageListener = (
      request: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (request.type === "YOUTUBE_VIDEO_DETECTED") {
        useVideoStore.setState({ videoId: request.videoId })
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [])

  useEffect(() => {
    if (token && isCheckingAuth) {
      // Verify token is still valid
      api.setToken(token)
      api
        .getProfile()
        .then(() => {
          setIsAuthenticated(true)
          setIsCheckingAuth(false)
        })
        .catch(() => {
          clearToken()
          setIsAuthenticated(false)
          setIsCheckingAuth(false)
        })
    } else {
      setIsCheckingAuth(false)
    }
  }, [token])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    clearToken()
    setIsAuthenticated(false)
  }

  if (isCheckingAuth) {
    return (
      <div className="w-full p-6 bg-white text-center">
        <div className="animate-spin inline-block w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthenticated ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <>
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="font-bold text-gray-900">kMotion</h1>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-gray-100 rounded-md transition"
              title="Logout"
            >
              <FiLogOut size={18} className="text-gray-600" />
            </button>
          </div>

          {isYoutube && videoId ? (
            <VideoDetails videoId={videoId} />
          ) : (
            <NoVideo isYoutube={isYoutube} />
          )}
        </>
      )}
    </div>
  )
}


