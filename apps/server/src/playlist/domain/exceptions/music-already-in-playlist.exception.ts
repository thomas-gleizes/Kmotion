import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export class MusicAlreadyInPlaylistException extends DomainException {
  constructor(message: string = 'Music already in playlist') {
    super(message);
  }
}
