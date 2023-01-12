import { GetServerSideProps, Page, TUser } from "types"
import { Outlet } from "react-router-dom"
import useAuthStore from "client/stores/auth"

interface Props {
}

const serverSideProps: GetServerSideProps<{ props: Props }> = (request, reply) => {
  if (!request.session.isLogin) return reply.redirect("/auth/login")
}

const ProtectedLayout: Page<Props> = () => {
  const user = useAuthStore(state => state.user as TUser)


  return (<div>
    <div className="bg-gray-200 w-full h-[50px]">
      <h2>{user.name}</h2>
    </div>

    <Outlet />
  </div>)
}

ProtectedLayout.serverSideProps = serverSideProps

export default ProtectedLayout
