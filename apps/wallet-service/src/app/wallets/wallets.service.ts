import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { Repository } from 'typeorm';

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
