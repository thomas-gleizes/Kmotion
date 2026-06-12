import { Command } from 'src/core/cqrs';

export type RegisterCommandPayload = {
  email: string;
  name: string;
  password: string;
};

export class RegisterCommand extends Command<void> {
  constructor(public readonly payload: RegisterCommandPayload) {
    super();
  }
}
