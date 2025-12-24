import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export class InvalidPositionException extends DomainException {
  constructor(message: string = 'Position must be greater than or equal to 0') {
    super(message);
  }
}
