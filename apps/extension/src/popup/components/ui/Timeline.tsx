import CardCollapse from "../common/CardCollapse"
import { ConverterMusicInfo } from "../../../../../../packages/types"
import React from "react"

interface Props {
  info: ConverterMusicInfo
}

const Timeline: React.FC<Props> = ({ info }) => {
  return (
    <CardCollapse defaultOpen={false} title="Timeline">
      <div></div>
    </CardCollapse>
  )
}

export default Timeline
