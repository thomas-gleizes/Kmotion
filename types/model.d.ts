declare module 'model' {
  import Prisma from '@prisma/client';

  declare type User = Omit<Prisma.User, 'password'>;
  declare type Playlist = Omit<Prisma.Playlist>;
  declare type Music = Omit<Prisma.Music>;
}
