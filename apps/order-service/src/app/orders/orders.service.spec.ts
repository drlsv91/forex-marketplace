import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import {
  defaultRate,
  getMockedOrderServiceProviders,
} from '../__mock__/mocked-order-providers';
import { user } from '../__mock__/data';
import { ORDER_STATUS, ORDER_TYPE } from './entities/order.entity';
import { PageDto, TRADE_TYPE } from '@forex-marketplace/common';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { of } from 'rxjs';
import { OrderTransactionResponse } from '../transactions/dto/transaction-response.dto';
import { OrderTransactionStatus } from '../transactions/entities/transaction.entity';
import { OrderResponse } from './dto/order-response';
import { faker } from '@faker-js/faker/.';

const orders = [];
const transactions = [];
describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: getMockedOrderServiceProviders(orders, transactions),
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    await service.onModuleInit();
  });

  afterEach(() => {
    orders.splice(0);
    transactions.splice(0);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('placeOrder', () => {
    it('should place an order', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/EUR',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.BUY,
      };
      const order = await service.placeOrder(createOrderDto);

      expect(order.id).toBeDefined();
      expect(order.amount).toBe(createOrderDto.amount);
      expect(order.currencyPair).toBe(createOrderDto.currencyPair);
      expect(order.tradeType).toBe(createOrderDto.tradeType);
      expect(order.pricePerUnit).toBe(createOrderDto.price);
      expect(service['notificationClient'].emit).toHaveBeenCalled();
    });
    it('it should throw BadRequestException if wallet balance is insufficient for buy trade', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/EUR',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.BUY,
      };
      jest
        .spyOn(service['walletService'], 'getTradeWallet')
        .mockReturnValue(
          of({ balance: 2, userId: user.id, currency: 'USD' }) as any
        );
      await expect(service.placeOrder(createOrderDto)).rejects.toThrow(
        BadRequestException
      );
    });
    it('it should throw BadRequestException if wallet balance is insufficient for sell trade', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/EUR',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.SELL,
      };
      jest
        .spyOn(service['walletService'], 'getTradeWallet')
        .mockReturnValue(
          of({ balance: 2, userId: user.id, currency: 'USD' }) as any
        );
      await expect(service.placeOrder(createOrderDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('executeOrder', () => {
    it('should execute a complete order', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/EUR',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.BUY,
      };
      jest
        .spyOn(service['walletService'], 'getTradeWallet')
        .mockReturnValue(
          of({ balance: 1200, userId: user.id, currency: 'USD' }) as any
        );
      const order = await service.placeOrder(createOrderDto);
      const transaction = await service.executeOrder({
        executedAmount: order.amount,
        orderId: order.id,
        user,
      });

      const updatedOrder = transaction.order;

      expect(updatedOrder.executionPrice).toBe(defaultRate.rates['EUR']);
      expect(updatedOrder.status).toBe(ORDER_STATUS.FILLED);
      expect(transaction.status).toBe(OrderTransactionStatus.COMPLETED);
      expect(service['notificationClient'].emit).toHaveBeenCalled();
    });
    it('should execute a partial order', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/EUR',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.BUY,
      };
      jest
        .spyOn(service['walletService'], 'getTradeWallet')
        .mockReturnValue(
          of({ balance: 1200, userId: user.id, currency: 'USD' }) as any
        );
      const order = await service.placeOrder(createOrderDto);
      const transaction = await service.executeOrder({
        executedAmount: 99,
        orderId: order.id,
        user,
      });

      const updatedOrder = transaction.order;

      expect(updatedOrder.executionPrice).toBe(defaultRate.rates['EUR']);
      expect(updatedOrder.status).toBe(ORDER_STATUS.PARIALLY_FILLED);
      expect(transaction.status).toBe(OrderTransactionStatus.COMPLETED);
      expect(service['notificationClient'].emit).toHaveBeenCalled();
    });
    it('should throw UnprocessableEntityException', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/NGN',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.BUY,
      };
      jest
        .spyOn(service['walletService'], 'getTradeWallet')
        .mockReturnValue(
          of({ balance: 1200, userId: user.id, currency: 'USD' }) as any
        );
      const order = await service.placeOrder(createOrderDto);
      await expect(
        service.executeOrder({
          executedAmount: order.amount,
          orderId: order.id,
          user,
        })
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });
  describe('getOrder', () => {
    it('should return existing order', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/EUR',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.BUY,
      };

      const order = await service.placeOrder(createOrderDto);
      const foundOrder = await service.getOrder(user, { id: order.id });

      expect(order.id).toBe(foundOrder.id);
    });
    it('should throw NotFoundException', async () => {
      await expect(
        service.getOrder(user, { id: faker.string.uuid() })
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('listOrders', () => {
    it('should return order list', async () => {
      const createOrderDto: CreateOrderDto = {
        user,
        amount: 100,
        currencyPair: 'USD/EUR',
        orderType: ORDER_TYPE.MARKET,
        price: 1.15,
        tradeType: TRADE_TYPE.BUY,
      };

      const order = await service.placeOrder(createOrderDto);
      const listOrderData = await service.listOrders({ user, skip: 0 });
      expect(listOrderData).toBeInstanceOf(PageDto);
      expect(listOrderData.data.length).toBe(1);
      expect(listOrderData.data[0].id).toBe(order.id);
    });
    it('should throw NotFoundException', async () => {
      await expect(
        service.getOrder(user, { id: faker.string.uuid() })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
