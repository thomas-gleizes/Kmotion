import jwt from "jsonwebtoken"

export const generateJwt = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1y" })
}

export const verifyJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string)
}
