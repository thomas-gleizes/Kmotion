import React from "react"
import classnames from "classnames"
import { Link, useRouter } from "@tanstack/react-router"
import { FaList, FaMusic, FaSlidersH } from "react-icons/all"

import { usePlayerContext } from "../../contexts/player"
import { useLayoutContext } from "../../contexts/layout"

const NavLink: ComponentWithChild<{ to: string }> = ({ to, children }) => {
  const { fullscreen } = usePlayerContext()
  const router = useRouter()

  const active = router.history.location.pathname === to

  return (
    <Link to={to} onClick={() => fullscreen.toggle(false)}>
      <span
        className={classnames("text-2xl cursor-pointer", active ? "text-red-700" : "text-white/80")}
      >
        {children}
      </span>
    </Link>
  )
}

const NavBar: Component = () => {
  const { mobile } = useLayoutContext()
  const { fullscreen } = usePlayerContext()

  return (
    <div
      className={classnames(
        "bg-secondary z-[1000] h-footer backdrop-blur-lg",
        fullscreen.value ? "bg-opacity-30" : "bg-opacity-80",
        { "rounded-b-2xl": !mobile.value }
      )}
    >
      <div className="h-full flex justify-evenly items-center">
        <div>
          <NavLink to="/app/musics">
            <FaMusic />
          </NavLink>
        </div>
        <div>
          <NavLink to="/app/playlists">
            <FaList />
          </NavLink>
        </div>
        <div>
          <NavLink to="/app/settings">
            <FaSlidersH />
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default NavBar
