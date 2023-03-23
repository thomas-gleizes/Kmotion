import React from "react"
import SimpleBar from "simplebar-react"

const ScrollableLayout: ComponentWithChild = ({ children }) => {
  return (
    <div className="relative">
      <SimpleBar className="max-h-screen mt-header mx-4 pb-56">{children}</SimpleBar>
    </div>
  )
}

export default ScrollableLayout
