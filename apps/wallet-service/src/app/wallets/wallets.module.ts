import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { DatabaseModule } from '@forex-marketplace/common';
import { WalletEntity } from './entities/wallet.entity';
import { WalletTransactionEntity } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from '@forex-marketplace/grpc';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    DatabaseModule.forFeature([WalletEntity, WalletTransactionEntity]),
    ClientsModule.registerAsync([
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
    ]),
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
