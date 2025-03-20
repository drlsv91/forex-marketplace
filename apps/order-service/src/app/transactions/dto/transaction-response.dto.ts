import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto, PageOptionsDto } from '@forex-marketplace/common';
import {
  OrderTransactionEntity,
  OrderTransactionStatus,
} from '../entities/transaction.entity';
import { OrderResponse } from '../../orders/dto/order-response';
import { User } from '@forex-marketplace/grpc';

export class OrderTransactionResponse extends AbstractDto {
  @ApiProperty({
    description: 'excuted order amount',
    example: 100,
  })
  executedAmount: number;

  @ApiProperty({
    description: 'Executed order price per unit',
    example: 100,
  })
  executionPrice: number;

  @ApiProperty({
    description: 'transaction fee',
    example: 100,
  })
  fee: number;

  @ApiProperty({
    description: 'transaction status',
    example: 100,
  })
  status: OrderTransactionStatus;
  @ApiProperty({
    description: 'order',
  })
  order: OrderResponse;

  constructor(trx: OrderTransactionEntity) {
    super(trx);
    this.order = trx.order;
    this.status = trx.status;
    this.fee = trx.fee;
    this.executedAmount = trx.executedAmount;
    this.executionPrice = trx.executionPrice;
  }
}

export class ListTranxDto extends PageOptionsDto {
  user: User;
}
export class GetOrderTranxDto extends ListTranxDto {
  orderId: string;
}
