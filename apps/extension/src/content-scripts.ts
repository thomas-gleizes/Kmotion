import { MusicInfoResponse } from "@kmotion/types"

import { MESSAGE_TYPE, STORAGE_KEY } from "./resources/constants"
import { fetchVideoInfo } from "./utils/api"

async function run() {
  console.log("=============== KMOTION CONTENT SCRIPT ===============")

  const storage = await chrome.storage.local.get([STORAGE_KEY.AUTH_TOKEN])

  if (!storage[STORAGE_KEY.AUTH_TOKEN]) throw new Error("Content script: no auth token found")

  const videoId = new URL(document.location.href).searchParams.get("v")
  let requestVideoInfo: Promise<MusicInfoResponse> | null = null

  if (videoId) {
    requestVideoInfo = fetchVideoInfo(videoId).then((response) => response.data)
  }

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.type) {
      case MESSAGE_TYPE.ASK_VIDEO_INFO: {
        if (requestVideoInfo === null) {
          return sendResponse({ music: null, isReady: false, info: null })
        }
        const response = await requestVideoInfo

        chrome.runtime.sendMessage({
          type: MESSAGE_TYPE.REPLY_VIDEO_INFO,
          data: {
            music: response.music,
            isReady: response.isReady,
            info: response.info,
          },
        })
      }
    }
  })
}

run().catch((error) => console.log("Kmotion ct ERROR", error))
