import { Injectable } from '@nestjs/common';
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
    return this.prisma.user
      .findUnique({ where: { id } })
      .then(UserService.removePassword);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.prisma.user
      .update({ where: { id }, data: { ...dto } })
      .then(UserService.removePassword);
  }
}
