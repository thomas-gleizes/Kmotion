import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';

export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const allowAny = this.reflector.get<string[]>('allow-any', context.getHandler());

    if (user) return user;
    if (allowAny) return true;

    throw new UnauthorizedException();
  }
}
