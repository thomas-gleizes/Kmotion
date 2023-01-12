declare type Component<Props = undefined> = React.FC<Props>
declare type ReactNode = React.ReactNode

declare module "types" {
  import { FastifyReply, FastifyRequest } from "fastify"
  import { User } from "@prisma/client"

  interface Parameter {
    props?: any
    params?: any
    query?: any
  }

  type GetServerSideProps<P extends Parameter = {}> = (
    request: FastifyRequest<{ Params: P["params"]; Query: P["query"]; Body: null }>,
    reply: FastifyReply
  ) => Promise<P["props"]> | P["props"] | Promise<void> | void

  type GetInitialAppProps<Props> = (request: FastifyRequest) => Promise<Props> | Props

  type Page<Props = {}> = Component<Props> & {
    serverSideProps?: GetServerSideProps<{ props: Props }>
  }

  type Route = {
    path: string
    page: any
  }

  type AppComponent<AppProps> = Component<{ pageProps: any; appProps: AppProps }>

  type TUser = Omit<User, "password">
}
