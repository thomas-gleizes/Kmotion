import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.originalUrl;
    const now = Date.now();

    this.logger.log(`-> ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        const statusCode = response.statusCode;

        if (statusCode >= 400) {
          this.logger.error(`<- ${method} ${url} ${statusCode} - ${delay}ms`);
        } else {
          this.logger.log(`<- ${method} ${url} ${statusCode} - ${delay}ms`);
        }
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        this.logger.error(
          `<- ${method} ${url} - ${
            error.message ?? 'Unknow Error'
          } - ${delay}ms`,
        );

        return throwError(error);
      }),
    );
  }
}
