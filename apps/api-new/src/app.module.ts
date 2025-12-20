import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MusicModule } from './music/music.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from 'src/core/core.module';

@Module({ imports: [CoreModule, AuthModule, UserModule, MusicModule] })
export class AppModule {}
