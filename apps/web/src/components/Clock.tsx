import React, { useEffect, useState } from "react"

const Clock: Component = () => {
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm text-gray-500 font-bold">{time.toLocaleTimeString()}</div>
    </div>
  )
}

export default Clock
