import { Controller, UseGuards, Get, Post, Body } from '@nestjs/common';
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
import { UpdateWalletBalanceDto } from './dto/update-wallet.dto';

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

  @Post('/credit')
  @UseGuards(JwtAuardGuard)
  async creditWallet(
    @Body() creditWalletDto: UpdateWalletBalanceDto,
    @currentUser() user: User
  ) {
    creditWalletDto.user = user;
    return this.walletsService.credit(creditWalletDto);
  }
  @Post('/debit')
  @UseGuards(JwtAuardGuard)
  async debitWallet(
    @Body() creditWalletDto: UpdateWalletBalanceDto,
    @currentUser() user: User
  ) {
    creditWalletDto.user = user;
    return this.walletsService.debit(creditWalletDto);
  }

  @Get()
  @UseGuards(JwtAuardGuard)
  async create(@currentUser() user: User) {
    return this.walletsService.getUserWallet(user);
  }
}
