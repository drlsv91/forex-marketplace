import { getRepositoryToken } from '@nestjs/typeorm';

import {
  getMockedConnectionProvider,
  getMockedDataSource,
  getRepositoryMethods,
} from '@forex-marketplace/testing';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderTransactionEntity } from '../transactions/entities/transaction.entity';
import { OrdersService } from '../orders/orders.service';
import { of } from 'rxjs';
import { WALLET_SERVICE_NAME } from 'types/proto/wallet';
import { RATE_SERVICE_NAME } from 'types/proto/rates';
import { NOTIFICATION_SERVICE } from '@forex-marketplace/common';
import { user } from './data';

export const defaultWallet = {
  balance: 1200,
  userId: user.id,
  currency: 'USD',
};
export const defaultRate = { rates: { USD: 1.1, EUR: 2.5 } };
export const mockWalletService = {
  createWallet: jest.fn().mockReturnValue(of({ success: true })),
  getTradeWallet: jest.fn().mockReturnValue(of(defaultWallet)),
  trade: jest.fn().mockReturnValue(of(defaultWallet)),
};
export const mockRateService = {
  getRates: jest.fn().mockReturnValue(of(defaultRate)),
};

const mockRateClientGrpc = {
  getService: jest.fn().mockReturnValue(mockRateService),
};
const mockWalletClientGrpc = {
  getService: jest.fn().mockReturnValue(mockWalletService),
};

export const getMockedOrderServiceProviders = (
  orders: Partial<OrderEntity>[],
  trxs: Partial<OrderTransactionEntity>[]
) => [
  OrdersService,
  {
    provide: WALLET_SERVICE_NAME,
    useValue: mockWalletClientGrpc,
  },
  {
    provide: RATE_SERVICE_NAME,
    useValue: mockRateClientGrpc,
  },
  {
    provide: NOTIFICATION_SERVICE,
    useValue: {
      emit: jest.fn().mockReturnValue(of({})),
      send: jest.fn().mockReturnValue(of({})),
    },
  },

  {
    provide: getRepositoryToken(OrderEntity),
    useValue: {
      ...getRepositoryMethods(OrderEntity),
    },
  },
  {
    provide: getRepositoryToken(OrderTransactionEntity),
    useValue: {
      ...getRepositoryMethods(OrderTransactionEntity),
    },
  },
  getMockedDataSource(OrderEntity),

  getMockedConnectionProvider(OrderEntity, orders),
  getMockedConnectionProvider(OrderTransactionEntity, trxs),
];
