import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, User } from '@prisma/client';

@Injectable()
export class InterestMatcherService {
  private readonly logger = new Logger(InterestMatcherService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds users who should be notified about a new event based on:
   * 1. Department match
   * 2. Tag match (against User interests)
   */
  async findMatchingUsers(event: Event): Promise<User[]> {
    this.logger.log(`Finding matching users for event: ${event.id}`);

    // If no department or tags are specified, it might be a general event.
    // For this implementation, we will match by department OR any tag matching a user's interest.

    const matchingUsers = await this.prisma.user.findMany({
      where: {
        OR: [
          { department: event.department },
          {
            interests: {
              some: {
                interest: {
                  name: {
                    in: event.tags
                  }
                }
              }
            }
          }
        ]
      },
      include: {
        notificationTokens: true // Include FCM device tokens
      }
    });

    this.logger.log(`Found ${matchingUsers.length} matching users for event: ${event.title}`);
    return matchingUsers;
  }
}
