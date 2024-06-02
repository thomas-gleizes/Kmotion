import YtConverter from "./ytconverter"
import { PrismaClient } from "@prisma/client"

export const syncTracks = async (service: YtConverter, prisma: PrismaClient) => {
  const tracks = await service.getTracks()

  for (const track of tracks) {
    if (!track.isReady) continue

    await prisma.music.upsert({
      where: { youtubeId: track.youtubeId },
      update: {
        title: track.title,
        artist: track.artist,
        channel: track.channel,
        duration: track.duration,
      },
      create: {
        youtubeId: track.youtubeId,
        title: track.title,
        artist: track.artist,
        channel: track.channel,
        duration: track.duration,
        downloaderId: 1,
      },
    })
  }
}
