import React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { ConvertMusicBodyDto } from "@kmotion/validations"
import { ConverterMusicInfo } from "@kmotion/types"
import CoverChoice from "./CoverChoice"
import Timeline from "./Timeline"
import MetaData from "./MetaData"

interface Props {
  info: ConverterMusicInfo
  ready: boolean
}

const ConvertForm: React.FC<Props> = ({ info, ready }) => {
  const formMethods = useForm<ConvertMusicBodyDto>({
    defaultValues: {
      metadata: {
        title: info.media?.song || info.title || "",
        artist: info.media?.artist || info.author?.name || "",
      },
      cover: {
        type: "classic",
        value: info.thumbnails.at(-1)?.url,
      },
      timeline: {
        start: 0,
        end: +info.lengthSeconds,
      },
    },
  })

  const onSubmlit = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const [targetTab] = tabs

      if (!targetTab?.id) return console.error("No tab ID")
    })
  }

  return (
    <form className="flex flex-col space-y-2 px-2">
      <FormProvider {...formMethods}>
        <MetaData info={info} isReady={ready} />
        <CoverChoice info={info} />
        <Timeline info={info} />
        <div className="w-full">
          <button
            type="submit"
            className="py-1.5 flex items-center justify-center bg-gradient-to-bl rounded-md from-blue-800 to-gray-800 shadow-lg hover:shadow-xl hover:scale-105 active:hover:shadow-md active:scale-95 disabled:from-gray-500 disabled:to-gray-600 transform transition text-white w-full text-xl font-medium"
          >
            Convertir
          </button>
        </div>
      </FormProvider>
    </form>
  )
}

export default ConvertForm
