import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.originalUrl;
    const now = Date.now();

    const id = randomUUID();

    this.logger.log(`${id} -> ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        const statusCode = response.statusCode;

        if (statusCode >= 400) {
          this.logger.error(
            `${id} <- ${method} ${url} ${statusCode} - ${delay}ms`,
          );
        } else {
          this.logger.log(
            `${id} <- ${method} ${url} ${statusCode} - ${delay}ms`,
          );
        }
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        this.logger.error(
          `${id} <- ${method} ${url} - ${
            error.message ?? 'Unknow Error'
          } - ${delay}ms`,
        );

        return throwError(error);
      }),
    );
  }
}

export default HttpLoggingInterceptor;
