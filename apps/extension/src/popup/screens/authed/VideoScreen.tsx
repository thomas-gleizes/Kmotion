import React, { useEffect, useState } from "react"
import { useAsync } from "react-use"
import { FaSpinner } from "react-icons/fa"

import { ConvertedMusic, ConverterMusicDetails, IMusic } from "@kmotion/types"
import { MESSAGE_TYPE } from "../../../resources/constants"
import ConvertForm from "../../components/ui/ConvertForm"
import ReadyForm from "../../components/ui/ReadyForm"

interface State {
  info: { details: ConverterMusicDetails; music: ConvertedMusic }
  isReady: boolean
  music: IMusic
  youtubeId: string
}

const VideoScreen: React.FC = () => {
  const [status, setStatus] = useState<ConvertVideoStatus>("stand-by")

  useEffect(() => console.log("Status", status), [status])

  const { loading, error, value } = useAsync(async () => {
    return new Promise<State>((resolve, reject) => {
      console.log("Start")

      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const targetTab = tabs[0]

        if (!targetTab || !targetTab?.url) return reject(new Error("No URL"))
        if (!targetTab.id) return reject(new Error("No tab ID"))

        if (!targetTab.url.match("www.youtube.com/watch"))
          return reject(new Error("Not a YouTube video"))

        let loop = true
        while (loop) {
          chrome.tabs.sendMessage(
            targetTab.id,
            { type: MESSAGE_TYPE.ASK_VIDEO_INFO },
            (message) => {
              switch (message.status) {
                case "success":
                  console.log("SUCCESS", message)
                  loop = false
                  if (message.convert) setStatus(message.convert.status)

                  return resolve({
                    youtubeId: message.videoInfo.info.details.videoId,
                    info: {
                      details: message.videoInfo.info.details,
                      music: message.videoInfo.info.music,
                    },
                    isReady: message.videoInfo.isReady,
                    music: message.videoInfo.music,
                  })
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
    })
  }, [])

  // useEffect(() => {
  //   let loop = true
  //   if (status === "loading" && !loading) {
  //     ;(async () => {
  //       while (loop) {
  //         await sleep(200)
  //         chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  //           const [targetTab] = tabs
  //
  //           if (!targetTab?.id) return console.error("No tab ID")
  //
  //           chrome.tabs.sendMessage(
  //             targetTab.id,
  //             { type: MESSAGE_TYPE.DOWNLOAD_VIDEO, videoId: value.youtubeId },
  //             (message) => {
  //               setStatus(message.status)
  //             },
  //           )
  //         })
  //       }
  //     })()
  //   }
  //
  //   return () => {
  //     loop = false
  //   }
  // }, [status, loading])

  useEffect(() => console.log("Value", value), [value])

  if (loading)
    return (
      <div className="animate-spin text-3xl flex items-center justify-center py-8 w-full">
        <FaSpinner />
      </div>
    )

  if (error || !value)
    return <div className="text-xl py-5 text-center">Not a youtube video url</div>

  return value.isReady ? (
    <ReadyForm details={value.info.details} music={value.music} />
  ) : (
    <ConvertForm info={value.info} />
  )
}
export default VideoScreen
