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

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  executedAmount: number;

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  executionPrice: number;

  @Column({ type: 'numeric', precision: 18, scale: 8, default: 0 })
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
