/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initApp } from '@forex-marketplace/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  await initApp(app, {
    docs: {
      title: 'Wallet Service',
      description: 'API for wallet service',
      tagName: 'wallet',
    },
  });
}

bootstrap();
