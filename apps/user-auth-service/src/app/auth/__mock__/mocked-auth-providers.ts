import { getRepositoryToken } from '@nestjs/typeorm';

import {
  getMockedConnectionProvider,
  getRepositoryMethods,
} from '@forex-marketplace/testing';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { AuthService } from '../auth.service';

export const getMockedAuthServiceProviders = (users: Partial<UserEntity>[]) => [
  UsersService,
  AuthService,
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

  getMockedConnectionProvider(UserEntity, users),
];
