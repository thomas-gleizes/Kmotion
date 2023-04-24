import React, { useState, useRef } from "react"

import { ConverterMusicInfo } from "@kmotion/types"
import CardCollapse from "../common/CardCollapse"

interface Props {
  info: ConverterMusicInfo
}

const CoverChoice: React.FC<Props> = ({ info }) => {
  const [selected, setSelected] = useState(info.thumbnails.at(-1))

  const inputFileRef = useRef<HTMLInputElement>()

  const handleChangeUploadFile = async () => {
    if (inputFileRef.current) inputFileRef.current.click()
  }

  console.log("selected", selected)

  return (
    <CardCollapse title="Couverture" defaultOpen={true}>
      <>
        <div className="py-1">
          {info.thumbnails && (
            <img
              width={130}
              className="mx-auto shadow"
              src={info.thumbnails.at(-1)?.url}
              alt="cover"
            />
          )}
        </div>
        <div className="grid grid-cols-2 px-0.5 py-1">
          {info.thumbnails?.map((cover, index) => (
            <div key={index} className="my-0.5 w-11/12 mx-auto">
              <button
                onClick={() => setSelected(cover)}
                className={`border w-full rounded text-sm shadow-sm transform hover:scale-105 hover:shadow-md duration-75 ${
                  selected === cover
                    ? "text-white bg-gradient-to-bl from-blue-600 to-blue-800"
                    : "bg-gray-100"
                }`}
              >
                {cover?.width}x{cover?.height}
              </button>
            </div>
          ))}
          <div className="my-0.5 w-11/12 mx-auto">
            <input ref={inputFileRef} type="file" className="hidden" />
            <button
              onClick={handleChangeUploadFile}
              className={
                "border w-full rounded text-sm shadow-sm transform hover:scale-105 hover:shadow-md duration-75 bg-gray-100"
              }
            >
              Importer
            </button>
          </div>
        </div>
      </>
    </CardCollapse>
  )
}

export default CoverChoice
