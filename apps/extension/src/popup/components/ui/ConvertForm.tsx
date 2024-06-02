import React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { ConvertMusicBodyDto } from "@kmotion/validations"
import { Track, YoutubeInfo } from "@kmotion/types"
import CoverChoice from "./CoverChoice"
import Timeline from "./Timeline"
import MetaData from "./MetaData"
import { MESSAGE_TYPE } from "../../../resources/constants"

interface Props {
  details: { info: YoutubeInfo; track: Track }
}

const ConvertForm: React.FC<Props> = ({ details }) => {
  const formMethods = useForm<ConvertMusicBodyDto>({
    defaultValues: {
      metadata: {
        title: details.track.title,
        artist: details.track.artist,
      },
      cover: {
        type: "classic",
        value: details.info.thumbnails[0].url,
      },
      timeline: {
        start: 0,
        end: details.info.duration,
      },
    },
  })

  const onSubmit = (values: ConvertMusicBodyDto) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const [targetTab] = tabs

      if (!targetTab?.id) return console.error("No tab ID")

      chrome.tabs.sendMessage(
        targetTab.id,
        { type: MESSAGE_TYPE.CONVERT_VIDEO, data: { videoId: details.info.id, ...values } },
        (message) => {
          console.log("submit response", message)
        },
      )
    })
  }

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex flex-col space-y-2 px-2">
      <FormProvider {...formMethods}>
        <MetaData details={details.info} />
        <CoverChoice details={details.info} />
        <Timeline details={details.info} />
        <div className="w-full">
          <button
            type="submit"
            className="py-1.5 flex items-center justify-center bg-gradient-to-bl rounded-md from-blue-800 to-gray-800 shadow-lg hover:shadow-xl hover:scale-105 active:hover:shadow-md active:scale-95 disabled:from-gray-500 disabled:to-gray-600 transform transition text-white w-full text-xl font-medium"
          >
            Convert
          </button>
        </div>
      </FormProvider>
    </form>
  )
}

export default ConvertForm
