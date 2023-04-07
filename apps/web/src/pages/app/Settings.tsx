import React from "react"
import { useRouter } from "@tanstack/react-router"

import ScrollableLayout from "../../components/layouts/ScrollableLayout"
import { useAuthenticatedContext } from "../../contexts/auth"

const Settings: Page = () => {
  const { history } = useRouter()
  const { user } = useAuthenticatedContext()

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
        {user.isAdmin && (
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
