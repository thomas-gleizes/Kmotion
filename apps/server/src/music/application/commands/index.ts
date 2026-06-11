import { SyncMusicHandler } from 'src/music/application/commands/sync-music/sync-music.handler';
import { AddMusicHandler } from 'src/music/application/commands/add-music/add-music.handler';
import { UpdateMusicHandler } from 'src/music/application/commands/update-music/update-music.handler';
import { Type } from '@nestjs/common';
import { ICommandHandler } from 'src/core/cqrs';

export const musicsCommandHandlers: Type<ICommandHandler<any>>[] = [
  SyncMusicHandler,
  AddMusicHandler,
  UpdateMusicHandler,
];
