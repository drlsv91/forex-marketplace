import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@forex-marketplace/common';
import { UserEntity } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_PACKAGE_NAME, WALLET_SERVICE_NAME } from 'types/proto/wallet';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule.forFeature([UserEntity]),
    ClientsModule.registerAsync([
      {
        name: WALLET_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: WALLET_PACKAGE_NAME,
            protoPath: join(__dirname, 'proto/wallet.proto'),
            url: configService.getOrThrow('WALLET_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
