import { Link } from "react-router-dom"

import { Page } from "types"
import useAuthStore from "client/stores/auth"
import { useEffect } from "react"

const NotFound: Page = (...props) => {
  useEffect(() => console.log("Props", props), [props])

  const isLogin = useAuthStore((store) => store.isLogin)

  return (
    <div className="w-full h-full flex flex-col justify-center items-center space-y-3">
      <div>
        <h1>Erreur 404 - Page introuvable </h1>
      </div>
      <div>
        <Link
          to={isLogin ? "/app/home" : "/auth/login"}
          className="bg-gradient-to-br from-blue-700 to-blue-800 px-3 py-1 text-white font-semibold rounded shadow-md transition transform hover:scale-105 hover:shadow-xl"
        >
          Retour a l'accueille
        </Link>
      </div>
    </div>
  )
}

export default NotFound
