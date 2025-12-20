import crypto from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/domain/user.entity';
import { environment } from 'src/core/config/environment';
import {
  AuthPayload,
  AuthServicePort,
} from 'src/auth/application/port/auth-service.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthServiceAdapter implements AuthServicePort {
  constructor(private readonly jwtService: JwtService) {}

  hash(password: string) {
    return crypto.hash('sha256', `${password}${environment.PASSWORD_PAPER}`);
  }

  sign(user: User): Promise<string> {
    const payload: AuthPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
    };

    return this.jwtService.signAsync(payload);
  }

  verify(token: string): Promise<AuthPayload> {
    return this.jwtService.verify(token, { secret: environment.JWT_SECRET });
  }

  compare(password: string, hash: string): boolean {
    return this.hash(password) === hash;
  }
}
