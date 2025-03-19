import {
  DatabaseModule,
  HealthModule,
  LoggerModule,
} from '@forex-marketplace/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { TransactionsModule } from './transactions/transactions.module';
import * as Joi from 'joi';
@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        WALLET_GRPC_URL: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
      }),
    }),
    HealthModule,
    OrdersModule,
    TransactionsModule,
  ],
})
export class AppModule {}
