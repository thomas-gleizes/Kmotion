import React from "react"
import Link from "./Link"
import { routes } from "../../routes"

const Footer: React.FC = () => {
  return (
    <footer className="h-footer w-full bg-red-700">
      <div className="flex items-center">
        <Link
          className="text-lg text-white border-b border-transparent hover:border-gray-200"
          to={routes.login}
        >
          Login
        </Link>
        <Link
          className="text-lg text-white border-b border-transparent hover:border-gray-200"
          to={routes.convert}
        >
          Convert
        </Link>
      </div>
    </footer>
  )
}

export default Footer
