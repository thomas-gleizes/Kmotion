import { FindUserByIdCase } from 'src/user/application/use-cases/find-user-by-id.case';
import { GetProfileCase } from 'src/user/application/use-cases/get-profile.case';
import { FindUserBySlugCase } from 'src/user/application/use-cases/find-user-by-slug.case';

export const userUserCases = [
  FindUserByIdCase,
  FindUserBySlugCase,
  GetProfileCase,
];
