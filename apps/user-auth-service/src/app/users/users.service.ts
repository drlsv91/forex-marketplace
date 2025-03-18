import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);

    const user = await this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      })
    );
    return user.toDto();
  }

  async getUser(
    filterQuery: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]
  ) {
    const user = await this.userRepository.findOne({ where: filterQuery });
    if (!user) {
      throw new NotFoundException('user not found');
    }
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
