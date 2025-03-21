import { Test, TestingModule } from '@nestjs/testing';
import { RatesService } from './rates.service';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { RedisService } from '@forex-marketplace/common';
describe('RatesService', () => {
  let service: RatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatesService,
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
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RatesService>(RatesService);
  });

  it('should be defined!', () => {
    expect(service).toBeDefined();
  });
});
