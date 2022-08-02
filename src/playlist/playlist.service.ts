import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import YoutubeService from '../youtube/youtube.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto';

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
        if (error.code === 'P2002') throw new ForbiddenException('credentials already taken');
    }
  }

  async findById(id: number) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: +id },
    });

    if (!playlist) throw new NotFoundException('playlist not found');

    return playlist;
  }

  async findBySlug(slug: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { slug },
    });

    if (!playlist) throw new NotFoundException('playlist not found');

    return playlist;
  }

  async update(id: number, authorId: number, updatePlaylistDto: UpdatePlaylistDto) {
    const meta = await this.prisma.playlist.updateMany({
      where: { AND: [{ id: +id }, { authorId: +authorId }] },
      data: {
        title: updatePlaylistDto.title,
        description: updatePlaylistDto.description,
      },
    });

    if (meta.count < 1) throw new NotFoundException('playlist not found');

    return true;
  }

  async remove(id: number, authorId: number) {
    const meta = await this.prisma.playlist.deleteMany({
      where: { AND: [{ id: +id }, { authorId: +authorId }] },
    });

    if (meta.count < 1) throw new NotFoundException('playlist not found');

    return true;
  }

  async showEntry(playlistId: number, authorId: number, musicId: number) {}

  async addEntry(playlistId: number, authorId, musicId: number) {
    try {
      const playlist = await this.prisma.playlist.findUnique({
        where: { id: +playlistId },
        include: { entries: true },
      });

      if (!playlist) throw new NotFoundException('playlist not found');
      else if (playlist.authorId !== authorId)
        throw new ForbiddenException('You cannot add music to this playlist');

      const music = await this.prisma.music.findUnique({ where: { id: musicId } });

      if (!music) throw new NotFoundException('music not found');
      else if (music.ready) {
        return this.prisma.playlistEntry.create({
          data: {
            playlistId: +playlistId,
            musicId: +musicId,
            position: playlist.entries.length,
          },
        });
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('You cannot add music to this playlist');
      }
      throw err;
    }
  }
}
