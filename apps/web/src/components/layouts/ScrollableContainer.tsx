import React, { HTMLAttributes, useRef } from "react"
import SimpleBar from "simplebar-react"

const ScrollableContainer: ComponentWithChild<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} {...props}>
      <SimpleBar className="h-[10%]">{children}</SimpleBar>
    </div>
  )
}

export default ScrollableContainer
