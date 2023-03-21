import React from "react"
import { Link } from "@tanstack/react-router"
import { FaList, FaMusic, FaSlidersH } from "react-icons/all"
import { usePlayerContext } from "../../contexts/player"

const NavBar = () => {
  const { fullscreen } = usePlayerContext()

  return (
    <div className="bg-secondary backdrop-blur bg-opacity-70 pb-2 rounded-b-2xl">
      <div className="h-full flex justify-evenly items-center py-4">
        <div>
          <Link to="/app/musics" onClick={() => fullscreen.toggle(false)}>
            <i className="text-2xl font-bolder text-red-800 cursor-pointer">
              <FaMusic />
            </i>
          </Link>
        </div>
        <div>
          <Link to="/app/playlists" onClick={() => fullscreen.toggle(false)}>
            <i className="text-2xl font-bolder text-red-800 cursor-pointer">
              <FaList />
            </i>
          </Link>
        </div>
        <div>
          <Link to="/app/settings" onClick={() => fullscreen.toggle(false)}>
            <i className="text-2xl font-bolder text-red-800 cursor-pointer">
              <FaSlidersH />
            </i>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NavBar
