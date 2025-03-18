import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';
import {
  getMockedConnectionProvider,
  getRepositoryMethods,
} from '@forex-marketplace/testing';

export const getMockedUserServiceProviders = (users: Partial<UserEntity>[]) => [
  UsersService,

  {
    provide: getRepositoryToken(UserEntity),
    useValue: {
      ...getRepositoryMethods(UserEntity),
    },
  },

  getMockedConnectionProvider(UserEntity, users),
];
