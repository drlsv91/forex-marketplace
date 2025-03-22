/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { initApp } from '@forex-marketplace/nestjs';
import { AUTH_PACKAGE_NAME } from '@forex-marketplace/grpc';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  await initApp(app, {
    docs: {
      title: 'User Auth Service',
      description: 'API for user authentication and registration',
      tagName: 'Auth Service',
    },
  });

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, '../../libs/grpc/proto/auth.proto'),
      url: app.get(ConfigService).getOrThrow('AUTH_GRPC_URL'),
    },
  });

  app.startAllMicroservices();
}

bootstrap();
