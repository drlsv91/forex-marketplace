import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserEntity } from '../users/entities/user.entity';
import { TokenPayload } from './interface/token-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) {}
  async login(user: UserEntity, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION_MS')
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, { httpOnly: true, expires });
    await this.userService.findOneAndUpdate(
      { id: user.id },
      { lastLoginTimestamp: new Date() }
    );
    return {
      access_token: token,
      user: { email: user.email, full_name: user.fullName },
    };
  }
}
