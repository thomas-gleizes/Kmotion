import React, { FC, HTMLAttributes } from "react"
import { useRouterContext } from "../../contexts/router"

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "href" | "onClick"> {
  to: string
}

const Link: FC<Props> = ({ to, ...rest }) => {
  const router = useRouterContext()

  const handleClick = () => {
    router.push(to)
  }

  return <div onClick={handleClick} {...rest} />
}

export default Link
