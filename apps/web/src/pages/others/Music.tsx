import React from "react"
import { Navigate, useParams } from "@tanstack/react-router"

import ByPassMusic from "../../components/common/Music/ByPassMusic"

const MusicPage: Page = () => {
  const params = useParams({ from: "/out/bypass/$token" })

  if (!params.token) return <Navigate to="/" />

  return <ByPassMusic token={params.token} />
}

export default MusicPage
