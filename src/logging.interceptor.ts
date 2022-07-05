import { access, appendFile, writeFile } from 'node:fs/promises';

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<void>,
  ): Observable<any> | Promise<Observable<any>> {
    this.logRequest(context.switchToHttp().getRequest());

    return next.handle();
  }

  private logRequest(request: any): Promise<void> {
    const filePath = `${process.cwd()}/trace.log`;

    const content = `${new Date().toLocaleString()} : (${request.ip}) ${
      request.method
    } ${request.path} \n`;

    return access(filePath)
      .then(() => appendFile(filePath, content))
      .catch(() => writeFile(filePath, content))
      .catch(() => console.log('Error while writing trace file'));
  }
}
