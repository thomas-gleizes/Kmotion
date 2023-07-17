import React from "react"
import classnames from "classnames"

import { routes } from "../../routes"
import { useRouterContext } from "../../contexts/router"
import Link from "./Link"

const NavLink: React.FC<{ route: Route }> = ({ route }) => {
  const { current } = useRouterContext()

  const active = current.name === route.name

  return (
    <div className="">
      <Link
        tag="div"
        to={route}
        className={classnames("cursor-pointer text-white/80 text-center", active && "text-white")}
      >
        {route.name}
      </Link>
      <div
        className={classnames(
          "mx-auto h-0.5 bg-white rounded-full transition transform",
          active ? "scale-x-100" : "scale-x-0",
        )}
      ></div>
    </div>
  )
}

const Footer: React.FC = () => {
  return (
    <footer className="z-30 h-footer w-full bg-gradient-to-bl rounded-t-lg from-blue-900 to-gray-900">
      <nav className="flex items-center justify-evenly h-full">
        <NavLink route={routes.video} />
        <NavLink route={routes.test} />
        <NavLink route={routes.settings} />
      </nav>
    </footer>
  )
}

export default Footer
