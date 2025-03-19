import { Controller, UseGuards, Get, Post, Body, Query } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { currentUser, JwtAuardGuard } from '@forex-marketplace/common';
import {
  CreateWalletRequest,
  CreateWalletResponse,
  FilterWalletRequest,
  UpdateWalletRequest,
  WalletServiceController,
  WalletServiceControllerMethods,
} from 'types/proto/wallet';
import { Observable } from 'rxjs';
import { User } from 'types/proto/auth';
import { UpdateWalletBalanceDto } from './dto/update-wallet.dto';
import { GetUserWalletDto } from './dto/wallet-response.dto';

@Controller('wallets')
@WalletServiceControllerMethods()
export class WalletsController implements WalletServiceController {
  constructor(private readonly walletsService: WalletsService) {}
  trade(
    request: UpdateWalletRequest
  ):
    | Promise<CreateWalletResponse>
    | Observable<CreateWalletResponse>
    | CreateWalletResponse {
    return this.walletsService.tradeTranx(request);
  }
  getTradeWallet(
    request: FilterWalletRequest
  ):
    | Promise<CreateWalletResponse>
    | Observable<CreateWalletResponse>
    | CreateWalletResponse {
    return this.walletsService.getTradeWallet(request);
  }

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
    creditWalletDto.userId = user.id;
    return this.walletsService.credit(creditWalletDto);
  }
  @Post('/debit')
  @UseGuards(JwtAuardGuard)
  async debitWallet(
    @Body() creditWalletDto: UpdateWalletBalanceDto,
    @currentUser() user: User
  ) {
    creditWalletDto.userId = user.id;
    return this.walletsService.debit(creditWalletDto);
  }

  @Get()
  @UseGuards(JwtAuardGuard)
  async create(@currentUser() user: User, @Query() dto: GetUserWalletDto) {
    dto.userId = user.id;
    return this.walletsService.getUserWallet(dto);
  }
}
