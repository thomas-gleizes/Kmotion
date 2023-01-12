import useAuthStore from "client/stores/auth"
import { Outlet } from "react-router-dom"
import { Page } from "types"

const Layout: Page = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black">
      <div
        className="fixed top-0 left-0 w-[200px] h-[50px] bg-white"
        onClick={() => fetch("/api/v1/auth/logout")}
      />
      <div className="max-w-[375px] max-h-[560px] w-full h-full relative z-0 border bg-white">
        {user && (
          <div className="w-full text-center text-red-500 bg-gradient-to-br from-slate-100 to-blue-50">
            {user.name}
          </div>
        )}
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
