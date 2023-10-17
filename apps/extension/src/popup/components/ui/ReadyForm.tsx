import React from "react"
import { ConverterMusicDetails, IMusic } from "@kmotion/types"
import CardCollapse from "../common/CardCollapse"
import { FaCheck, FaDownload } from "react-icons/fa"
import { MESSAGE_TYPE } from "../../../resources/constants"

interface Props {
  music: IMusic
  details: ConverterMusicDetails
}

const ReadyForm: React.FC<Props> = ({ details, music }) => {
  console.log("Music", music)

  if (!music) return "pas ok"

  const handleDownload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([targetTab]) => {
      if (!targetTab?.id) return console.error("No tab ID")

      chrome.tabs.sendMessage(
        targetTab.id,
        { type: MESSAGE_TYPE.DOWNLOAD_VIDEO, data: { music } },
        (message) => {
          console.log("submit response", message)
        },
      )
    })
  }

  return (
    <div className="flex flex-col space-y-2 px-2">
      <CardCollapse title="MetaData">
        <div className="flex flex-col space-y-1 items-baseline">
          <div className="flex justify-between items-center w-full text-xs">
            <p>
              ID: <span className="text-blue-950">{details.videoId}</span>
            </p>
            <span className="text-lg text-green-500">
              <FaCheck />
            </span>
          </div>
          <div className="text-xs">
            <p>
              Titre: <span>{music.title}</span>
            </p>
          </div>
          <div className="text-xs">
            <p>
              Artist: <span>{music.artist}</span>
            </p>
          </div>
          <div>
            <div>
              <span className="font-semibold text-gray-800">Durée : </span>
              <span className={+details.lengthSeconds > 480 ? "text-red-600" : ""}>
                {(music.duration / 100).toFixed(0)}s
              </span>
            </div>
          </div>
        </div>
      </CardCollapse>
      <div className="w-full">
        <button
          onClick={handleDownload}
          type="button"
          className="py-1.5 flex items-center justify-center space-x-3 bg-gradient-to-bl rounded-md from-blue-800 to-gray-800 shadow-lg hover:shadow-xl hover:scale-105 active:hover:shadow-md active:scale-95 disabled:from-gray-500 disabled:to-gray-600 transform transition text-white w-full text-xl font-medium"
        >
          Download <FaDownload />
        </button>
      </div>
    </div>
  )
}

export default ReadyForm
