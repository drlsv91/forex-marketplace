import { getRepositoryToken } from '@nestjs/typeorm';

import {
  getMockedConnectionProvider,
  getRepositoryMethods,
} from '@forex-marketplace/testing';
import { UserEntity } from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { AuthService } from '../auth.service';
import { getMockedUserServiceProviders } from '../../users/__mock__/mocked-user-provider';
import { UsersService } from '../../users/users.service';

export const getMockedAuthServiceProviders = (users: Partial<UserEntity>[]) => [
  AuthService,
  ...getMockedUserServiceProviders(users),
  {
    provide: getRepositoryToken(UserEntity),
    useValue: {
      ...getRepositoryMethods(UserEntity),
    },
  },
  {
    provide: ConfigService,
    useValue: {
      get: (name: string) => {
        if (name == 'JWT_EXPIRATION_MS') {
          return 3600;
        }
        return faker.string.alphanumeric(10);
      },
    },
  },

  {
    provide: JwtService,
    useValue: {
      sign: jest.fn().mockReturnValue('mockToken'),
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    },
  },
  {
    provide: UsersService,
    useValue: {
      findOneAndUpdate: jest.fn(),
      create: jest.fn(() => ({ id: '1' })),
    },
  },

  getMockedConnectionProvider(UserEntity, users),
];
