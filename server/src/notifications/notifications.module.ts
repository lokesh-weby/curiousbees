import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { InterestMatcherService } from './interest-matcher.service';
import { AuthModule } from '../auth/auth.module';
import { DigestScheduler } from './digest.scheduler';
import { FCMService } from './fcm.service';

@Module({
  imports: [
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [NotificationsController],
  providers: [
    FCMService,
    NotificationsService,
    InterestMatcherService,
    DigestScheduler,
  ],
  exports: [NotificationsService, InterestMatcherService, FCMService]
})
export class NotificationsModule {}
