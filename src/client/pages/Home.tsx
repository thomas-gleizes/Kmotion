import { GetServerSideProps } from "types"
import { Playlist } from "@prisma/client"

import prisma from "services/prisma"

interface Props {
  playlist: Playlist
}

export const serverSideProps: GetServerSideProps<{ props: Props }> = async (request, reply) => {
  if (!request.session.isLogin) return void reply.redirect("/login")

  const playlist = await prisma.playlist.findMany({
    where: { authorId: request.session.user.id }
  })

  return { playlist }
}

const HomaPage: Component<Props> = ({ playlist }) => {
  return (
    <div>
      <h1>Accueille</h1>
    </div>
  )
}

export default HomaPage
