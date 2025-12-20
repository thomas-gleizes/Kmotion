import { CommandHandlerType } from '@nestjs/cqrs';
import { RegisterHandler } from 'src/auth/application/commands/register/register.handler';
import { LoginHandler } from 'src/auth/application/commands/login/login.handler';

export const authCommands: CommandHandlerType[] = [
  LoginHandler,
  RegisterHandler,
];
