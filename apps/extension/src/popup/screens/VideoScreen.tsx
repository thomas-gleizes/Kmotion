import React from "react"
import { useAsync } from "react-use"
import { FaSpinner } from "react-icons/all"

import { ConverterMusicInfo, IMusic } from "@kmotion/types"
import { MESSAGE_TYPE } from "../../resources/constants"
import MetaData from "../components/ui/MetaData"
import CoverChoice from "../components/ui/CoverChoice"

const VideoScreen = () => {
  const { loading, error, value } = useAsync(async () => {
    return new Promise<{ info: ConverterMusicInfo; music: IMusic; isReady: boolean }>(
      (resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const targetTab = tabs[0]
          if (!targetTab || !targetTab?.url) return reject(new Error("No URL"))

          const url = new URL(targetTab.url)

          if (!targetTab.id) return reject(new Error("No tab ID"))
          if (url.hostname !== "www.youtube.com") return reject(new Error("Not youtube.com"))
          if (url.pathname !== "/watch") return reject(new Error("Not a video"))
          if (url.searchParams.get("v") === null) return reject(new Error("No video ID"))

          chrome.runtime.onMessage.addListener((message) => {
            if (message.type === MESSAGE_TYPE.REPLY_VIDEO_INFO) resolve(message.data)
          })
          chrome.tabs.sendMessage(targetTab.id, { type: MESSAGE_TYPE.ASK_VIDEO_INFO })
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

  return (
    <div className="flex flex-col space-y-5">
      <MetaData info={value.info} isReady={value.isReady} />
      <CoverChoice info={value.info} />

      <div className="w-full px-2">
        <button className="bg-gradient-to-bl py-2 from-blue-600 to-blue-900 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 active:hover:shadow-md active:scale-95 transform transition text-white w-full text-xl font-semibold">
          {value.isReady ? "Télécharger" : "Convertir"}
        </button>
      </div>
    </div>
  )
}
export default VideoScreen
