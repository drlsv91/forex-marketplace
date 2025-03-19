import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsCurrency, IsPositive } from 'class-validator';
import { User } from 'types/proto/auth';
import { TransformCurrency } from '@forex-marketplace/common';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}

export class UpdateWalletBalanceDto {
  userId: string;
  @ApiProperty({ description: 'Credit/Debit amount', example: 10 })
  @IsPositive()
  amount: number;

  @IsCurrency()
  @TransformCurrency()
  currency: string;
}
