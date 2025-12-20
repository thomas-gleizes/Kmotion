import { Provider } from '@nestjs/common';
import { createDrizzle, DrizzleDB } from './database';

export const DRIZZLE = Symbol('DRIZZLE');

export const drizzleProvider: Provider<DrizzleDB> = {
  provide: DRIZZLE,
  useFactory: createDrizzle,
};
