import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { SupervisorsModule } from './supervisors/supervisors.module';
import { DepartmentsModule } from './departments/departments.module';
import { PublicationsModule } from './publications/publications.module';
import { ReportsModule } from './reports/reports.module';

// 👇 Add this import
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),

    AuthModule,
    UsersModule,
    ThreadsModule,
    CommentsModule,
    OpportunitiesModule,
    EventsModule,
    NotificationsModule,
    WorkspacesModule,
    SupervisorsModule,
    DepartmentsModule,
    PublicationsModule,
    ReportsModule,
  ],
  controllers: [
    AppController,
    HealthController, // 👈 register here
  ],
  providers: [],
})
export class AppModule {}
