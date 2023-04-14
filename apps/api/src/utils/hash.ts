import * as crypto from "node:crypto"
import * as bcrypt from "bcrypt"

export function bcryptHash(password: string) {
  return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt))
}

export function bcryptCompare(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function sha256(str: string): Promise<string> {
  return new Promise((resolve) => {
    const hash = crypto.createHash("sha256")

    hash.update(str)
    const hashedString: string = hash.digest().toString("hex")
    hash.end()

    resolve(hashedString)
  })
}
