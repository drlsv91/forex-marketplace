import { randomBytes } from 'crypto';
import {
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { User } from 'types/proto/auth';

export class CreateTransaction {
  walletId: string;
  userId: string;
  amount: number;
  transactionType: TransactionType;
  reference: string;
  currency: string;
  description: string;
  status: TransactionStatus;
  previousBal: number;
  constructor(
    wallet: WalletEntity,
    user: User,
    amount: number,
    transactionType: TransactionType,
    previousBal: number
  ) {
    this.reference = this.generateReference(transactionType);
    this.amount = amount;
    this.walletId = wallet.id;
    this.transactionType = transactionType;
    this.status = TransactionStatus.COMPLETED;
    this.previousBal = previousBal;
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
