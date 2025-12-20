import { FindUserByIdHandler } from 'src/user/application/queries/find-user-by-id/find-user-by-id.handler';
import { GetProfileHandler } from 'src/user/application/queries/get-profile/get-profile.handler';
import { FindUserBySlugHandler } from 'src/user/application/queries/find-user-by-slug/find-user-by-slug.handler';
import { FindUsersHandler } from 'src/user/application/queries/find-users/find-users.handler';

export const userQueryHandlers = [
  FindUserByIdHandler,
  FindUserBySlugHandler,
  GetProfileHandler,
  FindUsersHandler,
];
