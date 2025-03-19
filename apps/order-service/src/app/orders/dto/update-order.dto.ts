import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsNumber, Min } from 'class-validator';
import { User } from 'types/proto/auth';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class ExecuteOrderDto {
  orderId: string;
  user: User;

  @ApiProperty({
    description: 'The amount of the order being executed (can be partial)',
    example: 500,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  executedAmount: number;

  @ApiProperty({
    description: 'The price at which the order was executed',
    example: 1.152,
    minimum: 0.0001,
  })
  @IsNumber()
  @Min(0.0001)
  executionPrice: number;
}
