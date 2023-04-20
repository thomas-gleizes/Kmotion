import React, { Ref } from "react"
import ScrollableContainer from "./ScrollableContainer"

interface Props {
  simpleBarRef?: Ref<any> | undefined
}

const ScrollableLayout: ComponentWithChild<Props> = ({ children }) => {
  return (
    <ScrollableContainer className="max-h-screen mt-header pb-56">{children}</ScrollableContainer>
  )
}

export default ScrollableLayout
