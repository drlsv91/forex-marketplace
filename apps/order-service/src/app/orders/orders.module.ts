import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '@forex-marketplace/common';
import { OrderEntity } from './entities/order.entity';
import { OrderTransactionEntity } from '../transactions/entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_PACKAGE_NAME, WALLET_SERVICE_NAME } from 'types/proto/wallet';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

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
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
