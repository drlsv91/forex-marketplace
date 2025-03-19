import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsPositive } from 'class-validator';
import { User } from 'types/proto/auth';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}

export class UpdateWalletBalanceDto {
  user: User;
  @ApiProperty({ description: 'Credit/Debit amount', example: 10 })
  @IsPositive()
  amount: number;
}
