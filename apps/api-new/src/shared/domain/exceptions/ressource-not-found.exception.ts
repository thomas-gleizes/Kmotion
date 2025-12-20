import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export class RessourceNotFoundException extends DomainException {
  constructor(ressource: string) {
    super(`${ressource} not found`);
  }
}
