declare type Component<Props = {}> = React.FC<Props>
declare type ReactNode = React.ReactNode

declare module "types" {
  import { FastifyReply, FastifyRequest } from "fastify"
  import { User } from "@prisma/client"

  interface Parameter {
    props?: any
    params?: any
    query?: any
  }

  type ServerSideProps<P extends Parameter = {}> = (
    request: FastifyRequest<{ Params: P["params"]; Query: P["query"]; Body: null }>,
    reply: FastifyReply
  ) => Promise<P["props"]> | P["props"]

  type Route = {
    path: string
    component: Component
    serverSideProps?: ServerSideProps
  }

  type TUser = Omit<User, "password">
}
