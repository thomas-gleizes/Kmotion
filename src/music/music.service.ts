import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import YoutubeService from '../youtube/youtube.service';

@Injectable()
export class MusicService {
  constructor(private prisma: PrismaService) {}

  async saveMusic(id: string, userId: number) {
    const youtube = new YoutubeService(id);

    let music = await this.prisma.music.findUnique({
      where: { youtubeId: id },
    });

    if (music) {
      if (music.ready) {
        return music;
      }

      await youtube.download();
    } else {
      const details = await youtube.getVideoDetails();

      music = await this.prisma.music.create({
        data: {
          youtubeId: id,
          title: details.media.song,
          artist: details.media.artist,
          album: details.author.name || '',
          releaseDate: new Date(details.publishDate),
          downloaderId: userId,
          details: '',
        },
      });

      return music;
    }
  }

  async showVideosDetails(id: string) {
    const youtube = new YoutubeService(id);

    return youtube.getVideoDetails();
  }
}
