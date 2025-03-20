import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { ClientGrpc } from '@nestjs/microservices';
import {
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from '@forex-marketplace/grpc';

@Injectable()
export class UsersService implements OnModuleInit {
  private walletService: WalletServiceClient;
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(WALLET_SERVICE_NAME)
    private readonly clientWallet: ClientGrpc
  ) {}

  async onModuleInit() {
    this.walletService =
      this.clientWallet.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);

    const user = await this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      })
    );
    //  currency can be dynamically injected based on the registered user country
    this.walletService
      .createWallet({ userId: user.id, currency: 'USD' })
      .subscribe((res) => {
        this.logger.log(`USER WALLET CREATED SUCC =>`, res);
      });

    return user.toDto();
  }

  async getUser(
    filterQuery: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]
  ) {
    const user = await this.userRepository.findOne({ where: filterQuery });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async findOneAndUpdate(
    filterQuery: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
    data: Partial<UserEntity>
  ) {
    const user = await this.getUser(filterQuery);
    const findParams = { id: user.id };
    await this.userRepository.update(findParams, data);
    return this.userRepository.findOne({ where: findParams });
  }

  async verifyUser(email: string, password: string) {
    const errorMessage = 'Invalid credentials';
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(errorMessage);
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException(errorMessage);
    }

    return user;
  }

  private async validateCreateUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new UnprocessableEntityException('User email already exist');
    }
  }
}
