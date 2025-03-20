import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@forex-marketplace/grpc';

@Injectable()
export class JwtAuardGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;
  private readonly logger = new Logger(JwtAuardGuard.name);
  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!token) {
      return false;
    }
    return this.authService.authenticate({ token }).pipe(
      tap((res) => {
        this.logger.log(res);
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true),
      catchError((error) => {
        this.logger.error(error);
        return of(false);
      })
    );
  }
}
