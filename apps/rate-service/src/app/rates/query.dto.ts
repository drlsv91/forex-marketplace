import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class RateQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency must be a 3-letter ISO 4217 code (e.g., USD, EUR, GBP)',
  })
  @Transform(({ value }) => value.toUpperCase().replace(/\s/g, ''))
  @ApiPropertyOptional({ description: 'currency', example: 'USD' })
  currency: string;
}
