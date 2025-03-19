import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '@forex-marketplace/common';

import {
  ORDER_STATUS,
  ORDER_TYPE,
  OrderEntity,
  TRADE_TYPE,
} from '../entities/order.entity';

export class OrderResponse extends AbstractDto {
  @ApiProperty({
    description: 'User ID',
    example: 'b7869646-0290-4aaa-8549-1f40014f81a2',
  })
  userId: string;

  @ApiProperty({
    description: "Forex currency pair (e.g., 'EUR/USD",
    example: 'EUR/USD',
  })
  currencyPair: string;

  @ApiProperty({
    description: 'Order type',
    example: ORDER_TYPE.market,
  })
  orderType: ORDER_TYPE;
  @ApiProperty({
    description: 'trade type',
    example: TRADE_TYPE.buy,
  })
  tradeType: TRADE_TYPE;
  @ApiProperty({
    description: 'order status type',
    example: ORDER_STATUS.pending,
  })
  status: ORDER_STATUS;
  @ApiProperty({
    description: 'Price per unit (only for LIMIT, STOP_LOSS, TAKE_PROFIT)',
    example: 100,
  })
  amount: number;
  @ApiProperty({
    description: 'order price per unit',
    example: 100,
  })
  executedAmount: number;
  @ApiProperty({
    description: 'order price per unit',
    example: 100,
  })
  pricePerUnit: number;

  constructor(order: OrderEntity) {
    super(order);
    this.userId = order.userId;
    this.currencyPair = order.currencyPair;
    this.orderType = order.orderType;
    this.tradeType = order.tradeType;
    this.status = order.status;
    this.amount = order.amount;
    this.executedAmount = order.executedAmount;
    this.pricePerUnit = order.pricePerUnit;
  }
}
