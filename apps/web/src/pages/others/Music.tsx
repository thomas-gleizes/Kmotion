import React from "react"
import { Navigate, useParams } from "@tanstack/react-router"

import ByPassMusic from "../../components/common/Music/ByPassMusic"

const MusicPage: Page = () => {
  const { token } = useParams()

  if (!token) return <Navigate to="/" />

  return <ByPassMusic token={token} />
}

export default MusicPage
