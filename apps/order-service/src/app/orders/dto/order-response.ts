import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto, TRADE_TYPE } from '@forex-marketplace/common';

import {
  ORDER_STATUS,
  ORDER_TYPE,
  OrderEntity,
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
    example: 'MARKET',
  })
  orderType: ORDER_TYPE;
  @ApiProperty({
    description: 'trade type',
    example: 'BUY',
  })
  tradeType: TRADE_TYPE;
  @ApiProperty({
    description: 'order status type',
    example: 'PENDING',
  })
  status: ORDER_STATUS;
  @ApiProperty({
    description: 'Price per unit (only for LIMIT, STOP_LOSS, TAKE_PROFIT)',
    example: 100,
  })
  amount: number;
  @ApiProperty({
    description: 'excuted order price per unit',
    example: 100,
  })
  executedAmount: number;
  @ApiProperty({
    description: 'executed order price per unit',
    example: 100,
  })
  executionPrice: number;
  @ApiProperty({
    description: 'order price per unit',
    example: 100,
  })
  pricePerUnit: number;
  @ApiPropertyOptional({
    description: 'Defines an expiration date for LIMIT or STOP orders.',
    example: new Date().toISOString(),
  })
  expiresAt?: Date;

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
    this.executionPrice = order.executionPrice;
    this.expiresAt = order.expiresAt;
  }
}
