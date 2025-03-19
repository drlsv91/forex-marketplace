import { AbstractEntity } from '@forex-marketplace/common';
import { Check, Column, Entity, UpdateDateColumn } from 'typeorm';
import { WalletTransactionResponse } from '../dto/wallet-response.dto';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  TRADE = 'TRADE',
  TRANSFER = 'TRANSFER',
}
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('wallet_transactions')
@Check(`amount > 0`)
export class WalletTransactionEntity extends AbstractEntity<WalletTransactionResponse> {
  @Column({ type: 'uuid' })
  walletId: string;
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'decimal', scale: 8, precision: 18 })
  amount: number;
  @Column({ type: 'decimal', scale: 8, precision: 18, nullable: true })
  balanceBefore: number;
  @Column({ type: 'decimal', scale: 8, precision: 18, nullable: true })
  balanceAfter: number;
  @Column({ type: 'varchar', length: 50, unique: true })
  reference: string;
  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar', length: 10 })
  currency: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  dtoClass = WalletTransactionResponse;
}
