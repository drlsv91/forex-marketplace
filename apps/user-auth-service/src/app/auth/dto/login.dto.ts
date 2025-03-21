import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'john.doe@google.com',
  })
  @Transform(({ value }) => value.toLowerCase().replace(/\s/g, ''))
  email: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'User password', example: 'P@ssw0rd1234' })
  password: string;
}
