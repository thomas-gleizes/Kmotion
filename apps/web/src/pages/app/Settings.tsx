import React from "react"
import { useRouter } from "@tanstack/react-router"

import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import { useAuthContext } from "../../contexts/auth"

const Settings: Page = () => {
  const { history } = useRouter()
  const authContext = useAuthContext()

  return (
    <ScrollableLayout>
      <h1 className="text-center text-white pt-3">Settings</h1>
      <div className="flex flex-wrap space-x-2 my-5">
        <button
          className="btn bg-blue-400 text-black"
          onClick={() => {
            localStorage.clear()
            history.push("/", null)
          }}
        >
          Disconnect
        </button>
        {authContext.authenticated && authContext.user.isAdmin && (
          <button
            className="btn bg-blue-400 text-black"
            onClick={() => {
              fetch("/api/v1/musics/sync")
                .then((response) => response.json())
                .then(console.log)
                .catch(console.error)
            }}
          >
            sync
          </button>
        )}
      </div>
    </ScrollableLayout>
  )
}

export default Settings
