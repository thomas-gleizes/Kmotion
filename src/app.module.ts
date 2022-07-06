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
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist', 'client'),
    }),
    PrismaModule,
    LoggingModule,
    AuthModule,
    UserModule,
    MusicModule,
    YoutubeModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
