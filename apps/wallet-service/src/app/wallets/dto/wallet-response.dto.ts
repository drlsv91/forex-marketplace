import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto, TransformCurrency } from '@forex-marketplace/common';
import { WalletEntity } from '../entities/wallet.entity';
import {
  TransactionStatus,
  TransactionType,
  WalletTransactionEntity,
} from '../entities/transaction.entity';
import { IsCurrency, IsNotEmpty } from 'class-validator';

export class WalletResponse extends AbstractDto {
  @ApiProperty({
    description: 'User ID',
    example: 'b7869646-0290-4aaa-8549-1f40014f81a2',
  })
  userId: string;

  @ApiProperty({ description: 'Wallet balance', example: 0 })
  balance: number;

  @ApiProperty({ description: 'Wallet currency', example: 'USD' })
  currency: string;

  constructor(wallet: WalletEntity) {
    super(wallet);
    this.userId = wallet.userId;
    this.balance = wallet.balance;
    this.currency = wallet.currency;
  }
}

export class WalletTransactionResponse extends AbstractDto {
  @ApiProperty({
    description: 'User ID',
    example: 'b7869646-0290-4aaa-8549-1f40014f81a2',
  })
  userId: string;
  @ApiProperty({
    description: 'Links to the wallet',
    example: 'b7869646-0290-4aaa-8549-1f40014f81a2',
  })
  walletId: string;

  @ApiProperty({
    description: 'Transaction type',
    example: TransactionType.CREDIT,
  })
  transactionType: TransactionType;
  @ApiProperty({
    description: 'Transaction status',
    example: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ApiProperty({ description: 'Transaction amount', example: 0 })
  amount: number;

  @ApiProperty({ description: 'currency', example: 'USD' })
  currency: string;

  @ApiProperty({
    description: 'unique transaction reference',
    example: 'REF_b786964602904aaa85491f40014f81a2',
  })
  reference: string;

  constructor(transaction: WalletTransactionEntity) {
    super(transaction);
    this.walletId = transaction.walletId;
    this.userId = transaction.userId;
    this.amount = transaction.amount;
    this.currency = transaction.currency;
    this.status = transaction.status;
    this.transactionType = transaction.transactionType;
    this.reference = transaction.reference;
  }
}

export class GetUserWalletDto {
  @IsNotEmpty()
  @IsCurrency()
  @TransformCurrency()
  @ApiProperty({ description: 'currency', example: 'USD' })
  currency: string;

  userId: string;
}
