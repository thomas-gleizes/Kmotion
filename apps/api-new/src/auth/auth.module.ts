import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from 'src/auth/application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { environment } from 'src/core/config/environment';
import { AuthRepository } from 'src/auth/infrastructure/repository/auth.repository';
import { AUTH_REPOSITORY_PORT } from 'src/auth/domain/port/auth-repository.port';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: environment.JWT_SECRET,
      signOptions: {
        expiresIn: environment.JWT_EXPIRATION_TIME,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_REPOSITORY_PORT,
      useClass: AuthRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
