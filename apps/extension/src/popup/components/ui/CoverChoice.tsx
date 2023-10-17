import React, { useRef, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import classnames from "classnames"

import { ConverterMusicDetails } from "@kmotion/types"
import { ConvertMusicBodyDto } from "@kmotion/validations"
import CardCollapse from "../common/CardCollapse"

interface Props {
  details: ConverterMusicDetails
}

const CoverChoice: React.FC<Props> = ({ details }) => {
  const methods = useFormContext<ConvertMusicBodyDto>()

  const inputFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputFileRef.current) {
      inputFileRef.current.addEventListener("change", (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            methods.setValue("cover", { type: "custom", value: reader.result as string })
          }
        }
      })
    }
  }, [])

  const field = methods.getValues()?.cover

  return (
    <CardCollapse title="Couverture" defaultOpen={true}>
      <>
        <div className="py-1">
          {details.thumbnails && (
            <img width={130} className="mx-auto shadow" src={field.value} alt="cover" />
          )}
        </div>
        <div className="grid grid-cols-2 px-0.5 py-1">
          {details.thumbnails?.map((cover, index) => (
            <div key={index} className="my-0.5 w-11/12 mx-auto">
              <button
                onClick={() => methods.setValue("cover", { type: "classic", value: cover.url })}
                className={classnames(
                  "border w-full rounded text-sm shadow-sm transform hover:scale-105 hover:shadow-md duration-75",
                  field?.value === cover.url
                    ? "text-white bg-gradient-to-bl from-blue-600 to-blue-800"
                    : "bg-gray-100",
                )}
              >
                {cover?.width}x{cover?.height}
              </button>
            </div>
          ))}
        </div>
      </>
    </CardCollapse>
  )
}

export default CoverChoice
