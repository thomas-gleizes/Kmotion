import React from "react"
import Link from "./Link"
import { routes } from "../../routes"
import { useAuthentificatedContext } from "../../contexts/auth"

const Footer: React.FC = () => {
  const { logout } = useAuthentificatedContext()

  return (
    <footer className="h-footer absolute bottom-0 w-full bg-black/30 backdrop-blur-lg">
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

        <div>
          <button onClick={logout}>logout</button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
