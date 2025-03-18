import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { User } from 'types/proto/auth';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    await this.validateCreateWallet(createWalletDto);
    const createPayload = this.walletRepository.create(createWalletDto);
    const wallet = await this.walletRepository.save(createPayload);

    return wallet;
  }
  async getWallet(user: User) {
    const wallet = await this.walletRepository.findOne({
      where: { userId: user.id },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet does not exist');
    }

    return wallet;
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
