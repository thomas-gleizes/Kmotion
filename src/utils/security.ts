import bcrypt from "bcrypt"

export function hashPassword(password: string) {
  return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt))
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
