import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MusicModule } from './music/music.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from 'src/core/core.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { PlaylistModule } from 'src/playlist/playlist.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule.forRoot(),
    CoreModule,
    AuthModule,
    UserModule,
    MusicModule,
    PlaylistModule,
  ],
})
export class AppModule {}
