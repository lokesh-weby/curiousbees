import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event as PrismaEvent } from '@prisma/client';
import * as admin from 'firebase-admin';
import { FCMService } from './fcm.service';

export interface NotificationJobData {
  eventId: string;
  userIds: string[];
  title: string;
  body: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private fcmService: FCMService,
  ) {}

  /**
   * Registers a unique FCM token to a User
   */
  async registerToken(userId: string, token: string) {
    if (!token) {
      throw new BadRequestException('FCM registration token is required.');
    }

    try {
      return await this.prisma.notificationToken.upsert({
        where: { token },
        update: { userId },
        create: { token, userId }
      });
    } catch (e: any) {
      this.logger.error(`❌ Failed to register FCM token: ${e.message}`);
      throw new BadRequestException('Failed to save device registration token.');
    }
  }

  /**
   * Retrieves log of notifications dispatched to a user
   */
  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  /**
   * Fetch User Preferences
   */
  async getPreferences(userId: string) {
    return await this.prisma.userPreference.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  }

  /**
   * Update User Preferences
   */
  async updatePreferences(userId: string, data: any) {
    return await this.prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }

  /**
   * Dispatches a push notification directly to a user's registered devices.
   * Used for low-volume, targeted pushes (e.g. comment alerts).
   */
  async sendPushToUser(userId: string, payload: { title: string; body: string; url?: string }) {
    try {
      const devices = await this.prisma.notificationToken.findMany({ where: { userId } });
      if (devices.length === 0) {
        this.logger.log(`User ${userId} has no registered devices. Skipping push.`);
        return;
      }
      const tokens = devices.map(d => d.token);
      const message: any = {
        tokens,
        notification: { title: payload.title, body: payload.body },
        data: payload.url ? { url: payload.url } : {},
        webpush: { notification: { icon: '/logo.png', click_action: payload.url || '/' } }
      };
      const response = await admin.messaging().sendMulticast(message);
      this.logger.log(`[FCM] Notification Sent: ${response.successCount} succeeded, ${response.failureCount} failed.`);
      // Cleanup expired tokens
      const expiredTokens: string[] = [];
      response.responses.forEach((res: any, idx: number) => {
        if (!res.success && res.error) {
          const code = res.error.code;
          if (code === 'messaging/invalid-registration-token' || code === 'messaging/registration-token-not-registered') {
            expiredTokens.push(tokens[idx]);
          }
        }
      });
      if (expiredTokens.length > 0) {
        await this.prisma.notificationToken.deleteMany({ where: { token: { in: expiredTokens } } });
      }
    } catch (e: any) {
      this.logger.error(`sendPushToUser failed: ${e.message}`);
    }
  }

  /**
   * Generic method to send notification using Firebase Admin SDK
   */
  async sendNotification(title: string, body: string, userId: string) {
    return this.sendPushToUser(userId, { title, body });
  }

  // --- Notification Hooks for Future Events ---

  async notifyScholarApprovalRequest(scholarId: string, supervisorId: string) {
    // TODO: Implement later
  }

  async notifyScholarApproved(scholarId: string) {
    // TODO: Implement later
  }

  async notifyNewOpportunity(opportunityId: string, authorId: string) {
    // TODO: Implement later
  }

  async notifyNewThreadComment(threadId: string, authorId: string, commentId: string) {
    // TODO: Implement later
  }

  async notifyWorkspaceInvite(workspaceId: string, inviterId: string, inviteeId: string) {
    // TODO: Implement later
  }

  /**
   * The Smart Routing Engine: Determines who should receive a notification for an event,
   * then pushes the job to BullMQ for async delivery.
   */
  async routeEvent(event: PrismaEvent) {
    this.logger.log(`Routing newly published event: ${event.title}`);

    // Fetch all users with their preferences
    const preferences = await this.prisma.userPreference.findMany({
      where: { notificationsEnabled: true },
      include: { user: true }
    });

    // Match users
    const matchedUserIds = new Set<string>();

    for (const pref of preferences) {
      // 1. Department match
      const departmentMatch = pref.department === event.department;
      
      // 2. Tag match (if event shares any tags with user preferences)
      const tagMatch = event.tags.some(tag => pref.tags.includes(tag));
      
      // 3. Event Type match
      const typeMatch = pref.eventType === event.eventType;

      // 4. Default broad delivery for CRITICAL and HIGH priority events to their department
      const priorityMatch = 
        (event.priority === 'CRITICAL') || 
        (event.priority === 'HIGH' && pref.user.department === event.department);

      if (departmentMatch || tagMatch || typeMatch || priorityMatch) {
        matchedUserIds.add(pref.userId);
      }
    }

    const recipients = Array.from(matchedUserIds);
    if (recipients.length === 0) {
      this.logger.log(`No matching recipients found for event ${event.id}`);
      return;
    }

    this.logger.log(`Smart routing engine matched ${recipients.length} users for event ${event.id}`);

    // Create Notification Template
    const title = `📅 New Event: ${event.eventType}`;
    const body = `${event.title} is happening at ${event.venue} on ${new Date(event.date).toLocaleDateString()}`;

    // Direct Processing for Async Delivery
    this.logger.log(`Processing notification for event ${event.id} to ${recipients.length} users.`);

    // 1. Fetch device tokens for all matched users
    const devices = await this.prisma.notificationToken.findMany({
      where: { userId: { in: recipients } }
    });

    if (devices.length === 0) {
      this.logger.warn(`No registered devices found for the ${recipients.length} target users. Skipping FCM dispatch.`);
      
      // Log failures for analytics
      await this.prisma.notificationLog.createMany({
        data: recipients.map(uid => ({
          eventId: event.id,
          recipientType: 'USER',
          channel: 'PUSH',
          status: 'NO_DEVICES_FOUND',
        }))
      });
    } else {
      // Map user to their tokens (some users might have multiple devices)
      const tokens = devices.map(d => d.token);

      // 2. Multicast using FCMService
      const promises = tokens.map(token => 
        this.fcmService.sendToToken(token, title, body, { url: '/events' })
      );

      const results = await Promise.allSettled(promises);
      let successCount = 0;
      results.forEach(res => {
        if (res.status === 'fulfilled' && res.value) successCount++;
      });

      this.logger.log(`FCM Delivery: ${successCount}/${tokens.length} succeeded.`);
    }

    // 3. Persist success to NotificationLog and standard Notification table
    const logs = recipients.map(uid => ({
      eventId: event.id,
      recipientType: 'USER',
      channel: 'PUSH',
      status: devices.length > 0 ? 'DELIVERED' : 'NO_DEVICES_FOUND',
    }));

    const standardNotifications = recipients.map(uid => ({
      userId: uid,
      eventId: event.id,
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
