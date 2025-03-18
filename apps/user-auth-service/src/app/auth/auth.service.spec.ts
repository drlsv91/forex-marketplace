import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getMockedAuthServiceProviders } from './__mock__/mocked-auth-providers';
import { UsersService } from '../users/users.service';
import { createUserDto } from '../users/__mock__/user-dto';
import { Response } from 'express';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
const users = [];
describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: getMockedAuthServiceProviders(users),
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    users.splice(0);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('login', () => {
    it('should login user', async () => {
      const user = await userService.create(createUserDto);
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;
      const findOneAndUpdateSpy = jest
        .spyOn(userService, 'findOneAndUpdate')
        .mockResolvedValueOnce({
          ...user,
          lastLoginTimestamp: new Date(),
        } as any);

      const result = await service.login(user as UserEntity, mockResponse);

      expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        { id: user.id },
        { lastLoginTimestamp: expect.any(Date) }
      );

      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: user.id,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'Authentication',
        'mockToken',
        {
          httpOnly: true,
          expires: expect.any(Date),
        }
      );
      expect(result).toEqual({
        access_token: 'mockToken',
        user: {
          email: user.email,
          full_name: user.fullName,
        },
      });
    });
  });
});
