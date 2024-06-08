import YtConverter from "./ytconverter"
import { PrismaClient } from "@prisma/client"
import { PrismaMusic } from "@kmotion/types"

export const syncTracks = async (
  service: YtConverter,
  prisma: PrismaClient,
): Promise<PrismaMusic[]> => {
  const tracks = await service.getTracks()

  const newTracks = []

  for (const track of tracks) {
    if (!track.isReady) continue

    const exist = await prisma.music.findUnique({ where: { youtubeId: track.youtubeId } })

    const upsertTrack = await prisma.music.upsert({
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

    if (!exist) newTracks.push(upsertTrack)
  }

  return newTracks
}
