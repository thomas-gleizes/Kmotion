import React, { ElementType, FC, HTMLAttributes } from "react"
import { useRouterContext } from "../../contexts/router"

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  to: Route
  tag: ElementType
}

const Link: FC<Props> = ({ to, tag = "div", ...rest }) => {
  const router = useRouterContext()

  const handleClick = () => {
    router.push(to)
  }

  const Tag = tag

  return <Tag onClick={handleClick} {...rest} />
}

export default Link
