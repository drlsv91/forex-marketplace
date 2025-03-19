import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  getMockedUserServiceProviders,
  mockWalletService,
} from './__mock__/mocked-user-provider';
import { createUserDto } from './__mock__/user-dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { compare } from 'bcryptjs';

const users = [];
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: getMockedUserServiceProviders(users),
    }).compile();

    service = module.get<UsersService>(UsersService);

    await service.onModuleInit();
  });

  afterEach(() => {
    users.splice(0);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = await service.create(createUserDto);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(createUserDto.email);
      expect(user.fullName).toBe(createUserDto.fullName);
      const fetchedUser = await service.getUser({ id: user.id });
      expect(user.id).toBe(fetchedUser.id);
      expect(await compare(createUserDto.password, fetchedUser.password)).toBe(
        true
      );
      expect(mockWalletService.createWallet).toHaveBeenLastCalledWith({
        userId: user.id,
        currency: 'USD',
      });
    });
    it("should throw UnprocessableEntityException('User email already exist')", async () => {
      await service.create(createUserDto);
      await expect(service.create(createUserDto)).rejects.toThrow(
        UnprocessableEntityException
      );
    });
  });

  describe('getUser', () => {
    it('should return user record', async () => {
      const createdUser = await service.create(createUserDto);
      const user = await service.getUser({ id: createdUser.id });
      expect(user).toBeDefined();
      expect(user.id).toBe(createdUser.id);
      expect(user.email).toBe(createdUser.email);
    });
  });
  describe('findOneAndUpdate', () => {
    it('should update user record', async () => {
      const createdUser = await service.create(createUserDto);
      const newLastLoginTimestamp = new Date();
      const updatedUser = await service.findOneAndUpdate(
        { id: createdUser.id },
        { lastLoginTimestamp: newLastLoginTimestamp }
      );

      expect(updatedUser.lastLoginTimestamp instanceof Date).toBe(true);
      expect(updatedUser.lastLoginTimestamp.getTime()).toBe(
        newLastLoginTimestamp.getTime()
      );
    });
  });
});
