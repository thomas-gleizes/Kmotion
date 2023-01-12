import { Outlet } from "react-router-dom"
import { GetServerSideProps, Page } from "types"

interface Props {}

const serverSideProps: GetServerSideProps<{ props: Props }> = (request, reply) => {
  if (request.session.isLogin) return reply.redirect("/app/home")

  return { success: true }
}

const AuthLayout: Page<Props> = () => {
  return <Outlet />
}

AuthLayout.serverSideProps = serverSideProps

export default AuthLayout
