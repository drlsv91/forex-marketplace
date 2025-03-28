import { Module } from '@nestjs/common';
import { WalletsModule } from './wallets/wallets.module';
import {
  DatabaseModule,
  HealthModule,
  LoggerModule,
} from '@forex-marketplace/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBITMQ_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        WALLET_GRPC_URL: Joi.string().required(),
      }),
    }),
    HealthModule,
    WalletsModule,
  ],
})
export class AppModule {}
