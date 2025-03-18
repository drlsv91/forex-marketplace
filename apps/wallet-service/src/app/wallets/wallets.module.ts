import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { DatabaseModule } from '@forex-marketplace/common';
import { WalletEntity } from './entities/wallet.entity';
import { WalletTransactionEntity } from './entities/transaction.entity';

@Module({
  imports: [DatabaseModule.forFeature([WalletEntity, WalletTransactionEntity])],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
