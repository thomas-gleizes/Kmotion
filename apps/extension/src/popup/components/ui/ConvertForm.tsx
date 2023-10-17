import React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { ConvertMusicBodyDto } from "@kmotion/validations"
import { ConvertedMusic, ConverterMusicDetails } from "@kmotion/types"
import CoverChoice from "./CoverChoice"
import Timeline from "./Timeline"
import MetaData from "./MetaData"
import { MESSAGE_TYPE } from "../../../resources/constants"

interface Props {
  info: { details: ConverterMusicDetails; music: ConvertedMusic }
}

const ConvertForm: React.FC<Props> = ({ info }) => {
  const formMethods = useForm<ConvertMusicBodyDto>({
    defaultValues: {
      metadata: {
        title: info.details.media?.song || info.details.title || "",
        artist: info.details.media?.artist || info.details.author?.name || "",
      },
      cover: {
        type: "classic",
        value: info.details.thumbnails.at(-1)?.url,
      },
      timeline: {
        start: 0,
        end: +info.details.lengthSeconds,
      },
    },
  })

  const onSubmit = (values: ConvertMusicBodyDto) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const [targetTab] = tabs

      if (!targetTab?.id) return console.error("No tab ID")

      chrome.tabs.sendMessage(
        targetTab.id,
        { type: MESSAGE_TYPE.CONVERT_VIDEO, data: { videoId: info.details.videoId, ...values } },
        (message) => {
          console.log("submit response", message)
        },
      )
    })
  }

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex flex-col space-y-2 px-2">
      <FormProvider {...formMethods}>
        <MetaData details={info.details} />
        <CoverChoice details={info.details} />
        <Timeline details={info.details} />
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
