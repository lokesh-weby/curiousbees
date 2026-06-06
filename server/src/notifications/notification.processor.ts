import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FCMService } from './fcm.service';
import { NotificationJobData } from './notifications.service';

@Processor('event-notifications', {
  concurrency: 5, // Process up to 5 notification batches concurrently
})
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FCMService,
  ) {
    super();
  }

  async process(job: Job<NotificationJobData, any, string>): Promise<any> {
    const { eventId, userIds, title, body } = job.data;
    this.logger.log(`Processing notification job ${job.id} for event ${eventId} to ${userIds.length} users.`);

    // 1. Fetch device tokens for all matched users
    const devices = await this.prisma.notificationToken.findMany({
      where: { userId: { in: userIds } }
    });

    if (devices.length === 0) {
      this.logger.warn(`No registered devices found for the ${userIds.length} target users. Skipping FCM dispatch.`);
      
      // Log failures for analytics
      await this.prisma.notificationLog.createMany({
        data: userIds.map(uid => ({
          eventId,
          recipientType: 'USER',
          channel: 'PUSH',
          status: 'NO_DEVICES_FOUND',
        }))
      });
      return;
    }

    // Map user to their tokens (some users might have multiple devices)
    const tokens = devices.map(d => d.token);

    // 2. Multicast using FCM (In a real scenario with >500 tokens, we'd chunk this array)
    // For now we loop through FCMService for granular logging, or implement a multicast in FCMService
    // Let's use a simple parallel dispatch for this prototype
    const promises = tokens.map(token => 
      this.fcmService.sendToToken(token, title, body, { url: '/events' })
    );

    const results = await Promise.allSettled(promises);
    let successCount = 0;
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value) successCount++;
    });

    this.logger.log(`FCM Delivery: ${successCount}/${tokens.length} succeeded.`);

    // 3. Persist success to NotificationLog and standard Notification table
    const logs = userIds.map(uid => ({
      eventId,
      recipientType: 'USER',
      channel: 'PUSH',
      status: 'DELIVERED',
    }));

    const standardNotifications = userIds.map(uid => ({
      userId: uid,
      eventId,
      title,
      body,
      sentStatus: true,
    }));

    await this.prisma.$transaction([
      this.prisma.notificationLog.createMany({ data: logs }),
      this.prisma.notification.createMany({ data: standardNotifications })
    ]);
  }
}
