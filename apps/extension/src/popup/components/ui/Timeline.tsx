import React from "react"

import { ConverterMusicInfo } from "@kmotion/types"
import CardCollapse from "../common/CardCollapse"
import { useFormContext } from "react-hook-form"
import { ConvertMusicBodyDto } from "@kmotion/validations"
import { FaMinus, FaPlus } from "react-icons/all"

interface Props {
  info: ConverterMusicInfo
}

const Timeline: React.FC<Props> = ({ info }) => {
  const methods = useFormContext<ConvertMusicBodyDto>()

  const field = methods.getValues()?.timeline

  const duration = field.end - field.start

  return (
    <CardCollapse defaultOpen={false} title="Timeline">
      <div>
        <div>
          <div className="font-semibold text-gray-800">Durée video : {info.lengthSeconds} </div>
          <div className="font-semibold text-gray-800">Durée selectionnée : {duration} </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div>
            <span>
              <FaMinus
                onClick={() => methods.setValue("timeline.start", field.start - 1)}
                onDoubleClick={() => methods.setValue("timeline.start", field.start - 10)}
              />
            </span>
            <span className="font-semibold text-gray-800">{field?.start}</span>
            <span
              onClick={() => methods.setValue("timeline.start", field.start + 1)}
              onDoubleClick={() => methods.setValue("timeline.start", field.start + 10)}
            >
              <FaPlus />
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-800">{field?.end}</span>
          </div>
        </div>
        <div className="bg-gray-200 h-3 w-full">
          <div
            style={{ width: "33%" }}
            className="bg-gradient-to-r from-blue-800 to-gray-800 h-full"
          />
        </div>
      </div>
    </CardCollapse>
  )
}

export default Timeline
