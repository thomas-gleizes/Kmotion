import { MusicInfoResponse } from "@kmotion/types"

import { MESSAGE_TYPE, STORAGE_KEY } from "./resources/constants"
import { convertMusic, fetchVideoInfo, streamMusic } from "./utils/api"

let videoId: string | null = new URL(document.location.href).searchParams.get("v")
let videoInfo: MusicInfoResponse | null = null
let status = videoId ? "stand-by" : "no-video"

const convertVideos: VideoData = {}

async function run() {
  console.log("=============== KMOTION CONTENT SCRIPT ===============")

  const storage = await chrome.storage.local.get([STORAGE_KEY.AUTH_TOKEN])
  if (!storage[STORAGE_KEY.AUTH_TOKEN]) throw new Error("Content script: no auth token found")

  if (videoId) convertVideos[videoId] = { status: "stand-by", data: null }

  function fetchInfo(id: string) {
    status = "loading"
    console.log("START fetching", id)

    fetchVideoInfo(id)
      .then((response) => {
        if (response.data) {
          console.log("FETCH SUCCESS", response.data)
          videoInfo = response.data
          status = "success"
        }
      })
      .catch(() => (status = "error"))
  }

  if (status === "stand-by") fetchInfo(videoId as string)

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("ON MESSAGE", convertVideos, message)

    switch (message.type) {
      case MESSAGE_TYPE.ASK_VIDEO_INFO: {
        switch (status) {
          case "loading":
            return sendResponse({ status, videoId })
          case "success":
            return sendResponse({
              status,
              videoId,
              videoInfo,
              convert: convertVideos[videoId as string],
            })
          case "error":
            return sendResponse({ status, videoId })
          case "no-video":
            return sendResponse({ status })
        }
        break
      }
      case MESSAGE_TYPE.SET_VIDEO_ID: {
        if (typeof message.videoId === "string" && videoId !== message.videoId) {
          videoId = message.videoId
          if (typeof convertVideos[message.videoId] === "undefined")
            convertVideos[message.videoId] = { status: "stand-by", data: null }
          return fetchInfo(message.videoId)
        }
        break
      }
      case MESSAGE_TYPE.CONVERT_VIDEO: {
        console.log("CONVERT_VIDEO", convertVideos[message.data.videoId])
        const { videoId, ...payload } = message.data

        console.log("Payload,", payload)

        if (convertVideos[videoId].status === "stand-by") {
          convertVideos[videoId].status = "loading"

          convertMusic(videoId, payload)
            .then(
              (response) =>
                (convertVideos[videoId] = {
                  status: "success",
                  data: response.data,
                }),
            )
            .catch(
              (err) =>
                (convertVideos[videoId] = {
                  status: "error",
                  data: err,
                }),
            )
        }

        return "ok"
      }
      case MESSAGE_TYPE.DOWNLOAD_VIDEO: {
        console.log("DOWNLOAD")

        streamMusic(message.data.music.id)
          .then((response) => response.blob())
          .then((blob) => {
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = `${message.data.music.title}.mp3`
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })

        return sendResponse({ status: convertVideos[message.videoId].status })
      }
    }
  })
}

run().catch((error) => console.log("Kmotion ct ERROR", error))
