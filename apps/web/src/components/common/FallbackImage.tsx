import React from "react"

const FallbackImage: Component = () => {
  return (
    <div className="rounded-lg shadow-lg bg-neutral-200 animate-pulse">
      <img className="w-full opacity-0" src="/images/placeholder.png" alt="placeholder" />
    </div>
  )
}

export default FallbackImage
