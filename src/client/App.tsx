import React from "react"
import { Routes, Route } from "react-router-dom"
import routes from "client/routes"

const App = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={<route.page />} />
      ))}
    </Routes>
  )
}

export default App
