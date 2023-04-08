import React from "react"
import Link from "../components/common/Link"
import { routes } from "../routes"

const LoginScreen: React.FC = () => {
  return (
    <div>
      <h1>LOGIN</h1>
      <Link to={routes.convert.name}>
        <button className="px-9 m-4 bg-red-600 text-white rounded-lg text-xl">CONVERT</button>
      </Link>{" "}
    </div>
  )
}

export default LoginScreen
