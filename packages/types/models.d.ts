import { Visibility } from "@prisma/client"

export interface IUser {
  id: number
  name: string
  email: string
  slug: string
  isAdmin: boolean
  isActivate: boolean
  visibility: Visibility
}
