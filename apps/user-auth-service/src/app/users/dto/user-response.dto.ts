import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { AbstractDto } from '@forex-marketplace/common';

export class UserResponse extends AbstractDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@google.com',
  })
  email: string;

  @ApiProperty({ description: 'User full name', example: 'John' })
  fullName: string;

  constructor(user: UserEntity) {
    super(user);
    this.email = user.email;
    this.fullName = user.fullName;
  }
}
