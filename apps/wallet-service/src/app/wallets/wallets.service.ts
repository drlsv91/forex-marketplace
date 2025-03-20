import {
  BadRequestException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletEntity } from './entities/wallet.entity';
import {
  TransactionType,
  WalletTransactionEntity,
} from './entities/transaction.entity';
import { UpdateWalletBalanceDto } from './dto/update-wallet.dto';
import { CreateTransaction, ListTranxDto } from './dto/transaction.dto';
import { CreateWalletRequest, UpdateWalletRequest } from 'types/proto/wallet';
import { PageDto, TRADE_TYPE } from '@forex-marketplace/common';
import { User } from 'types/proto/auth';

@Injectable()
export class WalletsService {
  private readonly logger = new Logger(WalletEntity.name);
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly transactionRepository: Repository<WalletTransactionEntity>,
    private readonly dataSource: DataSource
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    await this.validateCreateWallet(createWalletDto);
    const createPayload = this.walletRepository.create(createWalletDto);
    const wallet = await this.walletRepository.save(createPayload);
    return wallet;
  }

  async getTradeWallet({ userId, currency }: CreateWalletRequest) {
    const wallet = await this.walletRepository.findOne({
      where: { userId, currency },
    });
    if (wallet) return wallet;

    const createPayload = this.walletRepository.create({
      userId,
      currency,
    });

    return this.walletRepository.save(createPayload);
  }
  async getUserWallets(
    filter: { userId: string; currency: string },
    manager: EntityManager = this.walletRepository.manager
  ) {
    const wallets = await manager.find(WalletEntity, {
      where: filter,
    });

    const responseWallets = [];

    if (wallets.length) {
      for (const wallet of wallets) {
        responseWallets.push(wallet.toDto());
      }
    }
    return responseWallets;
  }
  async getOrCreateUserWallet(
    filter: { userId: string; currency: string },
    manager: EntityManager = this.walletRepository.manager
  ) {
    const wallet = await manager.findOne(WalletEntity, {
      where: filter,
    });

    if (!wallet) {
      const createWallet = manager.create(WalletEntity, filter);
      return manager.save(createWallet);
    }

    return wallet;
  }

  async credit(creditWalletDto: UpdateWalletBalanceDto) {
    const { amount, userId, currency, trxType } = creditWalletDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userWalletFilter = { currency, userId };
      const wallet = await this.getOrCreateUserWallet(
        userWalletFilter,
        queryRunner.manager
      );
      const balanceBefore = wallet.balance;

      wallet.balance += amount;

      await queryRunner.manager.save(WalletEntity, wallet);

      const transaction = this.transactionRepository.create(
        new CreateTransaction(
          wallet,
          { id: userId } as User,
          amount,
          trxType ?? TransactionType.CREDIT,
          balanceBefore
        )
      );
      await queryRunner.manager.save(WalletTransactionEntity, transaction);

      await queryRunner.commitTransaction();

      return await this.walletRepository.findOne({
        where: { id: wallet.id },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(err);
      throw new BadRequestException('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  async debit({ userId, amount, currency, trxType }: UpdateWalletBalanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userWalletFilter = { currency, userId };
      const wallet = await this.getOrCreateUserWallet(
        userWalletFilter,
        queryRunner.manager
      );
      const balanceBefore = wallet.balance;

      if (wallet.balance < amount)
        throw new BadRequestException('Insufficient balance');

      wallet.balance -= amount;
      await queryRunner.manager.save(wallet);

      const transaction = this.transactionRepository.create(
        new CreateTransaction(
          wallet,
          { id: userId } as User,
          amount,
          trxType ?? TransactionType.DEBIT,
          balanceBefore
        )
      );
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      return await this.walletRepository.findOne({
        where: { id: wallet.id },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(
        error.message || 'Transaction failed'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async tradeTranx({ type, userId, amount, currency }: UpdateWalletRequest) {
    if (type == TRADE_TYPE.BUY) {
      return await this.debit({
        userId,
        amount,
        currency,
        trxType: TransactionType.TRADE,
      });
    }

    if (type == TRADE_TYPE.SELL) {
      return await this.credit({
        amount,
        userId,
        currency,
        trxType: TransactionType.TRADE,
      });
    }

    throw new BadRequestException(`Trade type (${type}) is not supported`);
  }

  async getTransactions(dto: ListTranxDto) {
    const [items, count] = await this.transactionRepository.findAndCount({
      where: {
        userId: dto.user.id,
        walletId: dto.walletId,
      },
      take: dto.pageSize,
      skip: dto.skip,
      order: { createdAt: dto.order },
    });

    return new PageDto(items, count, dto);
  }

  private async validateCreateWallet({ currency, userId }: CreateWalletDto) {
    const wallet = await this.walletRepository.findOne({
      where: { currency, userId },
    });
    if (wallet) {
      throw new UnprocessableEntityException('User wallet already exist');
    }
    return wallet;
  }
}
