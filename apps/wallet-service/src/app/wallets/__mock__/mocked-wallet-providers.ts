import { getRepositoryToken } from '@nestjs/typeorm';

import {
  getMockedConnectionProvider,
  getMockedDataSource,
  getRepositoryMethods,
} from '@forex-marketplace/testing';
import { WalletsService } from '../wallets.service';
import { WalletEntity } from '../entities/wallet.entity';
import { WalletTransactionEntity } from '../entities/transaction.entity';

export const getMockedWalletServiceProviders = (
  wallets: Partial<WalletEntity>[],
  trxs: Partial<WalletTransactionEntity>[]
) => [
  WalletsService,

  {
    provide: getRepositoryToken(WalletEntity),
    useValue: {
      ...getRepositoryMethods(WalletEntity),
    },
  },
  {
    provide: getRepositoryToken(WalletTransactionEntity),
    useValue: {
      ...getRepositoryMethods(WalletTransactionEntity),
    },
  },
  getMockedDataSource(WalletEntity),

  getMockedConnectionProvider(WalletEntity, wallets),
  getMockedConnectionProvider(WalletTransactionEntity, trxs),
];
