import { Module } from '@nestjs/common';

import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [LoggingInterceptor],
})
export class LoggingModule {}
