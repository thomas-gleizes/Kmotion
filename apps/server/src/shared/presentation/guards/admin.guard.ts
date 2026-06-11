import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { type AuthPayload } from 'src/auth/application/port/auth-service.port';

/**
 * Autorise uniquement les administrateurs. À utiliser après `AuthGuard`,
 * qui renseigne `request.user` (le payload JWT).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthPayload }>();

    if (!request.user?.isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
