import { AbstractEntity } from '@forex-marketplace/common';
import { Column, Entity, Unique, UpdateDateColumn } from 'typeorm';
import { WalletResponse } from '../dto/wallet-response.dto';

@Entity('wallets')
@Unique(['userId', 'currency'])
export class WalletEntity extends AbstractEntity<WalletResponse> {
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'decimal', scale: 8, precision: 18 })
  balance: number;
  @Column({ type: 'varchar', length: 10 })
  currency: string;
  @Column({ type: 'varchar', length: 5 })
  currencySymbol: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  dtoClass = WalletResponse;
}
