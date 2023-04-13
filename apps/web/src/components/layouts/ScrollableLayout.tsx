import React, { Ref } from "react"
import SimpleBar from "simplebar-react"

interface Props {
  simpleBarRef?: Ref<any> | undefined
}

const ScrollableLayout: ComponentWithChild<Props> = ({ children, simpleBarRef }) => {
  return (
    <SimpleBar ref={simpleBarRef} className="max-h-screen mt-header pb-56">
      {children}
    </SimpleBar>
  )
}

export default ScrollableLayout
