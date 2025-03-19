import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from '@forex-marketplace/common';
import { OrderTransactionEntity } from './entities/transaction.entity';

@Module({
  imports: [DatabaseModule.forFeature([OrderTransactionEntity])],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
