import { MESSAGE_TYPE } from "./resources/constants"
import { ConverterMusicInfo } from "@kmotion/types"
import { fetchVideoInfo } from "./utils/api"

let videoId: string | null = null
const videoInfo: Record<
  string,
  { status: "ready" | "loading"; isDownload: boolean; info: ConverterMusicInfo }
> = {}

chrome.runtime.onInstalled.addListener(async () => {
  console.log("========= installed =========")

  // await chrome.storage.local.set({ [STORAGE_KEY.AUTH_TOKEN]: null })
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("message", message.type)

  switch (message.type) {
    case MESSAGE_TYPE.ASK_VIDEO_ID:
      sendResponse({ videoId })
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    const { hostname, pathname, searchParams } = new URL(changeInfo.url)
    if (hostname === "www.youtube.com" && pathname === "/watch" && searchParams.get("v")) {
      videoId = searchParams.get("v")

      console.log("VIDEO ID", videoId)

      if (
        videoId &&
        (typeof videoInfo[videoId] === "undefined" ||
          (videoInfo[videoId]?.status === "loading") === null)
      ) {
        videoInfo[videoId] = { status: "loading", isDownload: false, info: null }

        console.log("ASK", videoInfo)

        // ask to contentScript to fetch video info and return it because we can't fetch it from background
        chrome.runtime.sendMessage(
          { type: MESSAGE_TYPE.ASK_FETCH_VIDEO_INFO, videoId },
          (response) => {
            console.log(response)
          }
        )

        // videoInfo[videoId] = {
        //   status: "ready",
        //   isDownload: response.data.isReady,
        //   info: response.data.info,
        // }
      }
    }

    console.log("VideoInfo", videoInfo)
  }
})
