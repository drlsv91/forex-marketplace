import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import {
  HealthModule,
  LoggerModule,
  RedisModule,
} from '@forex-marketplace/common';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [
    LoggerModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        EXCHANGE_RATE_API_KEY: Joi.string().required(),
        EXCHANGE_RATE_BASE_URL: Joi.string().required(),
        RATE_GRPC_URL: Joi.string().required(),
        PORT: Joi.number().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
      }),
    }),
    HealthModule,
    RatesModule,
  ],
})
export class AppModule {}
