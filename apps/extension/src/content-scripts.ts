import { MESSAGE_TYPE } from "./resources/constants"
import { fetchVideoInfo } from "./utils/api"

console.log("CONTENT SCRIPT")
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("Message.type", message.type)

  switch (message.type) {
    case MESSAGE_TYPE.ASK_FETCH_VIDEO_INFO:
      fetchVideoInfo(message.videoId).then((response) => sendResponse(response.data))
  }
})
