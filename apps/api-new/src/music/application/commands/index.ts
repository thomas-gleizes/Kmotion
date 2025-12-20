import { SyncMusicHandler } from 'src/music/application/commands/sync-music/sync-music.handler';
import { CommandHandlerType } from '@nestjs/cqrs';
import { AddMusicHandler } from 'src/music/application/commands/add-music/add-music.handler';

export const musicsCommandHandlers: CommandHandlerType[] = [SyncMusicHandler, AddMusicHandler];
