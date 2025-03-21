/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from '@forex-marketplace/nestjs';
import { NotificationModule } from './app/notification.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      queue: NOTIFICATION_SERVICE,
      urls: app.get(ConfigService).getOrThrow('RABBITMQ_URI'),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  app.startAllMicroservices();
  app.get(Logger).log(`🚀 Application [Notification] is running`);
}

bootstrap().catch((error) => NestLogger.error(error));
