import { AsyncTask, CronJob } from "toad-scheduler"
import hash from "../utils/hash"
import YtConverter from "../services/ytconverter"
import prisma from "../services/prisma"
import { PrismaMusic } from "@kmotion/types"

const task = new AsyncTask(
  "sync-musics",
  async () => {
    void hash('CRON JOB: "sync-musics"')

    const ytConverter = YtConverter.getInstance()

    const musics = await ytConverter.musics()

    for (const music of musics) {
      const find = await prisma.music.findUnique({
        where: { youtubeId: music.id },
      })

      if (!find) {
        await prisma.music
          .create({
            data: {
              title: music.title,
              artist: music.author,
              youtubeId: music.id,
              downloaderId: 1,
              duration: music.duration,
            },
          })
          .then((music) => console.log("CRON JOB: new music ", music.title))
          .catch(() => void null)
      } else {
        await prisma.music.update({
          data: {
            title: music.title,
            artist: music.author,
            youtubeId: music.id,
            duration: music.duration,
          },
          where: { id: find.id },
        })
      }
    }
  },
  (err) => void hash("CRON JOB ERROR", err.name, err.message)
)

export const syncMusics = new CronJob({ cronExpression: "30 1 * * *" }, task, {
  preventOverrun: true,
})
