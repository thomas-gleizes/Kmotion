import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

export class AdminGuard extends PassportAuthGuard('jwt-admin') {
  constructor() {
    super();
  }
}
