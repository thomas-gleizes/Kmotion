import { ICommand } from '@nestjs/cqrs';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { PlaylistEntry } from 'src/playlist/domain/values-object/playlist-entries.value-object';

export class UpdatePlaylistCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly visibility?: Visibility,
    public readonly entries?: PlaylistEntry[],
  ) {}
}
