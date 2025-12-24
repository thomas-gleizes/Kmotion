import { ICommand } from '@nestjs/cqrs';

export class DeletePlaylistCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
