import { WALLET_SERVICE_NAME, WalletServiceClient } from 'types/proto/wallet';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ExecuteOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_STATUS, OrderEntity } from './entities/order.entity';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from 'types/proto/auth';
import {
  OrderTransactionEntity,
  OrderTransactionStatus,
} from '../transactions/entities/transaction.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PageDto, TRADE_TYPE } from '@forex-marketplace/common';
import { ListOrderDto } from './dto/order-response';

@Injectable()
export class OrdersService implements OnModuleInit {
  private walletService: WalletServiceClient;
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderTransactionEntity)
    private readonly orderTrxRepository: Repository<OrderTransactionEntity>,
    private readonly dataSource: DataSource,
    @Inject(WALLET_SERVICE_NAME)
    private readonly clientWallet: ClientGrpc
  ) {}

  async onModuleInit() {
    this.walletService =
      this.clientWallet.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  async placeOrder({
    user,
    amount,
    currencyPair,
    orderType,
    price,
    tradeType,
    expiresAt,
  }: CreateOrderDto) {
    const totalAmount = amount * price;

    await this.validateWalletBalance({
      totalAmount,
      currencyPair,
      tradeType,
      userId: user.id,
    });

    const createOrder = this.orderRepository.create({
      pricePerUnit: price,
      userId: user.id,
      amount,
      currencyPair,
      orderType,
      tradeType,
      expiresAt,
    });
    return this.orderRepository.save(createOrder);
  }

  async executeOrder(executeOrderDto: ExecuteOrderDto) {
    const { user, executedAmount, executionPrice } = executeOrderDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.validateExecuteOrder(
        user,
        executeOrderDto,
        queryRunner.manager
      );

      const [baseCurrency, quoteCurrency] = order.currencyPair.split('/');
      const fee = 0.0005;
      const totalAmount = order.amount * order.pricePerUnit + fee;

      await this.validateWalletBalance({
        totalAmount,
        currencyPair: order.currencyPair,
        tradeType: order.tradeType,
        userId: user.id,
      });

      if (order.tradeType === TRADE_TYPE.BUY) {
        await firstValueFrom(
          this.walletService.trade({
            userId: user.id,
            currency: baseCurrency,
            amount: totalAmount,
            type: order.tradeType,
          })
        );
      }

      order.executedAmount = executedAmount;
      order.executionPrice = executionPrice;
      if (order.tradeType === TRADE_TYPE.SELL) {
        // implement assest "lock"  as reserved
        await firstValueFrom(
          this.walletService.trade({
            type: order.tradeType,
            userId: user.id,
            currency: quoteCurrency,
            amount: totalAmount,
          })
        );
      }

      if (order.executedAmount >= order.amount) {
        order.status = ORDER_STATUS.FILLED;
      } else {
        order.status = ORDER_STATUS.PARIALLY_FILLED;
      }

      const orderTrx = this.orderTrxRepository.create({
        order,
        executedAmount,
        executionPrice,
        fee,
        status: OrderTransactionStatus.COMPLETED,
      });

      await queryRunner.manager.save(orderTrx);
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return orderTrx;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(
        error.message || 'Transaction failed'
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getOrder(
    user: User,
    filter: FindOptionsWhere<OrderEntity> = {},
    manager: EntityManager = this.orderRepository.manager
  ) {
    const order = await manager.findOne(OrderEntity, {
      where: { userId: user.id, ...filter },
    });

    if (!order) {
      throw new NotFoundException('order does not exist');
    }

    return order;
  }
  async listOrders(dto: ListOrderDto) {
    const [items, count] = await this.orderRepository.findAndCount({
      where: {
        userId: dto.user.id,
      },
      take: dto.pageSize,
      skip: dto.skip,
      order: { createdAt: dto.order },
    });

    return new PageDto(items, count, dto);
  }

  private async validateWalletBalance(data: {
    totalAmount: number;
    userId: string;
    currencyPair: string;
    tradeType: TRADE_TYPE;
  }) {
    const { totalAmount, userId, currencyPair, tradeType } = data;
    const [baseCurrency, quoteCurrency] = currencyPair.split('/');

    if (tradeType === TRADE_TYPE.BUY) {
      const wallet = await firstValueFrom(
        this.walletService.getTradeWallet({
          userId,
          currency: baseCurrency,
        })
      );

      if (wallet.balance < totalAmount) {
        throw new BadRequestException(
          `Insufficient balance in (${baseCurrency}) currency`
        );
      }
    }

    if (tradeType === TRADE_TYPE.SELL) {
      const wallet = await firstValueFrom(
        this.walletService.getTradeWallet({
          userId,
          currency: quoteCurrency,
        })
      );

      if (wallet.balance < totalAmount) {
        throw new BadRequestException(
          `Insufficient assets(${quoteCurrency}) to sell`
        );
      }
    }
  }
  private async validateExecuteOrder(
    user: User,
    { executedAmount, orderId }: ExecuteOrderDto,
    manager: EntityManager = this.orderRepository.manager
  ) {
    const order = await this.getOrder(user, { id: orderId }, manager);

    if (
      ![ORDER_STATUS.PARIALLY_FILLED, ORDER_STATUS.PENDING].includes(
        order.status
      )
    ) {
      throw new BadRequestException(`Invalid order status`);
    }

    const remainingAmount = order.amount - order.executedAmount;

    if (executedAmount <= 0 || executedAmount > remainingAmount) {
      throw new BadRequestException(
        `Invalid execution amount. Remaining: ${remainingAmount}`
      );
    }
    return order;
  }
}
