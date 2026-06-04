import { Global, Module } from '@nestjs/common';
import { drizzleProvider } from 'src/core/database/drizzle.provider';

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class CoreModule {}
