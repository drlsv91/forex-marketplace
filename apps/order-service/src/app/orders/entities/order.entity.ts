import { AbstractEntity } from '@forex-marketplace/common';
import { Check, Column, Entity, UpdateDateColumn } from 'typeorm';
import { OrderResponse } from '../dto/order-response';
export enum ORDER_TYPE {
  market = 'MARKET',
  stop_loss = 'STOP_LOSS',
  limit = 'LIMIT',
  take_profit = 'TAKE_PROFIT',
}

export enum TRADE_TYPE {
  buy = 'BUY',
  sell = 'SELL',
}

export enum ORDER_STATUS {
  pending = 'PENDING',
  failed = 'FAILED',
  parially_filled = 'PARIALLY_FILLED',
  cancelled = 'CANCELLED',
  expired = 'EXPIRED',
}
@Entity('orders')
@Check(`amount >= 0`)
@Check(`executedAmount >= 0`)
@Check(`pricePerUnit >= 0`)
export class OrderEntity extends AbstractEntity<OrderResponse> {
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ length: 10 })
  currencyPair: string;
  @Column({ type: 'enum', enum: ORDER_TYPE })
  orderType: ORDER_TYPE;
  @Column({ type: 'enum', enum: TRADE_TYPE })
  tradeType: TRADE_TYPE;
  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.pending })
  status: ORDER_STATUS;
  @Column({
    type: 'decimal',
    scale: 8,
    precision: 18,
    default: 0.0,
    transformer: {
      from: (value) => parseFloat(value),
      to: (value) => value,
    },
  })
  amount: number;
  @Column({
    type: 'decimal',
    scale: 8,
    precision: 18,
    default: 0.0,
    transformer: {
      from: (value) => parseFloat(value),
      to: (value) => value,
    },
  })
  executedAmount: number;
  @Column({
    type: 'decimal',
    scale: 8,
    precision: 18,
    default: 0.0,
    transformer: {
      from: (value) => parseFloat(value),
      to: (value) => value,
    },
  })
  pricePerUnit: number;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  dtoClass = OrderResponse;
}
