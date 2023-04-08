import Link from "../components/common/Link"
import { routes } from "../routes"
import React from "react"

const VideoScreen = () => {
  return (
    <div>
      <h1>VIDEO</h1>
      <Link to={routes.login.name}>
        <button className="px-9 m-4 bg-red-600 text-white rounded-lg text-xl">Login</button>
      </Link>
    </div>
  )
}
export default VideoScreen
