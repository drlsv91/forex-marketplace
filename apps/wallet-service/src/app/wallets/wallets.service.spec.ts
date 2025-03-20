import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { getMockedWalletServiceProviders } from './__mock__/mocked-wallet-providers';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  TransactionType,
  WalletTransactionEntity,
} from './entities/transaction.entity';
import { PageDto, TRADE_TYPE } from '@forex-marketplace/common';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
const wallets = [];
const txs = [];
describe('WalletsService', () => {
  let service: WalletsService;
  let walletRepository: Repository<WalletEntity>;
  let trxRepository: Repository<WalletTransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: getMockedWalletServiceProviders(wallets, txs),
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    walletRepository = module.get<Repository<WalletEntity>>(
      getRepositoryToken(WalletEntity)
    );
    trxRepository = module.get<Repository<WalletTransactionEntity>>(
      getRepositoryToken(WalletTransactionEntity)
    );
  });

  afterEach(() => {
    wallets.splice(0);
    txs.splice(0);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create wallet', async () => {
      const userId = faker.string.uuid();
      const wallet = await service.create({
        currency: 'USD',
        userId,
      });

      expect(wallet.currency).toBe('USD');
      expect(wallet.userId).toBe(userId);
      const foundWallet = await walletRepository.findOne({
        where: { id: wallet.id },
      });

      expect(foundWallet.id).toBe(wallet.id);
    });
    it('should throw UnprocessableEntityException if user wallet already exist', async () => {
      const userId = faker.string.uuid();
      const currency = 'USD';
      await service.create({
        currency,
        userId,
      });

      await expect(service.create({ currency, userId })).rejects.toThrow(
        UnprocessableEntityException
      );
    });
  });
  describe('getTradeWallet', () => {
    it('should return wallets', async () => {
      const currencies = ['USD', 'NGN'];
      const userId = faker.string.uuid();
      for (const currency of currencies) {
        await service.create({
          currency,
          userId,
        });
      }
      const usd_wallet = await service.getTradeWallet({
        userId,
        currency: currencies[0],
      });
      expect(usd_wallet.currency).toBe(currencies[0]);
      expect(usd_wallet.userId).toBe(userId);

      const ngn_wallet = await service.getTradeWallet({
        userId,
        currency: currencies[1],
      });
      expect(ngn_wallet.currency).toBe(currencies[1]);
      expect(ngn_wallet.userId).toBe(userId);
    });
  });
  describe('getUserWallets', () => {
    it('should return wallets', async () => {
      const currencies = ['USD', 'NGN'];
      const userId = faker.string.uuid();
      for (const currency of currencies) {
        await service.create({
          currency,
          userId,
        });
      }
      const wallets = await service.getUserWallets({
        userId,
      });
      expect(wallets.length).toBe(2);
    });
  });
  describe('getOrCreateUserWallet', () => {
    it('should return create a wallet if wallet does not exist', async () => {
      const currency = 'AZA';
      const userId = faker.string.uuid();

      const wallet = await service.getOrCreateUserWallet({
        userId,
        currency,
      });
      expect(walletRepository.manager.create).toHaveBeenCalledWith(
        WalletEntity,
        {
          userId,
          currency,
        }
      );
      expect(walletRepository.manager.save).toHaveBeenCalledWith(WalletEntity);
      expect(wallet.id).toBeDefined();
    });
    it('should return an existing wallet', async () => {
      const currency = 'AZA';
      const userId = faker.string.uuid();
      const existingWallet = await service.create({ currency, userId });

      const wallet = await service.getOrCreateUserWallet({
        userId,
        currency,
      });

      expect(walletRepository.manager.create).not.toHaveBeenCalled();

      expect(existingWallet.id).toBe(wallet.id);
    });
  });

  describe('credit', () => {
    const currency = 'USD';
    const userId = faker.string.uuid();
    it('it should credit wallet', async () => {
      const wallet = await service.create({ currency, userId });

      const creditedWallet = await service.credit({
        userId,
        amount: 10,
        currency,
      });

      expect(creditedWallet.balance).toBe(10);
      expect(creditedWallet.id).toBe(wallet.id);

      const storedWallet = await walletRepository.findOne({
        where: { userId, currency },
      });
      const tx = await trxRepository.findOne({
        where: { walletId: wallet.id },
      });

      expect(storedWallet.balance).toBe(creditedWallet.balance);
      expect(tx).toBeDefined();
      expect(tx.balanceBefore).toBe(0);
      expect(tx.balanceAfter).toBe(10);
      expect(tx.reference).toBeDefined();
    });
  });
  describe('debit', () => {
    const currency = 'USD';
    const userId = faker.string.uuid();
    it('it should debit wallet', async () => {
      const wallet = await service.create({ currency, userId });

      await service.credit({
        userId,
        amount: 10,
        currency,
      });

      await service.debit({ userId, currency, amount: 5 });
      const trxs = await trxRepository.find({
        where: { walletId: wallet.id },
      });

      expect(txs.length).toBe(2);
      const debitTrx = trxs.find(
        (tx) => tx.transactionType === TransactionType.DEBIT
      );
      expect(debitTrx).toBeDefined();
      expect(debitTrx.balanceBefore).toBe(10);
      expect(debitTrx.balanceAfter).toBe(5);
    });
    it('it should throw BadRequestException if insufficient funds', async () => {
      await service.create({ currency, userId });

      await service.credit({
        userId,
        amount: 10,
        currency,
      });

      await expect(
        service.debit({ userId, currency, amount: 100 })
      ).rejects.toThrow(
        new UnprocessableEntityException('Insufficient balance')
      );
    });
  });
  describe('tradeTranx', () => {
    const currency = 'USD';
    const userId = faker.string.uuid();
    it('it should debit wallet', async () => {
      await service.create({ currency, userId });
      const amount = 100;
      const wallet = await service.credit({ amount: 1000, userId, currency });
      const debitSpy = jest
        .spyOn(service, 'debit')
        .mockResolvedValueOnce({ ...wallet, balance: 1000 - amount } as any);

      await service.tradeTranx({
        currency,
        type: TRADE_TYPE.BUY,
        userId,
        amount,
      });
      expect(debitSpy).toHaveBeenCalledWith({
        userId,
        amount,
        currency,
        trxType: TransactionType.TRADE,
      });
    });
    it('it should credit wallet', async () => {
      await service.create({ currency, userId });
      const amount = 100;
      const wallet = await service.credit({ amount: 20, userId, currency });
      const creditSpy = jest
        .spyOn(service, 'credit')
        .mockResolvedValueOnce({ ...wallet, balance: 20 + amount } as any);

      await service.tradeTranx({
        currency,
        type: TRADE_TYPE.SELL,
        userId,
        amount,
      });
      expect(creditSpy).toHaveBeenCalledWith({
        userId,
        amount,
        currency,
        trxType: TransactionType.TRADE,
      });
    });
    it('it should throw BadRequestException', async () => {
      await service.create({ currency, userId });
      const amount = 100;
      await service.credit({ amount: 20, userId, currency });

      await expect(
        service.tradeTranx({
          currency,
          type: 'INVALID_TYPE',
          userId,
          amount,
        })
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('getTransactions', () => {
    const currency = 'USD';
    const userId = faker.string.uuid();
    it('it should return wallet transactions', async () => {
      await service.create({ currency, userId });

      await service.credit({ amount: 1000, userId, currency });

      const transactionData = await service.getTransactions({
        skip: 0,
        user: { id: userId, email: '', fullName: '' },
      });

      expect(transactionData).toBeInstanceOf(PageDto);
      expect(transactionData.data.length).toBe(1);
      expect(transactionData.meta.itemCount).toBe(1);
    });
  });
});
