import React, { HTMLAttributes } from "react"
import SimpleBar from "simplebar-react"

import { useLayoutContext } from "../../contexts/layout"
import classnames from "classnames"

const ScrollableContainer: ComponentWithChild<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const { isMobile } = useLayoutContext()

  if (isMobile) {
    return (
      <div {...props} className={classnames(props.className, "overflow-y-auto")}>
        {children}
      </div>
    )
  }

  return <SimpleBar className={props.className}>{children}</SimpleBar>
}

export default ScrollableContainer
