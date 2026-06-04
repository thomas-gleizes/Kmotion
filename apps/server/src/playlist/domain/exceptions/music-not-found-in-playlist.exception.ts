import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export class MusicNotFoundInPlaylistException extends DomainException {
  constructor(message: string = 'Music not found in playlist') {
    super(message);
  }
}
