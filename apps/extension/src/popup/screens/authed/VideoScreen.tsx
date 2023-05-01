import React, { useEffect, useState } from "react"
import { useAsync } from "react-use"
import { FaSpinner } from "react-icons/all"

import { ConverterMusicInfo, IMusic } from "@kmotion/types"
import { MESSAGE_TYPE } from "../../../resources/constants"
import MetaData from "../../components/ui/MetaData"
import CoverChoice from "../../components/ui/CoverChoice"
import Timeline from "../../components/ui/Timeline"
import { sleep } from "../../../utils/helpers"

const VideoScreen: React.FC = () => {
  const [status, setStatus] = useState<ConvertVideoStatus>("stand-by")

  const { loading, error, value } = useAsync(async () => {
    return new Promise<{ info: ConverterMusicInfo; music: IMusic; isReady: boolean }>(
      (resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          const targetTab = tabs[0]
          if (!targetTab || !targetTab?.url) return reject(new Error("No URL"))
          if (!targetTab.id) return reject(new Error("No tab ID"))

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
                    console.log("Message", message)
                    if (message.convert) setStatus(message.convert.status)
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
  }, [])

  useEffect(() => {
    let loop = true
    if (status === "loading" && !loading) {
      ;(async () => {
        while (loop) {
          await sleep(200)
          chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const [targetTab] = tabs

            if (!targetTab?.id) return console.error("No tab ID")

            chrome.tabs.sendMessage(
              targetTab.id,
              { type: MESSAGE_TYPE.CONVERT_VIDEO, videoId: value?.info.videoId },
              (message) => {
                setStatus(message.status)
              }
            )
          })
        }
      })()
    }

    return () => {
      loop = false
    }
  }, [status, loading])

  if (loading)
    return (
      <div className="animate-spin text-3xl flex items-center justify-center w-full h-24">
        <FaSpinner />
      </div>
    )

  if (error || !value) return <div className="text-xl py-5 text-center">Video id not found</div>

  const handleFetch = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const [targetTab] = tabs

      if (!targetTab?.id) return console.error("No tab ID")

      chrome.tabs.sendMessage(
        targetTab.id,
        { type: MESSAGE_TYPE.CONVERT_VIDEO, videoId: value.info.videoId },
        (message) => {
          setStatus(message.status)
        }
      )
    })
  }

  return (
    <div className="flex flex-col space-y-2 px-2">
      <MetaData info={value.info} isReady={value.isReady} />
      <CoverChoice info={value.info} />
      <Timeline info={value.info} />
      <div className="w-full">
        <button
          onClick={handleFetch}
          className="py-1.5 flex items-center justify-center bg-gradient-to-bl rounded-md from-blue-800 to-gray-800 shadow-lg hover:shadow-xl hover:scale-105 active:hover:shadow-md active:scale-95 disabled:from-gray-500 disabled:to-gray-600 transform transition text-white w-full text-xl font-medium"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <FaSpinner className="animate-spin" />
          ) : value.isReady ? (
            "Télécharger"
          ) : (
            "Convertir"
          )}{" "}
          {status}
        </button>
      </div>
    </div>
  )
}
export default VideoScreen
