import { randomBytes } from 'crypto';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { User } from 'types/proto/auth';
import { PageOptionsDto } from '@forex-marketplace/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateTransaction {
  walletId: string;
  userId: string;
  amount: number;
  transactionType: TransactionType;
  reference: string;
  currency: string;
  description: string;
  status: TransactionStatus;
  balanceBefore: number;
  balanceAfter: number;
  constructor(
    wallet: WalletEntity,
    user: User,
    amount: number,
    transactionType: TransactionType,
    balanceBefore: number
  ) {
    this.reference = this.generateReference(transactionType);
    this.amount = amount;
    this.walletId = wallet.id;
    this.transactionType = transactionType;
    this.status = TransactionStatus.COMPLETED;
    this.balanceBefore = balanceBefore;
    this.balanceAfter = wallet.balance;
    this.currency = 'USD';
    this.userId = user.id;
    this.description = `${transactionType}:PAYSTACK:SENDER ACCNAME`;
  }

  private generateReference(prefix = 'TXN'): string {
    const timestamp = Date.now().toString().slice(-8);
    const randomPart = randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${randomPart}`;
  }
}

export class ListTranxDto extends PageOptionsDto {
  user: User;

  @ApiPropertyOptional({ description: 'allow filtering by wallet ID' })
  @IsUUID()
  @IsOptional()
  walletId: string;
}
