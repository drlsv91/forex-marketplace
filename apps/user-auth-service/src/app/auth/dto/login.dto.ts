import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'john.doe@google.com',
  })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ description: 'User password', example: 'P@ssw0rd1234' })
  password: string;
}
