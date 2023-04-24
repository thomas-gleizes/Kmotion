import { MESSAGE_TYPE } from "./resources/constants"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("========= installed =========")

  // await chrome.storage.local.set({ [STORAGE_KEY.AUTH_TOKEN]: null })
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url) return
  const { hostname, pathname, searchParams } = new URL(changeInfo.url)

  if (hostname === "www.youtube.com" && pathname === "/watch" && searchParams.get("v")) {
    chrome.tabs.sendMessage(tabId, {
      type: MESSAGE_TYPE.SET_VIDEO_ID,
      videoId: searchParams.get("v"),
    })
  }
})
