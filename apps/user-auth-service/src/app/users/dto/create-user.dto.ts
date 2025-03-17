import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@google.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User's full name", example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName: string;

  @ApiProperty({ description: "User's password", example: 'P@ssw0rd1234' })
  @IsStrongPassword()
  password: string;
}
