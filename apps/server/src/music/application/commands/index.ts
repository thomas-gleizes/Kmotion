import { SyncMusicHandler } from 'src/music/application/commands/sync-music/sync-music.handler';
import { AddMusicHandler } from 'src/music/application/commands/add-music/add-music.handler';
import { UpdateMusicHandler } from 'src/music/application/commands/update-music/update-music.handler';
import { DeleteMusicHandler } from 'src/music/application/commands/delete-music/delete-music.handler';
import { ToggleFavoriteHandler } from 'src/music/application/commands/toggle-favorite/toggle-favorite.handler';
import { RefreshConversionsHandler } from 'src/music/application/commands/refresh-conversions/refresh-conversions.handler';
import { RetryConversionHandler } from 'src/music/application/commands/retry-conversion/retry-conversion.handler';
import { Type } from '@nestjs/common';
import { ICommandHandler } from 'src/core/cqrs';

export const musicsCommandHandlers: Type<ICommandHandler<any>>[] = [
  SyncMusicHandler,
  AddMusicHandler,
  UpdateMusicHandler,
  DeleteMusicHandler,
  ToggleFavoriteHandler,
  RefreshConversionsHandler,
  RetryConversionHandler,
];
