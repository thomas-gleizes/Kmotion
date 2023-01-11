import React from "react"
import { Link } from "react-router-dom"

interface Props {}

const HomaPage: Component<Props> = ({}) => {
  return (
    <div>
      <h1>Accueille</h1>
      <Link to="/home"></Link>
    </div>
  )
}

export default HomaPage
