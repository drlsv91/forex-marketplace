/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initApp } from '@forex-marketplace/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { WALLET_PACKAGE_NAME } from 'types/proto/wallet';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: WALLET_PACKAGE_NAME,
      protoPath: join(__dirname, 'proto/wallet.proto'),
      url: app.get(ConfigService).getOrThrow('WALLET_GRPC_URL'),
    },
  });
  await initApp(app, {
    docs: {
      title: 'Wallet Service',
      description: 'API for wallet service',
      tagName: 'wallet',
    },
  });

  app.startAllMicroservices();
}

bootstrap();
