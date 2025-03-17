import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HealthModule } from '@forex-marketplace/common';
@Module({
  imports: [UsersModule, HealthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
