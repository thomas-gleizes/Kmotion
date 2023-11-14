import React from "react"
import { Navigate, Outlet } from "@tanstack/react-router"

import { useAuthContext } from "../../contexts/auth"
import AdminSidebar from "../../components/admin/AdminSidebar"

const AdminRoot: Component = () => {
  const authContext = useAuthContext()

  if (!authContext.authenticated) return <Navigate to="/" />
  if (!authContext.user.isAdmin) return <Navigate to="/" />

  return (
    <div className="relative flex bg-white text-black min-h-screen w-full">
      <AdminSidebar />
      <section className="w-full min-h-screen">
        <Outlet />
      </section>
    </div>
  )
}

export default AdminRoot
