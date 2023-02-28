import { FastifyInstance } from "fastify";

import v1 from "./v1";

export default async function routes(instance: FastifyInstance) {
  instance.register(v1, { prefix: "/v1" });
}
