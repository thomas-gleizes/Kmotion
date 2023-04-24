import { MusicInfoResponse } from "@kmotion/types"

import { MESSAGE_TYPE, STORAGE_KEY } from "./resources/constants"
import { fetchVideoInfo } from "./utils/api"

async function run() {
  console.log("=============== KMOTION CONTENT SCRIPT ===============")

  const storage = await chrome.storage.local.get([STORAGE_KEY.AUTH_TOKEN])

  if (!storage[STORAGE_KEY.AUTH_TOKEN]) throw new Error("Content script: no auth token found")

  let videoId: string | null = new URL(document.location.href).searchParams.get("v")
  let videoInfo: MusicInfoResponse | null = null
  let status = videoId ? "stand-by" : "no-video"

  function fetchInfo(videoId: string) {
    status = "loading"

    fetchVideoInfo(videoId)
      .then((response) => {
        videoInfo = response.data
        status = "success"
      })
      .catch(() => (status = "error"))
  }

  if (status === "stand-by") fetchInfo(videoId as string)

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.type) {
      case MESSAGE_TYPE.ASK_VIDEO_INFO: {
        switch (status) {
          case "loading":
            return sendResponse({ status, videoId })
          case "success":
            return sendResponse({ status, videoId, videoInfo })
          case "error":
            return sendResponse({ status, videoId })
          case "no-video":
            return sendResponse({ status })
        }
      }
      case MESSAGE_TYPE.SET_VIDEO_ID: {
        if (typeof videoId === "string") fetchInfo(message.videoId)
      }
    }
  })
}

run().catch((error) => console.log("Kmotion ct ERROR", error))
