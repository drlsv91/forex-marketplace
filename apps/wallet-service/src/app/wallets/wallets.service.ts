import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from 'types/proto/auth';
import {
  TransactionStatus,
  TransactionType,
  WalletTransactionEntity,
} from './entities/transaction.entity';
import { UpdateWalletBalanceDto } from './dto/update-wallet.dto';
import { randomBytes } from 'crypto';

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
      const wallet = await this.getUserWallet(user, queryRunner.manager);

      const facilitator = {
        reference: this.generateReference(TransactionType.CREDIT),
        amount,
        description: `CREDIT:PAYSTACK:SENDERACC NAME`,
      };

      wallet.balance += facilitator.amount;
      await queryRunner.manager.save(wallet);

      const transaction = this.transactionRepository.create({
        walletId: wallet.id,
        userId: user.id,
        amount: facilitator.amount,
        transactionType: TransactionType.CREDIT,
        reference: facilitator.reference,
        description: facilitator.description,
        currency: 'USD',
        status: TransactionStatus.COMPLETED,
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
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

  async debit({ user, amount, type }: UpdateWalletBalanceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.validateTransactionType(
        [TransactionType.DEBIT, TransactionType.TRADE],
        type
      );

      const wallet = await this.getUserWallet(user, queryRunner.manager);

      if (wallet.balance < amount)
        throw new BadRequestException('Insufficient balance');

      wallet.balance -= amount;
      await queryRunner.manager.save(wallet);

      const transaction = this.transactionRepository.create({
        walletId: wallet.id,
        amount,
        transactionType: TransactionType.DEBIT,
        reference: this.generateReference(TransactionType.DEBIT),
        userId: user.id,
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
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

  private validateTransactionType(
    validTypes: TransactionType[],
    type: TransactionType
  ) {
    if (!validTypes.includes(type)) {
      throw new BadRequestException('Invalid transaction type');
    }
  }

  private generateReference(prefix = 'TXN'): string {
    const timestamp = Date.now().toString().slice(-8);
    const randomPart = randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${randomPart}`;
  }
}
