import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ExecuteOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { currentUser, JwtAuardGuard } from '@forex-marketplace/common';
import { User } from 'types/proto/auth';
import { TransactionsService } from '../transactions/transactions.service';
import {
  GetOrderTranxDto,
  ListTranxDto,
} from '../transactions/dto/transaction-response.dto';
import { ListOrderDto } from './dto/order-response';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly transactionService: TransactionsService
  ) {}

  @Post('/')
  @UseGuards(JwtAuardGuard)
  async placeOrder(
    @Body() createOrderDto: CreateOrderDto,
    @currentUser() user: User
  ) {
    createOrderDto.user = user;
    return this.ordersService.placeOrder(createOrderDto);
  }
  @Get('/')
  @UseGuards(JwtAuardGuard)
  async listOrders(@Query() dto: ListOrderDto, @currentUser() user: User) {
    dto.user = user;
    return this.ordersService.listOrders(dto);
  }
  @Put('/:orderId/execute')
  @UseGuards(JwtAuardGuard)
  async executeOrder(
    @Body() executeOrderDto: ExecuteOrderDto,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @currentUser() user: User
  ) {
    executeOrderDto.user = user;
    executeOrderDto.orderId = orderId;
    return this.ordersService.executeOrder(executeOrderDto);
  }
  @Get('/:orderId/transactions')
  @UseGuards(JwtAuardGuard)
  async getOrderTransactions(
    @Query() dto: GetOrderTranxDto,
    @currentUser() user: User,
    @Param('orderId', ParseUUIDPipe) orderId: string
  ) {
    dto.user = user;
    dto.orderId = orderId;
    return this.transactionService.getByOrder(dto);
  }
  @Get('/transactions')
  @UseGuards(JwtAuardGuard)
  async getTransactions(@Query() dto: ListTranxDto, @currentUser() user: User) {
    dto.user = user;

    return this.transactionService.listTrnxs(dto);
  }
}
