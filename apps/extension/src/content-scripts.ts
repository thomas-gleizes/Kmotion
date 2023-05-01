import { MusicInfoResponse } from "@kmotion/types"

import { MESSAGE_TYPE, STORAGE_KEY } from "./resources/constants"
import { downloadMusic, fetchVideoInfo } from "./utils/api"

let videoId: string | null = new URL(document.location.href).searchParams.get("v")
let videoInfo: MusicInfoResponse | null = null
let status = videoId ? "stand-by" : "no-video"

let convertVideos: VideoData = {}

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
          console.log("FETCH SUCCESS", response.data.info.title)
          videoInfo = response.data
          status = "success"
        }
      })
      .catch(() => (status = "error"))
  }

  if (status === "stand-by") fetchInfo(videoId as string)

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("ConvertVideos", convertVideos)
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
      }
      case MESSAGE_TYPE.SET_VIDEO_ID: {
        if (typeof message.videoId === "string" && videoId !== message.videoId) {
          videoId = message.videoId
          if (!convertVideos.hasOwnProperty(message.videoId))
            convertVideos[message.videoId] = { status: "stand-by", data: null }
          return fetchInfo(message.videoId)
        }
        break
      }
      case MESSAGE_TYPE.CONVERT_VIDEO: {
        if (convertVideos[message.videoId].status === "stand-by") {
          convertVideos[message.videoId].status = "loading"

          downloadMusic(message.videoId)
            .then(
              (response) =>
                (convertVideos[message.videoId] = {
                  status: "success",
                  data: response.data,
                })
            )
            .catch(
              (err) =>
                (convertVideos[message.videoId] = {
                  status: "error",
                  data: err,
                })
            )
        }

        return sendResponse({ status: convertVideos[message.videoId].status })
      }
    }
  })
}

run().catch((error) => console.log("Kmotion ct ERROR", error))
