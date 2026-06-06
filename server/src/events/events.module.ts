import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EmailIngestionService } from './email-ingestion.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [EventsController],
  providers: [EventsService, EmailIngestionService],
  exports: [EventsService]
})
export class EventsModule {}
