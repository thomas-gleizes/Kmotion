import React, { HTMLAttributes, useRef } from "react"
import SimpleBar from "simplebar-react"

const ScrollableContainer: ComponentWithChild<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const height = ref.current?.clientHeight ?? 0

  return (
    <div ref={ref} {...props}>
      <SimpleBar style={{ maxHeight: `${height}px` }}>{children}</SimpleBar>
    </div>
  )
}

export default ScrollableContainer
