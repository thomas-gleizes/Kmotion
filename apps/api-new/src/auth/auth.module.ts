import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { environment } from 'src/core/config/environment';
import { AuthRepository } from 'src/auth/infrastructure/repository/auth.repository';
import { AUTH_REPOSITORY_PORT } from 'src/auth/domain/port/auth-repository.port';
import { AUTH_SERVICE_PORT } from 'src/auth/application/port/auth-service.port';
import { JwtAuthServiceAdapter } from 'src/auth/infrastructure/adapters/jwt-auth-service.adapter';
import { authCommands } from 'src/auth/application/commands';

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
    ...authCommands,
    {
      provide: AUTH_SERVICE_PORT,
      useClass: JwtAuthServiceAdapter,
    },
    {
      provide: AUTH_REPOSITORY_PORT,
      useClass: AuthRepository,
    },
  ],
  exports: [AUTH_SERVICE_PORT],
})
export class AuthModule {}
