import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'types/proto/auth';
import { ORDER_TYPE } from '../entities/order.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';
import { IsFutureDate, TRADE_TYPE } from '@forex-marketplace/common';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  user: User;
  @ApiProperty({
    description: 'The forex pair being traded',
    example: 'EUR/USD',
  })
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}\/[A-Z]{3}$/, {
    message: 'Currency pair must be in format XXX/YYY (e.g., USD/EUR)',
  })
  @Transform(({ value }) => value.toUpperCase().replace(/\s/g, '')) // Transform to UPPERCASE & remove spaces
  currencyPair: string;

  @ApiProperty({ description: 'Type of order', example: 'LIMIT' })
  @IsEnum(ORDER_TYPE)
  orderType: ORDER_TYPE;
  @ApiProperty({ description: 'BUY or SELL', example: 'BUY' })
  @IsEnum(TRADE_TYPE)
  tradeType: TRADE_TYPE;
  @ApiProperty({
    description: 'Amount of currency being traded',
    example: 1000,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;
  @ApiPropertyOptional({
    description: '(Optional) The price at which the user wants to trade',
    example: 1.15,
    minimum: 0.0001,
  })
  @IsNumber()
  @Min(0.0001)
  price: number;

  @IsOptional()
  @IsFutureDate({ message: 'current or future date only' })
  expiresAt?: Date;
}
