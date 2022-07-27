import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import YoutubeService from '../youtube/youtube.service';
import { CreatePlaylistDto } from './dto';

@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  async create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    try {
      return await this.prisma.playlist.create({
        data: {
          title: createPlaylistDto.title,
          slug: createPlaylistDto.title.toLowerCase().replace(/\s/g, '-'),
          description: createPlaylistDto.description,
          authorId: userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ForbiddenException('credentials already taken');
    }
  }

  findAllByUser(userId: number) {
    return this.prisma.playlist.findMany({
      where: { authorId: userId },
    });
  }

  async addMusic(playlistId: number, youtubeId: string) {
    const music = this.prisma.music.findUnique({ where: { youtubeId } });

    if (!music) {
      const yotubeService = new YoutubeService(youtubeId);
      await yotubeService.download();
    }
  }
}
