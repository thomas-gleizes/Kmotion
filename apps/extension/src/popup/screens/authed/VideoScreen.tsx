import React, { useState } from "react"
import { useAsync } from "react-use"
import { FaSpinner } from "react-icons/all"

import { ConverterMusicInfo, IMusic } from "@kmotion/types"
import { MESSAGE_TYPE } from "../../../resources/constants"
import MetaData from "../../components/ui/MetaData"
import CoverChoice from "../../components/ui/CoverChoice"
import { downloadMusic } from "../../../utils/api"

const VideoScreen: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  const { loading, error, value } = useAsync(async () => {
    return new Promise<{ info: ConverterMusicInfo; music: IMusic; isReady: boolean }>(
      (resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          const targetTab = tabs[0]
          if (!targetTab || !targetTab?.url) return reject(new Error("No URL"))

          const url = new URL(targetTab.url)

          if (!targetTab.id) return reject(new Error("No tab ID"))
          if (url.hostname !== "www.youtube.com") return reject(new Error("Not youtube.com"))
          if (url.pathname !== "/watch") return reject(new Error("Not a video"))
          if (url.searchParams.get("v") === null) return reject(new Error("No video ID"))

          let loop = true
          while (loop) {
            console.log("loop")
            chrome.tabs.sendMessage(
              targetTab.id,
              { type: MESSAGE_TYPE.ASK_VIDEO_INFO },
              (message) => {
                switch (message.status) {
                  case "success":
                    loop = false
                    return resolve(message.videoInfo)
                  case "error":
                    loop = false
                    return reject(new Error(message.error))
                  case "loading":
                    return
                  case "no-video":
                    loop = false
                    return reject(new Error("No video"))
                }
              }
            )

            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        })
      }
    )
  })

  if (loading)
    return (
      <div className="animate-spin text-3xl flex items-center justify-center w-full h-24">
        <FaSpinner />
      </div>
    )

  if (error || !value) return <div className="text-xl py-5 text-center">Video id not found</div>

  const handleFetch = async () => {
    setIsDownloading(false)
    try {
      const response = await downloadMusic(value.music.youtubeId)
    } catch (e) {
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-5">
      <MetaData info={value.info} isReady={value.isReady} />
      <CoverChoice info={value.info} />

      <div className="w-full px-2">
        <button
          onClick={() => handleFetch()}
          className="py-1.5 bg-gradient-to-bl rounded-md from-blue-700 to-gray-700 shadow-lg hover:shadow-xl hover:scale-105 active:hover:shadow-md active:scale-95 transform transition text-white w-full text-xl font-semibold"
          disabled={isDownloading}
        >
          {value.isReady ? "Télécharger" : "Convertir"}
        </button>
      </div>
    </div>
  )
}
export default VideoScreen
