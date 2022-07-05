import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_JWT'),
    });
  }

  async validate(payload: any) {
    if (payload.user.isAdmin === true) return payload.user;
    else throw new UnauthorizedException('Access denied');
  }
}
