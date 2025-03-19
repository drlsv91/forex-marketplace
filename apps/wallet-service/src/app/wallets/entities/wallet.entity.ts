import { AbstractEntity } from '@forex-marketplace/common';
import { Check, Column, Entity, Unique, UpdateDateColumn } from 'typeorm';
import { WalletResponse } from '../dto/wallet-response.dto';

@Entity('wallets')
@Unique(['userId', 'currency'])
@Check(`balance >= 0`)
export class WalletEntity extends AbstractEntity<WalletResponse> {
  @Column({ type: 'uuid' })
  userId: string;
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
  balance: number;
  @Column({ type: 'varchar', length: 10 })
  currency: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  dtoClass = WalletResponse;
}
