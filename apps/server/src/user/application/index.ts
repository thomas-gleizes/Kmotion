import { Type } from '@nestjs/common';
import { ICommandHandler, IQueryHandler } from 'src/core/cqrs';
import { FindUserByIdHandler } from 'src/user/application/queries/find-user-by-id/find-user-by-id.handler';
import { GetProfileHandler } from 'src/user/application/queries/get-profile/get-profile.handler';
import { FindUserBySlugHandler } from 'src/user/application/queries/find-user-by-slug/find-user-by-slug.handler';
import { FindUsersHandler } from 'src/user/application/queries/find-users/find-users.handler';
import { BanUserHandler } from 'src/user/application/commands/ban-user/ban-user.handler';
import { UnbanUserHandler } from 'src/user/application/commands/unban-user/unban-user.handler';
import { DeleteUserHandler } from 'src/user/application/commands/delete-user/delete-user.handler';

export const userQueryHandlers: Type<IQueryHandler<any>>[] = [
  FindUserByIdHandler,
  FindUserBySlugHandler,
  GetProfileHandler,
  FindUsersHandler,
];

export const userCommandHandlers: Type<ICommandHandler<any>>[] = [
  BanUserHandler,
  UnbanUserHandler,
  DeleteUserHandler,
];
