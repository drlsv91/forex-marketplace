import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { RatesService } from './rates.service';
import {
  CustomRpcExceptionFilter,
  GrpcLoggingInterceptor,
  RateServiceController,
  RateServiceControllerMethods,
  RatesRequest,
  RatesResponse,
} from '@forex-marketplace/grpc';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { RateQueryDto } from './query.dto';

@Controller('rates')
@ApiTags('Rates')
@RateServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class RatesController implements RateServiceController {
  constructor(private readonly ratesService: RatesService) {}

  @UseFilters(CustomRpcExceptionFilter)
  getRates(
    request: RatesRequest
  ): Promise<RatesResponse> | Observable<RatesResponse> | RatesResponse {
    return this.ratesService.getRates(request);
  }

  @Get('/')
  rates(@Query() dto: RateQueryDto) {
    return this.ratesService.getRates({ baseCurrency: dto.currency });
  }
}
