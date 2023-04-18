import React from "react"

import { ConverterMusicInfo } from "@kmotion/types"
import CardCollapse from "../common/CardCollapse"
import { FaCheck } from "react-icons/all"

interface Props {
  info: ConverterMusicInfo
  isReady: boolean
}

const MetaData: React.FC<Props> = ({ info, isReady }) => {
  return (
    <CardCollapse title="MetaData">
      <div className="flex flex-col space-y-1 divide-y divide-blue-950">
        <div className="flex justify-between items-center text-xs">
          <p>
            ID: <span className="text-blue-950">{info.videoId}</span>
          </p>
          {isReady && (
            <span className="text-lg text-green-500">
              <FaCheck />
            </span>
          )}
        </div>
        <div className="text-xs">
          <p>
            Titre: <input value={info.media?.song || info.title} />
          </p>
        </div>
        <div className="text-xs">
          <p>
            Artist: <input value={info.media?.artist || info.author?.name} />
          </p>
        </div>
        <div>
          <div>
            <span className="font-semibold text-gray-800">Durée : </span>
            <span className={+info.lengthSeconds > 480 ? "text-red-600" : ""}>
              {info.lengthSeconds}s
            </span>
          </div>
          <div className="text-xs opacity-30">
            <p>max: 480s</p>
          </div>
        </div>
      </div>
    </CardCollapse>
  )
}

export default MetaData
