import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import {
  ApiOkResponsePaginated,
  currentUser,
  JwtAuthGuard,
} from '@forex-marketplace/common';
import {
  CreateWalletRequest,
  CreateWalletResponse,
  FilterWalletRequest,
  UpdateWalletRequest,
  WalletServiceController,
  WalletServiceControllerMethods,
  User,
  GrpcLoggingInterceptor,
  CustomRpcExceptionFilter,
} from '@forex-marketplace/grpc';
import { Observable } from 'rxjs';
import { UpdateWalletBalanceDto } from './dto/update-wallet.dto';
import {
  GetUserWalletDto,
  WalletResponse,
  WalletTransactionResponse,
} from './dto/wallet-response.dto';
import { ListTranxDto } from './dto/transaction.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('wallets')
@ApiTags('Wallets')
@ApiBearerAuth()
@WalletServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class WalletsController implements WalletServiceController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post('/credit')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: WalletResponse,
    status: HttpStatus.OK,
    description: 'credit user wallet based on a currency',
  })
  async creditWallet(
    @Body() creditWalletDto: UpdateWalletBalanceDto,
    @currentUser() user: User
  ) {
    creditWalletDto.userId = user.id;
    return this.walletsService.credit(creditWalletDto);
  }
  @Post('/debit')
  @ApiResponse({
    type: WalletResponse,
    status: HttpStatus.OK,
    description: 'debit user wallet based on a currency',
  })
  @UseGuards(JwtAuthGuard)
  async debitWallet(
    @Body() creditWalletDto: UpdateWalletBalanceDto,
    @currentUser() user: User
  ) {
    creditWalletDto.userId = user.id;
    return this.walletsService.debit(creditWalletDto);
  }
  @Get('/transactions')
  @ApiOkResponsePaginated(WalletTransactionResponse, {
    description: 'List wallet transactions',
  })
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Query() dto: ListTranxDto, @currentUser() user: User) {
    dto.user = user;
    return this.walletsService.getTransactions(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: [WalletResponse],
    description: 'List the current user wallets',
  })
  async getUserWallets(
    @currentUser() user: User,
    @Query() dto: GetUserWalletDto
  ) {
    dto.userId = user.id;
    return this.walletsService.getUserWallets(dto);
  }

  @UseFilters(CustomRpcExceptionFilter)
  trade(
    request: UpdateWalletRequest
  ):
    | Promise<CreateWalletResponse>
    | Observable<CreateWalletResponse>
    | CreateWalletResponse {
    return this.walletsService.tradeTranx(request);
  }
  @UseFilters(CustomRpcExceptionFilter)
  getTradeWallet(
    request: FilterWalletRequest
  ):
    | Promise<CreateWalletResponse>
    | Observable<CreateWalletResponse>
    | CreateWalletResponse {
    return this.walletsService.getTradeWallet(request);
  }
  @UseFilters(CustomRpcExceptionFilter)
  createWallet(
    request: CreateWalletRequest
  ):
    | Promise<CreateWalletResponse>
    | Observable<CreateWalletResponse>
    | CreateWalletResponse {
    return this.walletsService.create(request);
  }
}
