import React, { HTMLAttributes } from "react"
import SimpleBar from "simplebar-react"
import classnames from "classnames"

import { useLayoutStore } from "../../stores/layout"

const ScrollableContainer: ComponentWithChild<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const isMobile = useLayoutStore((store) => store.isMobile)

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
