import React from "react"
import { Link } from "react-router-dom"

interface Props {}
const AboutPage: Component<Props> = () => {
  return (
    <div>
      <h1>About page</h1>
      <Link to="/">Home</Link>
    </div>
  )
}

export default AboutPage
