import * as fs from "node:fs"
import { FastifyInstance } from "fastify"

import { APP_EXTENSION } from "../../utils/constants"
import NotFoundException from "../../exceptions/http/NotFoundException"

const extensionPath = `${APP_EXTENSION}/kmotion.zip`

export default async function extensionRoutes(instance: FastifyInstance) {
  instance.get("/", async (request, reply) => {
    if (!fs.existsSync(extensionPath)) throw new NotFoundException("Extension not found")

    const buffer = await fs.promises.readFile(extensionPath)

    reply
      .header("Content-Disposition", 'attachment; filename="Kmotion.zip"')
      .header("Content-Type", "application/zip")
      .send(buffer)
  })
}
