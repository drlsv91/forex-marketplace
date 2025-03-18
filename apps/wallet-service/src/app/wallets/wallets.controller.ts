import { Controller, UseGuards, Get } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { currentUser, JwtAuardGuard } from '@forex-marketplace/common';
import {
  CreateWalletRequest,
  CreateWalletResponse,
  WalletServiceController,
  WalletServiceControllerMethods,
} from 'types/proto/wallet';
import { Observable } from 'rxjs';
import { User } from 'types/proto/auth';

@Controller('wallets')
@WalletServiceControllerMethods()
export class WalletsController implements WalletServiceController {
  constructor(private readonly walletsService: WalletsService) {}

  createWallet(
    request: CreateWalletRequest
  ):
    | Promise<CreateWalletResponse>
    | Observable<CreateWalletResponse>
    | CreateWalletResponse {
    return this.walletsService.create(request);
  }

  @Get()
  @UseGuards(JwtAuardGuard)
  async create(@currentUser() user: User) {
    return this.walletsService.getUserWallet(user);
  }
}
