import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { currentUser } from '@forex-marketplace/common';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from 'types/proto/auth';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @currentUser() user: UserEntity,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(user, response);
    response.status(HttpStatus.OK).send(result);
  }
  @UseGuards(JwtAuthGuard)
  authenticate(
    request: AuthenticateRequest & { user: UserEntity }
  ): Promise<User> | Observable<User> | User {
    return request.user;
  }
}
