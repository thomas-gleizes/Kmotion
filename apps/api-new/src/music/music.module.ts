import { Module } from '@nestjs/common';
import { MusicController } from './presentation/music.controller';

@Module({ controllers: [MusicController] })
export class MusicModule {}
