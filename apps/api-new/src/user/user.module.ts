import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserWriteRepository } from 'src/user/infrastructure/persistance/repositories/user-write.repository';
import { UserQueryRepository } from 'src/user/infrastructure/persistance/repositories/user-query.repository';
import { USER_WRITE_REPOSITORY_PORT } from 'src/user/domain/port/user-write-repository.port';
import { USER_QUERY_REPOSITORY_PORT } from 'src/user/application/port/user-query-repository.port';
import { AuthModule } from 'src/auth/auth.module';
import { userQueryHandlers } from 'src/user/application';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    ...userQueryHandlers,
    { provide: USER_WRITE_REPOSITORY_PORT, useClass: UserWriteRepository },
    { provide: USER_QUERY_REPOSITORY_PORT, useClass: UserQueryRepository },
  ],
  exports: [USER_WRITE_REPOSITORY_PORT, USER_QUERY_REPOSITORY_PORT],
})
export class UserModule {}
