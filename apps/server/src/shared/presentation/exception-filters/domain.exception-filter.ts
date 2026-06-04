import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof RessourceNotFoundException)
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: exception.message, name: exception.name });

    return response
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: exception.message, name: exception.name });
  }
}
