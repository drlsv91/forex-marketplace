import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @HealthCheck()
  @SkipThrottle()
  check() {
    return this.health.check([
      () =>
        this.microservice.pingCheck('redis', {
          transport: Transport.REDIS,
          options: {
            host: this.configService.getOrThrow('REDIS_HOST'),
            port: this.configService.getOrThrow('REDIS_PORT'),
          },
        }),
    ]);
  }
}
