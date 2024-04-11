import React from "react"
import classnames from "classnames"
import { Link, useRouter } from "@tanstack/react-router"
import { FaMusic, FaSlidersH } from "react-icons/fa"
import { RiPlayList2Fill } from "react-icons/ri"
import { FaGauge } from "react-icons/fa6"

import { usePlayerContext } from "../../contexts/player"
import { useAuthenticatedContext } from "../../contexts/auth"

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
  const { user } = useAuthenticatedContext()

  return (
    <div className="z-[1000] h-footer transition backdrop-blur-xl bg-secondary/50">
      <div className="h-full flex justify-evenly items-center">
        <div>
          <NavLink to="/app/musics">
            <FaMusic />
          </NavLink>
        </div>
        <div>
          <NavLink to="/app/playlists">
            <RiPlayList2Fill />
          </NavLink>
        </div>
        <div>
          <NavLink to="/app/settings">
            <FaSlidersH />
          </NavLink>
        </div>
        {user.isAdmin && (
          <div>
            <NavLink to="/admin">
              <FaGauge />
            </NavLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar
