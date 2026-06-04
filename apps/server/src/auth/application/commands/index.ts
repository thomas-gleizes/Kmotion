import { Type } from '@nestjs/common';
import { ICommandHandler } from 'src/core/cqrs';
import { RegisterHandler } from 'src/auth/application/commands/register/register.handler';
import { LoginHandler } from 'src/auth/application/commands/login/login.handler';

export const authCommands: Type<ICommandHandler<any>>[] = [
  LoginHandler,
  RegisterHandler,
];
