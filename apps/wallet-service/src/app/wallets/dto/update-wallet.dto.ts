import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsEnum, IsPositive } from 'class-validator';
import { User } from 'types/proto/auth';
import { TransactionType } from '../entities/transaction.entity';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}

export class UpdateWalletBalanceDto {
  user: User;
  @ApiProperty({ description: 'Credit/Debit amount', example: 10 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Transaction type',
    example: TransactionType.CREDIT,
  })
  @IsEnum(TransactionType)
  type: TransactionType;
}
