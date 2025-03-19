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
      }),
    }),
    HealthModule,
    WalletsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
