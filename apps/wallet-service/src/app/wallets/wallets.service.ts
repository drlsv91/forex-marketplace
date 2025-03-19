import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from 'types/proto/auth';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletEntity } from './entities/wallet.entity';
import {
  TransactionType,
  WalletTransactionEntity,
} from './entities/transaction.entity';
import { UpdateWalletBalanceDto } from './dto/update-wallet.dto';
import { CreateTransaction } from './dto/transaction.dto';

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
  async getUserWallet(
    user: User,
    manager: EntityManager = this.walletRepository.manager
  ) {
    const wallet = await manager.findOne(WalletEntity, {
      where: { userId: user.id },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet does not exist');
    }

    return wallet;
  }

  async credit(creditWalletDto: UpdateWalletBalanceDto) {
    const { amount, user } = creditWalletDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let wallet = await this.getUserWallet(user, queryRunner.manager);
      const balanceBefore = wallet.balance;

      wallet.balance += amount;

      await queryRunner.manager.save(WalletEntity, wallet);

      const transaction = this.transactionRepository.create(
        new CreateTransaction(
          wallet,
          user,
          amount,
          TransactionType.CREDIT,
          balanceBefore
        )
      );
      await queryRunner.manager.save(WalletTransactionEntity, transaction);

      await queryRunner.commitTransaction();
      wallet = await this.getUserWallet(user);
      return {
        message: 'Wallet credited successfully',
        balance: wallet.balance,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(err);
      throw new BadRequestException('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  async debit({ user, amount }: UpdateWalletBalanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let wallet = await this.getUserWallet(user, queryRunner.manager);
      const balanceBefore = wallet.balance;

      if (wallet.balance < amount)
        throw new BadRequestException('Insufficient balance');

      wallet.balance -= amount;
      await queryRunner.manager.save(wallet);

      const transaction = this.transactionRepository.create(
        new CreateTransaction(
          wallet,
          user,
          amount,
          TransactionType.DEBIT,
          balanceBefore
        )
      );
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      wallet = await this.getUserWallet(user);
      return {
        message: 'Wallet debited successfully',
        balance: wallet.balance,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message || 'Transaction failed');
    } finally {
      await queryRunner.release();
    }
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
