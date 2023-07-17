import React, { useEffect, useState } from "react"
import { useAsync } from "react-use"
import { FaSpinner } from "react-icons/fa"

import { ConverterMusicInfo, IMusic } from "@kmotion/types"
import { MESSAGE_TYPE } from "../../../resources/constants"
import { sleep } from "../../../utils/helpers"
import ConvertForm from "../../components/ui/ConvertForm"

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
            chrome.tabs.sendMessage(
              targetTab.id,
              { type: MESSAGE_TYPE.ASK_VIDEO_INFO },
              (message) => {
                switch (message.status) {
                  case "success":
                    loop = false
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
                  default:
                    break
                }
              },
            )

            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        })
      },
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
              },
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
      <div className="animate-spin text-3xl flex items-center justify-center w-full h-16">
        <FaSpinner />
      </div>
    )

  if (error || !value) return <div className="text-xl py-5 text-center">Video id not found</div>

  return <ConvertForm info={value.info} ready={value.isReady} />
}
export default VideoScreen
