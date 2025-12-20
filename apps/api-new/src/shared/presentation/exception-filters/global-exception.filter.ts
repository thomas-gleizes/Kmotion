import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { environment } from 'src/core/config/environment';

@Catch()
export class GlobalExceptionFilters implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilters.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(exception);

    if (environment.NODE_ENV === 'production')
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An internal error has occurred.',
        name: 'INTERNAL_SERVER_ERROR',
      });

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
      name: exception.name,
      stack: exception.stack,
    });
  }
}
