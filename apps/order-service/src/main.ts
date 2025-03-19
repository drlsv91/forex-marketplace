/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initApp } from '@forex-marketplace/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initApp(app, {
    docs: {
      title: 'Order Service',
      description: 'API for Forex order management',
      tagName: 'Order',
    },
  });
}

bootstrap();
