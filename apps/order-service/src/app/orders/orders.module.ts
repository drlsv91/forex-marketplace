import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '@forex-marketplace/common';
import { OrderEntity } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  WALLET_PACKAGE_NAME,
  WALLET_SERVICE_NAME,
  RATE_PACKAGE_NAME,
  RATE_SERVICE_NAME,
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
} from '@forex-marketplace/grpc';
import { NOTIFICATION_SERVICE } from '@forex-marketplace/nestjs';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TransactionsModule } from '../transactions/transactions.module';
import { OrderTransactionEntity } from '../transactions/entities/transaction.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([OrderEntity, OrderTransactionEntity]),
    ClientsModule.registerAsync([
      {
        name: WALLET_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: WALLET_PACKAGE_NAME,
            protoPath: join(__dirname, 'proto/wallet.proto'),
            url: configService.getOrThrow('WALLET_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },

      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, 'proto/auth.proto'),
            url: configService.getOrThrow('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: RATE_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: RATE_PACKAGE_NAME,
            protoPath: join(__dirname, 'proto/rates.proto'),
            url: configService.getOrThrow('RATE_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: NOTIFICATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: NOTIFICATION_SERVICE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TransactionsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
