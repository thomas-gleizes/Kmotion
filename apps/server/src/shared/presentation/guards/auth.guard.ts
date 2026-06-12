import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AUTH_SERVICE_PORT,
  type AuthPayload,
  type AuthServicePort,
} from 'src/auth/application/port/auth-service.port';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_PORT)
    private authService: AuthServicePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: AuthPayload;
    try {
      payload = await this.authService.verify(token);
    } catch (error) {
      throw new UnauthorizedException();
    }

    // Rejette les tokens émis pour un compte inactif (ex: tokens délivrés
    // au register avant que le compte soit activé par un admin).
    if (!payload.isActive) {
      throw new UnauthorizedException('Account not activated');
    }

    request['user'] = payload;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // @ts-expect-error
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
