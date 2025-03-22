import {
  RpcExceptionFilter,
  ArgumentsHost,
  Catch,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class CustomRpcExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(CustomRpcExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    this.logger.error('Caught exception:', exception);
    return throwError(() => exception);
  }
}
