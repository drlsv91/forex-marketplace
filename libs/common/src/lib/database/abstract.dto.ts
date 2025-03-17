import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from './abstract.entity';

export class AbstractDto {
  @ApiProperty({ example: '25792286-b4d3-4b28-a570-87e9b79e58a7' })
  readonly id: string;
  constructor(entity: AbstractEntity) {
    this.id = entity.id;
  }
}
