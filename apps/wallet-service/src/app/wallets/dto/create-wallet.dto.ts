import { IsCurrency, TransformCurrency } from '@forex-marketplace/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'owner ID',
    example: 'b7869646-0290-4aaa-8549-1f40014f81a2',
  })
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsCurrency()
  @TransformCurrency()
  @ApiProperty({ description: 'currency', example: 'USD' })
  currency: string;
}
