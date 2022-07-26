import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  private signToken(user: any): string {
    return this.jwt.sign(
      { user },
      { secret: this.config.get('SECRET_JWT'), expiresIn: '7d' },
    );
  }

  private async passwordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password + this.config.get('SECRET_SEED'), salt);
  }

  private async passwordCompare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(
      password + this.config.get('SECRET_SEED'),
      hash,
    );
  }

  async signIn(data: SignInDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (
      !user ||
      (user && !(await this.passwordCompare(data.password, user.password)))
    )
      throw new UnauthorizedException('invalid credentials');

    if (!user.activate)
      throw new UnauthorizedException(
        'Your account must be validate by an admin. Please Wait',
      );

    delete user.password;

    return { user, token: this.signToken(user) };
  }

  async signUp(data: SignUpDto): Promise<any> {
    try {
      await this.prisma.user.create({
        data: {
          email: data.email,
          password: await this.passwordHash(data.password),
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        },
      });

      return {
        message: 'You are register but a admin need to confirm your account.',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ForbiddenException('credentials already taken');

      throw error;
    }
  }
}
