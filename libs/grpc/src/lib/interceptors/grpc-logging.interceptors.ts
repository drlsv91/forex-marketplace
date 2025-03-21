import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GrpcLoggingInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const handler = context.getHandler();
    const args = context.getArgs()[0];
    const requestId = uuid();
    const startTime = Date.now();

    this.logger.log({
      requestId,
      handler,
      args,
    });

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          requestId,
          handler,
          duration: Date.now() - startTime,
        });
      })
    );
  }
}
