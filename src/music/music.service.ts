import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import YoutubeService from '../youtube/youtube.service';
import { createReadStream } from 'fs';

@Injectable()
export class MusicService implements OnModuleInit {
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
      return this.prisma.music.update({
        where: { youtubeId: id },
        data: { ready: true },
      });
    } else {
      const details = await youtube.getVideoDetails();

      const promise = this.prisma.music.create({
        data: {
          youtubeId: id,
          title: details.media.song || youtube.title,
          artist: details.media.artist || details.author.name,
          releaseDate: new Date(details.publishDate),
          details: JSON.stringify(details),
          downloader: {
            connect: {
              id: userId,
            },
          },
        },
      });

      const [music] = await Promise.all([promise, youtube.download()]);

      return this.prisma.music.update({
        where: { id: music.id },
        data: {
          ready: true,
          path: `resources/musics/${music.youtubeId}/${music.title}.mp3`,
        },
      });
    }
  }

  async showVideosDetails(id: string) {
    const youtube = new YoutubeService(id);

    return youtube.getVideoDetails();
  }

  async read(id: string) {
    const music = await this.prisma.music.findUnique({ where: { youtubeId: id } });

    return createReadStream(`${process.cwd()}/${music.path}`);
  }

  onModuleInit(): any {
    this.prisma.$use(async (params, next) => {
      const results = await next(params);

      if (results && params.model === 'Music') {
        if (Array.isArray(results))
          return results.map((result) => ({
            ...result,
            details: result.details ? JSON.parse(result?.details) : null,
          }));
        else
          return {
            ...results,
            details: results.details ? JSON.parse(results?.details) : null,
          };
      } else return results;
    });
  }
}
