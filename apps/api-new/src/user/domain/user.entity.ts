import { randomUUID } from 'crypto';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public name: string,
    public readonly slug: string,
    public isActive: boolean,
    public isAdmin: boolean,
  ) {}

  static create(email: string, name: string) {
    return new User(
      randomUUID(),
      email,
      name,
      name.toLowerCase().replace(/\s/g, '-'),
      false,
      false,
    );
  }
}
