import React, { HTMLAttributes } from "react"
import classnames from "classnames"

const ScrollableContainer: ComponentWithChild<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <div {...props} className={classnames(props.className, "overflow-y-auto")}>
      {children}
    </div>
  )
}

export default ScrollableContainer
