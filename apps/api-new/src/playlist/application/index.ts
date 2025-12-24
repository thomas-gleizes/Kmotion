import { CommandHandlerType, QueryHandlerType } from '@nestjs/cqrs';
import { CreatePlaylistHandler } from 'src/playlist/application/commands/create-playlist/create-playlist.handler';
import { UpdatePlaylistHandler } from 'src/playlist/application/commands/update-playlist/update-playlist.handler';
import { DeletePlaylistHandler } from 'src/playlist/application/commands/delete-playlist/delete-playlist.handler';
import { AddMusicToPlaylistHandler } from 'src/playlist/application/commands/add-music-to-playlist/add-music-to-playlist.handler';
import { RemoveMusicFromPlaylistHandler } from 'src/playlist/application/commands/remove-music-from-playlist/remove-music-from-playlist.handler';
import { FindPlaylistByIdHandler } from 'src/playlist/application/queries/find-playlist-by-id/find-playlist-by-id.handler';
import { FindUserPlaylistsHandler } from 'src/playlist/application/queries/find-user-playlists/find-user-playlists.handler';
import { FindManyPlaylistsHandler } from 'src/playlist/application/queries/find-many-playlists/find-many-playlists.handler';

export const playlistCommandHandlers: CommandHandlerType[] = [
  CreatePlaylistHandler,
  UpdatePlaylistHandler,
  DeletePlaylistHandler,
  AddMusicToPlaylistHandler,
  RemoveMusicFromPlaylistHandler,
];

export const playlistQueryHandlers: QueryHandlerType[] = [
  FindPlaylistByIdHandler,
  FindUserPlaylistsHandler,
  FindManyPlaylistsHandler,
];
