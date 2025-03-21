import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@forex-marketplace/common';
import { RatesRequest } from '@forex-marketplace/grpc';

@Injectable()
export class RatesService implements OnModuleInit {
  private readonly logger = new Logger(RatesService.name);
  private readonly API_KEY: string;
  private readonly BASE_URL: string;
  private readonly CACHE_EXPIRY = 8 * 60 * 60; //8hrs

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {
    this.API_KEY = this.configService.get<string>('EXCHANGE_RATE_API_KEY');
    this.BASE_URL = this.configService.get<string>('EXCHANGE_RATE_BASE_URL');
  }

  async onModuleInit() {
    await this.getRates({});
  }

  async getRates(request: RatesRequest): Promise<any> {
    request.baseCurrency = request.baseCurrency ?? 'USD';

    const url = `${this.BASE_URL}/${this.API_KEY}/latest/${request.baseCurrency}`;

    const cachedRates = await this.redisService.get(url);

    if (cachedRates) {
      this.logger.log('Returning cached forex rates!');

      const rates = JSON.parse(cachedRates);

      if (Object.values(rates).length) {
        return { rates };
      }
    }

    this.logger.log('Cache expired. Fetching new forex rates...');
    return this.fetchForexRates({ baseCurrency: request.baseCurrency });
  }

  private async fetchForexRates(request: Required<RatesRequest>): Promise<any> {
    try {
      this.logger.log('Fetching forex rates from API...');
      const url = `${this.BASE_URL}/${this.API_KEY}/latest/${request.baseCurrency}`;

      const response = await axios.get(url);

      if (response.data.result !== 'success') {
        throw new Error('Failed to fetch exchange rates');
      }

      const rates = response.data.conversion_rates;
      await this.redisService.set(
        url,
        JSON.stringify(rates),
        this.CACHE_EXPIRY
      );

      // Publish update to RabbitMQ

      this.logger.log('Exchange rates updated and cached successfully');
      return rates;
    } catch (error) {
      this.logger.error('Error fetching exchange rates', error);
      throw error;
    }
  }
}
