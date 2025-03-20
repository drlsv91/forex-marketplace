import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getMockedTransactionsServiceProviders } from '../__mock__/mocked-transaction-providers';
import { faker } from '@faker-js/faker/.';
import { user } from '../__mock__/data';
import { Repository } from 'typeorm';
import { OrderTransactionEntity } from './entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageDto } from '@forex-marketplace/common';
const transactions = [];
describe('TransactionsService', () => {
  let service: TransactionsService;
  let trxRepository: Repository<OrderTransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: getMockedTransactionsServiceProviders(transactions),
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    trxRepository = module.get<Repository<OrderTransactionEntity>>(
      getRepositoryToken(OrderTransactionEntity)
    );
  });

  afterEach(() => {
    transactions.splice(0);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getByOrder', () => {
    it('should return transactions', async () => {
      const createTxData = {
        id: faker.string.uuid(),
        orderId: faker.string.uuid(),
        amount: 10,
        price: 1.2,
      };
      await trxRepository.save(
        trxRepository.create({
          id: createTxData.id,
          executedAmount: createTxData.amount,
          executionPrice: createTxData.price,
          order: { id: createTxData.orderId },
        })
      );
      const trxData = await service.getByOrder({
        orderId: createTxData.orderId,
        skip: 0,
        user,
      });
      expect(trxData).toBeInstanceOf(PageDto);
      expect(trxData.data.length).toBe(1);
      expect(trxData.data[0].id).toBe(createTxData.id);
    });
  });
  describe('listTrnxs', () => {
    it('should return all trxs', async () => {
      const createTxData = {
        id: faker.string.uuid(),
        orderId: faker.string.uuid(),
        amount: 10,
        price: 1.2,
      };
      await trxRepository.save(
        trxRepository.create({
          id: createTxData.id,
          executedAmount: createTxData.amount,
          executionPrice: createTxData.price,
          order: { id: createTxData.orderId },
        })
      );
      const trxData = await service.listTrnxs({
        skip: 0,
        user,
      });
      expect(trxData).toBeInstanceOf(PageDto);
      expect(trxData.data.length).toBe(1);
      expect(trxData.data[0].id).toBe(createTxData.id);
    });
  });
});
