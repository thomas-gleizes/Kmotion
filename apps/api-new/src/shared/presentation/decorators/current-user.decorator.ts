import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPayload } from 'src/auth/application/port/auth-service.port';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: AuthPayload }>();

    return request.user;
  },
);
