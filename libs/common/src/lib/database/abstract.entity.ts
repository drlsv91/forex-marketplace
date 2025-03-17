import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractDto } from './abstract.dto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;
  toDto(): T {
    return new this.dtoClass(this);
  }
}
