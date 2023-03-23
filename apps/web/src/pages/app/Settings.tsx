import React from "react"
import { useLayoutContext } from "../../contexts/layout"

const Settings: Page = () => {
  const layoutContext = useLayoutContext()

  return (
    <div className="relative">
      <div className="mt-header mx-2">
        <h1 className="text-center text-white">Settings</h1>

        <div className="flex flex-wrap space-x-2 my-5">
          <button
            className="btn bg-blue-400 text-black"
            onClick={() => {
              localStorage.clear()
              window.location.href = "/"
            }}
          >
            clean
          </button>
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
          <button
            onClick={() => layoutContext.mobile.toggle()}
            className="btn bg-blue-400 text-black"
          >
            {layoutContext.mobile.value ? "Desktop" : "Mobile"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
