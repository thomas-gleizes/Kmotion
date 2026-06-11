import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { environment } from 'src/core/config/environment';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

@Catch()
export class GlobalExceptionFilters implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilters.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An internal error has occurred.';
    let name = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof RessourceNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      name = 'NOT_FOUND';
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      name = 'DOMAIN_EXCEPTION';
    } else if (
      exception.getStatus &&
      typeof exception.getStatus === 'function'
    ) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'object' ? res.message : res;
      name = exception.name;
    }

    if (environment.NODE_ENV === 'production')
      return response.status(status).json({
        message,
        name,
      });

    return response.status(status).json({
      message: exception.message || message,
      name: exception.name || name,
      stack: exception.stack,
    });
  }
}
