import { getRepositoryToken } from '@nestjs/typeorm';
import {
  getMockedConnectionProvider,
  getRepositoryMethods,
} from '@forex-marketplace/testing';
import { OrderTransactionEntity } from '../transactions/entities/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';

export const getMockedTransactionsServiceProviders = (
  trxs: Partial<OrderTransactionEntity>[]
) => [
  TransactionsService,

  {
    provide: getRepositoryToken(OrderTransactionEntity),
    useValue: {
      ...getRepositoryMethods(OrderTransactionEntity),
    },
  },

  getMockedConnectionProvider(OrderTransactionEntity, trxs),
];
