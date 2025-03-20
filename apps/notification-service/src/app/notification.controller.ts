import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { NotificationService } from './notification.service';
import { NOTIFY_EMAIL_PATTERN } from '@forex-marketplace/common';

@Controller()
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern(NOTIFY_EMAIL_PATTERN)
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    await this.notificationsService.notifyEmail(data);
  }
}
