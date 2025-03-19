import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';
import {
  getMockedConnectionProvider,
  getRepositoryMethods,
} from '@forex-marketplace/testing';
import { WALLET_SERVICE_NAME } from 'types/proto/wallet';
import { of } from 'rxjs';

export const mockWalletService = {
  createWallet: jest.fn().mockReturnValue(of({ success: true })),
};

const mockClientGrpc = {
  getService: jest.fn().mockReturnValue(mockWalletService),
};

export const getMockedUserServiceProviders = (users: Partial<UserEntity>[]) => [
  UsersService,

  {
    provide: getRepositoryToken(UserEntity),
    useValue: {
      ...getRepositoryMethods(UserEntity),
    },
  },

  {
    provide: WALLET_SERVICE_NAME,
    useValue: mockClientGrpc,
  },

  getMockedConnectionProvider(UserEntity, users),
];
