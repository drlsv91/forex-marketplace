/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initApp } from '@forex-marketplace/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { RATE_PACKAGE_NAME } from 'types/proto/rates';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: RATE_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/rates.proto'),
      url: app.get(ConfigService).getOrThrow('RATE_GRPC_URL'),
    },
  });
  await initApp(app, {
    docs: {
      title: 'Rates Service',
      description: 'API for Forex Rates',
      tagName: 'Rates',
    },
  });
  app.startAllMicroservices();
}

bootstrap().catch((err) => Logger.error(err));
