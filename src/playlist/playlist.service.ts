import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto';

@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });

    if (!playlist) throw new NotFoundException('playlist not found');

    return playlist;
  }

  async findBySlug(slug: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { slug } });

    if (!playlist) throw new NotFoundException('playlist not found');

    return playlist;
  }

  async create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    try {
      return await this.prisma.playlist.create({
        data: {
          title: createPlaylistDto.title,
          slug: createPlaylistDto.title.toLowerCase().replace(/\s/g, '-'),
          description: createPlaylistDto.description,
          authorId: userId,
          visibility: createPlaylistDto.visibility,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002') throw new ForbiddenException('credentials already taken');
    }
  }

  async update(id: number, authorId: number, updatePlaylistDto: UpdatePlaylistDto) {
    const meta = await this.prisma.playlist.updateMany({
      where: { AND: [{ id }, { authorId }] },
      data: {
        title: updatePlaylistDto.title,
        description: updatePlaylistDto.description,
        visibility: updatePlaylistDto.visibility,
      },
    });

    if (meta.count < 1) throw new NotFoundException('playlist not found');

    return true;
  }

  async remove(id: number, authorId: number) {
    const meta = await this.prisma.playlist.deleteMany({
      where: { AND: [{ id }, { authorId }] },
    });

    if (meta.count < 1) throw new NotFoundException('playlist not found');

    return true;
  }

  async showEntry(
    playlistId: number,
    authorId: number,
    limit: number = 20,
    offset: number = 0
  ) {
    if (limit > 3) limit = 3;

    return await this.prisma.playlistEntry.findMany({
      where: {
        playlistId,
        playlist: {
          OR: [{ authorId }, { visibility: 'public' }],
        },
      },
      take: limit,
      skip: offset,
    });
  }

  async addEntry(playlistId: number, musicId: number, authorId: number) {
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
      else {
        return await this.prisma.playlistEntry.create({
          data: {
            playlistId: +playlistId,
            musicId: +musicId,
            position: playlist.entries.length,
          },
        });
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002') throw new ForbiddenException('music already in playlist');
      throw error;
    }
  }

  async deleteEntry(playlistId: number, musicId: number, authorId: number) {
    try {
      const playlist = await this.findById(playlistId);

      if (!playlist) throw new NotFoundException('playlist not found');
      else if (playlist.authorId !== authorId)
        throw new ForbiddenException('You cannot remove music from this playlist');

      return await this.prisma.playlistEntry.delete({
        where: {
          playlistId_musicId: { playlistId, musicId },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2025') throw new ForbiddenException('music already in playlist');

      throw error;
    }
  }
}
