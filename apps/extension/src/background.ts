import { MESSAGE_TYPE, STORAGE_KEY } from "./resources/constants"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("========= installed =========")

  // await chrome.storage.local.set({ [STORAGE_KEY.AUTH_TOKEN]: null })
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("message", message.type)

  switch (message.type) {
    case MESSAGE_TYPE.ASK_SESSION:
      sendResponse({ session: await chrome.storage.local.get(STORAGE_KEY.AUTH_TOKEN) })
  }
})
