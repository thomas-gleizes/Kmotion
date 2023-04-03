import React, { Ref } from "react"
import SimpleBar from "simplebar-react"

interface Props {
  simpleBarRef?: Ref<any> | undefined
}

const ScrollableLayout: ComponentWithChild<Props> = ({ children, simpleBarRef }) => {
  return (
    <div className="relative">
      <SimpleBar ref={simpleBarRef} className="max-h-screen mt-header mx-4 pb-56">
        {children}
      </SimpleBar>
    </div>
  )
}

export default ScrollableLayout
