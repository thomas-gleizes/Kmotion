import React from "react"
import { useAsync } from "react-use"

import { MESSAGE_TYPE } from "../../resources/constants"

const VideoScreen = () => {
  const state = useAsync(async () => {
    const responseMessage = await new Promise((resolve) =>
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.ASK_VIDEO_ID }, resolve)
    )

    console.log("ResponseMessage", responseMessage)

    return responseMessage
  })

  return (
    <div>
      <h1 className="text-white">VIDEO</h1>
      <div className="space-y-1 divide-black"></div>
    </div>
  )
}
export default VideoScreen
