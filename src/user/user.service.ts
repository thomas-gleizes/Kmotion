import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private static removePassword(user: UserModel | null) {
    if (user && user.hasOwnProperty('password')) {
      delete user.password;
    }

    return user;
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } }).then(UserService.removePassword);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.prisma.user
      .update({ where: { id }, data: { ...dto } })
      .then(UserService.removePassword);
  }

  async activate(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.isActivate) throw new ForbiddenException('User is already activated');

    return this.prisma.user
      .update({ where: { id }, data: { isActivate: true } })
      .then(UserService.removePassword);
  }

  async showPublicPlaylists(authorId: number) {
    const user = this.findById(authorId);
    if (!user) throw new NotFoundException('user not found');

    return this.prisma.playlist.findMany({
      where: { AND: [{ authorId }, { visibility: 'public' }] },
    });
  }

  async showPlaylists(authorId: number) {
    const user = this.findById(authorId);
    if (!user) throw new NotFoundException('user not found');

    return this.prisma.playlist.findMany({ where: { authorId } });
  }
}
