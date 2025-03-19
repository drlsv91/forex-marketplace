import { Check, Column, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { AbstractEntity } from '@forex-marketplace/common';
import { OrderTransactionResponse } from '../dto/transaction-response.dto';

export enum OrderTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('order_transactions')
@Check(`fee >= 0`)
@Check(`executed_amount >= 0`)
@Check(`execution_price >= 0`)
export class OrderTransactionEntity extends AbstractEntity<OrderTransactionResponse> {
  @ManyToOne(() => OrderEntity, (order) => order.transactions, {
    onDelete: 'CASCADE',
  })
  order: OrderEntity;

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
  fee: number;

  @Column({
    type: 'enum',
    enum: OrderTransactionStatus,
    default: OrderTransactionStatus.PENDING,
  })
  status: OrderTransactionStatus;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  dtoClass = OrderTransactionResponse;
}
