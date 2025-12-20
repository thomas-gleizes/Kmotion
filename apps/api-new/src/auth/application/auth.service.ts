import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'crypto';
import { environment } from 'src/core/config/environment';
import { User } from 'src/user/domain/user.entity';
import {
  AUTH_REPOSITORY_PORT,
  type AuthRepositoryPort,
} from 'src/auth/domain/port/auth-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  isActive: boolean;
  isAdmin: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(AUTH_REPOSITORY_PORT)
    private readonly authRepository: AuthRepositoryPort,
  ) {}

  async hash(password: string) {
    return hash('sha256', `${password}${environment.PASSWORD_PAPER}`);
  }

  private async sign(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
    };

    return this.jwtService.signAsync(payload);
  }

  async signIn(email: string, pass: string) {
    const hash = await this.hash(pass);

    const [user, password] = await this.authRepository.findByEmail(email);

    if (password !== hash) throw new DomainException("Password doesn't match");

    return {
      user: user,
      token: await this.sign(user),
    };
  }

  async register(email: string, name: string, pass: string) {
    const user = User.create(email, name);

    await this.authRepository.save(user, await this.hash(pass));

    return {
      user: user,
      token: await this.sign(user),
    };
  }

  verify(token: string) {
    return this.jwtService.verify(token, { secret: environment.JWT_SECRET });
  }
}
