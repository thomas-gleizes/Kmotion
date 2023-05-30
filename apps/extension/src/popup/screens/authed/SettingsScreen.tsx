import React from "react"
import { useAuthenticatedContext } from "../../contexts/auth"

const SettingsScreen: React.FC = () => {
  const { logout } = useAuthenticatedContext()

  return (
    <div>
      <h1 className="my-3 text-center">Settings</h1>

      <button onClick={logout} className="bg-blue-800 text-white text-lg px-4 py-2">
        Déconnexion
      </button>
    </div>
  )
}

export default SettingsScreen
