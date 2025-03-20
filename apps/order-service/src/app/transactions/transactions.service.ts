import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTransactionEntity } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { GetOrderTranxDto, ListTranxDto } from './dto/transaction-response.dto';
import { PageDto } from '@forex-marketplace/common';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(OrderTransactionEntity)
    private readonly tranxRepository: Repository<OrderTransactionEntity>
  ) {}

  async getByOrder(dto: GetOrderTranxDto) {
    const [items, count] = await this.tranxRepository.findAndCount({
      where: {
        order: { id: dto.orderId, userId: dto.user.id },
      },
      take: dto.pageSize,
      skip: dto.skip,
      order: { createdAt: dto.order },
      relations: { order: true },
    });

    return new PageDto(items, count, dto);
  }
  async listTrnxs(dto: ListTranxDto) {
    const [items, count] = await this.tranxRepository.findAndCount({
      where: {
        order: { userId: dto.user.id },
      },
      take: dto.pageSize,
      skip: dto.skip,
      order: { createdAt: dto.order },
      relations: { order: true },
    });

    return new PageDto(items, count, dto);
  }
}
