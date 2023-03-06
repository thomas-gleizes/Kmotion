import React from "react"
import { Link } from "@tanstack/react-router"
import { FaList, FaMusic, FaSlidersH } from "react-icons/all"

const NavBar = () => {
  return (
    <div className="bg-black bg-opacity-90 pb-2 backdrop-blur rounded-b-2xl">
      <div className="h-full flex justify-evenly items-center py-4">
        <div>
          <Link to="/musics/playlists">
            <i className="text-2xl font-bolder text-red-800 cursor-pointer">
              <FaMusic />
            </i>
          </Link>
        </div>
        <div>
          <Link to="/app/playlists">
            <i className="text-2xl font-bolder text-red-800 cursor-pointer">
              <FaList />
            </i>
          </Link>
        </div>
        <div>
          <Link to="app/settings">
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
