import { AbstractEntity } from '@forex-marketplace/common';
import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { UserResponse } from '../dto/user-response.dto';

@Entity('users')
export class UserEntity extends AbstractEntity<UserResponse> {
  @Column({ unique: true })
  email: string;

  @Column({ length: 200 })
  password: string;
  @Column({ length: 200 })
  fullName: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginTimestamp: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  dtoClass = UserResponse;
}
