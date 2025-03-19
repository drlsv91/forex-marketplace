import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNotEmpty, IsPositive, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransactionType } from '../entities/transaction.entity';
export class UpdateWalletDto extends PartialType(CreateWalletDto) {}

export class UpdateWalletBalanceDto {
  userId: string;
  @ApiProperty({ description: 'Credit/Debit amount', example: 10 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency 3-letter ISO 4217 code',
    example: 'USD',
  })
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency must be a 3-letter ISO 4217 code (e.g., USD, EUR, GBP)',
  })
  @Transform(({ value }) => value.toUpperCase().replace(/\s/g, ''))
  currency: string;

  trxType?: TransactionType;
}
