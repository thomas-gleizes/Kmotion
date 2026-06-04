import { Command } from 'src/core/cqrs';

export type LoginCommandPayload = {
  email: string;
  password: string;
};

export class LoginCommand extends Command<string> {
  constructor(public readonly payload: LoginCommandPayload) {
    super();
  }
}
