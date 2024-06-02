import { AsyncTask, CronJob } from "toad-scheduler"
import trace from "../utils/trace"
import YtConverter from "../services/ytconverter"
import prisma from "../services/prisma"
import { syncTracks } from "../services/sync-tracks"

const task = new AsyncTask(
  "sync-musics",
  async () => {
    void trace('CRON JOB: "sync-musics"')
    await syncTracks(new YtConverter(), prisma)
  },
  (err) => void trace("CRON JOB ERROR", err.name, err.message),
)

export const syncMusics = new CronJob({ cronExpression: "30 1 * * *" }, task, {
  preventOverrun: true,
})
