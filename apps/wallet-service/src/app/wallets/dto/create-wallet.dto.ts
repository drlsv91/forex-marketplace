import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUUID, Matches } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'owner ID',
    example: 'b7869646-0290-4aaa-8549-1f40014f81a2',
  })
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency must be a 3-letter ISO 4217 code (e.g., USD, EUR, GBP)',
  })
  @Transform(({ value }) => value.toUpperCase().replace(/\s/g, ''))
  @ApiProperty({ description: 'currency', example: 'USD' })
  currency: string;
}
