import React from "react"
import classnames from "classnames"

interface Props {
  color: "dark" | "light"
}

const Header: React.FC<Props> = ({ color = "light" }) => {
  return (
    <div
      className={classnames(
        "z-40 flex items-center w-full h-header rounded-b-lg shadow-lg",
        color === "light" ? "bg-neutral-200" : "bg-gradient-to-bl from-blue-900 to-gray-900",
      )}
    >
      <div className="h-full w-full flex items-baseline justify-evenly px-2 py-1">
        <h1
          className={classnames(
            "text-2xl font-semibold",
            color === "light"
              ? "text-transparent bg-clip-text bg-gradient-to-bl rounded-t-lg from-blue-700 to-blue-800"
              : "text-white",
          )}
        >
          K'motion
        </h1>
        <p className={classnames(color === "light" ? "text-black/70" : "text-gray-200")}>
          v0.0.1-dev
        </p>
      </div>
    </div>
  )
}

export default Header
