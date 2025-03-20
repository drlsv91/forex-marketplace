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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiOkResponsePaginated,
  currentUser,
  JwtAuardGuard,
} from '@forex-marketplace/common';
import { User } from 'types/proto/auth';
import { TransactionsService } from '../transactions/transactions.service';
import {
  GetOrderTranxDto,
  ListTranxDto,
  OrderTransactionResponse,
} from '../transactions/dto/transaction-response.dto';
import { ListOrderDto, OrderResponse } from './dto/order-response';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly transactionService: TransactionsService
  ) {}

  @Post('/')
  @UseGuards(JwtAuardGuard)
  @ApiOkResponse({
    type: OrderResponse,
    description: 'place an order',
  })
  async placeOrder(
    @Body() createOrderDto: CreateOrderDto,
    @currentUser() user: User
  ) {
    createOrderDto.user = user;
    return this.ordersService.placeOrder(createOrderDto);
  }
  @Get('/')
  @ApiOkResponsePaginated(OrderResponse, {
    description: 'List orders paginated',
  })
  @UseGuards(JwtAuardGuard)
  async listOrders(@Query() dto: ListOrderDto, @currentUser() user: User) {
    dto.user = user;
    return this.ordersService.listOrders(dto);
  }
  @Put('/:orderId/execute')
  @UseGuards(JwtAuardGuard)
  @ApiOkResponse({
    type: OrderResponse,
    description: 'execute an order',
  })
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
  @ApiOkResponsePaginated(OrderTransactionResponse, {
    description: 'List an order transactions paginated',
  })
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
  @ApiOkResponsePaginated(OrderTransactionResponse, {
    description: 'List order transactions paginated',
  })
  async getTransactions(@Query() dto: ListTranxDto, @currentUser() user: User) {
    dto.user = user;

    return this.transactionService.listTrnxs(dto);
  }
}
