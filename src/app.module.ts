import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppGateway } from './app.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoggingModule } from './logging/logging.module';
import { MusicModule } from './music/music.module';
import { PlaylistModule } from './playlist/playlist.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from './auth/guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'dist', 'client'),
    // }),
    PrismaModule,
    LoggingModule,
    AuthModule,
    UserModule,
    MusicModule,
    PlaylistModule,
  ],
  controllers: [],
  providers: [
    AppGateway,
    { provide: APP_GUARD, useFactory: (ref) => new AuthGuard(ref), inject: [Reflector] },
  ],
})
export class AppModule {}
