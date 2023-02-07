import { User } from "@prisma/client"

declare interface Context {
  user: User
}
