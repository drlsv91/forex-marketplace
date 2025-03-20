/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { initApp } from '@forex-marketplace/common';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/auth.proto'),
      url: app.get(ConfigService).getOrThrow('AUTH_GRPC_URL'),
    },
  });

  await initApp(app, {
    docs: {
      title: 'User Auth Service',
      description: 'API for user authentication and registration',
      tagName: 'Auth Service',
    },
  });

  app.startAllMicroservices();
}

bootstrap().catch((err) => Logger.error(err));
