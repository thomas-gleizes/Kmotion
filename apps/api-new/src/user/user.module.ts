import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserRepository } from 'src/user/infrastructure/persistance/repositories/user.repository';
import { USER_REPOSITORY_PORT } from 'src/user/domain/port/user-repository.port';
import { AuthModule } from 'src/auth/auth.module';
import { userUserCases } from 'src/user/application';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    ...userUserCases,
    { provide: USER_REPOSITORY_PORT, useClass: UserRepository },
  ],
  exports: [USER_REPOSITORY_PORT],
})
export class UserModule {}
