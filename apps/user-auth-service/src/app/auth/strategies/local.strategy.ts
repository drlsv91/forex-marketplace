import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const transformedEmail = email.toLowerCase().replace(/\s/g, '');
      return await this.userService.verifyUser(transformedEmail, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
