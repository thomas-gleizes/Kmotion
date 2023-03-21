import { FastifyInstance } from "fastify"
import fastifySchedulePlugin from "@fastify/schedule"

import { syncMusics } from "../jobs/sync-musics"

export async function jobsPlugins(instance: FastifyInstance): Promise<void> {
  return void instance
    .register(fastifySchedulePlugin)
    .ready()
    .then(() => {
      instance.scheduler.addCronJob(syncMusics)
    })
}
