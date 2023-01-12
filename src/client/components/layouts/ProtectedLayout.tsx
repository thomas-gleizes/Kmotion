import { GetServerSideProps, Page } from "types"
import { Outlet } from "react-router-dom"

interface Props {}

const serverSideProps: GetServerSideProps<{ props: Props }> = (request, reply) => {
  if (!request.session.isLogin) return reply.redirect("/auth/login")
}

const ProtectedLayout: Page<Props> = () => {
  return <Outlet />
}

ProtectedLayout.serverSideProps = serverSideProps

export default ProtectedLayout
