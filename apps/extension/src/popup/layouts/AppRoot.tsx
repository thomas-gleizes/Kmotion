import { Outlet } from "@tanstack/react-router"

const AppRoot: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AppRoot
