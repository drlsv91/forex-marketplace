import { AbstractEntity, TRADE_TYPE } from '@forex-marketplace/common';
import { Check, Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { OrderResponse } from '../dto/order-response.dto';
import { OrderTransactionEntity } from '../../transactions/entities/transaction.entity';

export enum ORDER_TYPE {
  MARKET = 'MARKET',
  STOP_LOSS = 'STOP_LOSS',
  LIMIT = 'LIMIT',
  TAKE_PROFIT = 'TAKE_PROFIT',
}

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}
@Entity('orders')
@Check(`amount >= 0`)
@Check(`executed_amount >= 0`)
@Check(`price_per_unit >= 0`)
export class OrderEntity extends AbstractEntity<OrderResponse> {
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ length: 10 })
  currencyPair: string;
  @Column({ type: 'enum', enum: ORDER_TYPE })
  orderType: ORDER_TYPE;
  @Column({ type: 'enum', enum: TRADE_TYPE })
  tradeType: TRADE_TYPE;
  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
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
  executionPrice: number;
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

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @OneToMany(() => OrderTransactionEntity, (transaction) => transaction.order)
  transactions: OrderTransactionEntity[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  dtoClass = OrderResponse;
}
