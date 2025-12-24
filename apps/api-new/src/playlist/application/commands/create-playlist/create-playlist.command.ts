import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { PlaylistEntry } from 'src/playlist/domain/values-object/playlist-entries.value-object';
import { ICommand } from '@nestjs/cqrs';

export class CreatePlaylistCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly userId: string,
    public readonly description: string,
    public readonly visibility?: Visibility,
    public readonly entries?: PlaylistEntry[],
  ) {}
}
