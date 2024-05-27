import React from "react"
import { Navigate, Outlet } from "@tanstack/react-router"
import classnames from "classnames"
import { useToggle } from "react-use"

import { useAuthContext } from "../../contexts/auth"
import AdminSidebar from "../../components/admin/AdminSidebar"

const AdminRoot: Component = () => {
  const authContext = useAuthContext()

  const [sidebarExtended, setSidebarExtended] = useToggle(true)

  if (!authContext.authenticated) return <Navigate to="/" />
  if (!authContext.user.isAdmin) return <Navigate to="/" />

  return (
    <div className="relative flex bg-white text-black min-h-screen w-full">
      <div
        className={classnames(
          "top-0 py-2 bg-slate-800 text-white border-r-2 fixed h-screen transition-all ease-in-out duration-200 overflow-hidden",
          sidebarExtended ? "w-64 px-4" : "w-12 px-2",
        )}
      >
        <AdminSidebar extend={{ value: sidebarExtended, toggle: setSidebarExtended }} />
      </div>
      <section
        className={classnames(
          "w-full transition overflow-auto bg-gray-100 p-2",
          sidebarExtended ? "ml-64" : "ml-12",
        )}
      >
        <Outlet />
      </section>
    </div>
  )
}

export default AdminRoot
