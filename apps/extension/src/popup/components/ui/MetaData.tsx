import React from "react"
import { useFormContext } from "react-hook-form"

import { YoutubeInfo } from "@kmotion/types"
import { ConvertMusicBodyDto } from "@kmotion/validations"
import CardCollapse from "../common/CardCollapse"

interface Props {
  details: YoutubeInfo
}

const MetaData: React.FC<Props> = ({ details }) => {
  const methods = useFormContext<ConvertMusicBodyDto>()

  return (
    <CardCollapse title="MetaData">
      <div className="flex flex-col space-y-1 divide-y divide-blue-200">
        <div className="flex justify-between items-center text-xs">
          <p>
            ID: <span className="text-blue-950">{details.id}</span>
          </p>
        </div>
        <div className="text-xs">
          <p>
            Titre: <input {...methods.register("metadata.title")} className="outline-none" />
          </p>
        </div>
        <div className="text-xs">
          <p>
            Artist: <input {...methods.register("metadata.artist")} className="outline-none" />
          </p>
        </div>
        <div>
          <div>
            <span className="font-semibold text-gray-800">Durée : </span>
            <span className={+details.duration > 480 ? "text-red-600" : ""}>
              {details.duration}s
            </span>
          </div>
          <div className="text-xs text-right opacity-30">
            <p>max: 480s</p>
          </div>
        </div>
      </div>
    </CardCollapse>
  )
}

export default MetaData
