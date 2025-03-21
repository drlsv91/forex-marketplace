/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initApp } from '@forex-marketplace/nestjs';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { WALLET_PACKAGE_NAME } from '@forex-marketplace/grpc';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: WALLET_PACKAGE_NAME,
      protoPath: join(__dirname, '../../libs/grpc/proto/wallet.proto'),
      url: app.get(ConfigService).getOrThrow('WALLET_GRPC_URL'),
    },
  });
  await initApp(app, {
    docs: {
      title: 'Wallet Service',
      description: 'API for wallet service',
      tagName: 'Wallet',
    },
  });

  app.startAllMicroservices();
}

bootstrap().catch((err) => Logger.error(err));
