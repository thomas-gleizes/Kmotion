import { SyncMusicHandler } from 'src/music/application/commands/sync-music/sync-music.handler';
import { CommandHandlerType } from '@nestjs/cqrs';

export const musicsCommandHandlers: CommandHandlerType[] = [SyncMusicHandler];
