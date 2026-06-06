import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus, EventPriority, Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  /**
   * Retrieves events with optional filtering and pagination.
   */
  async getEvents(filters?: { status?: EventStatus; limit?: number; skip?: number }) {
    try {
      const where: Prisma.EventWhereInput = {};
      if (filters?.status) {
        where.status = filters.status;
      } else {
        // By default, don't return FAILED events in the main calendar
        where.status = { not: EventStatus.FAILED };
      }

      return await this.prisma.event.findMany({
        where,
        orderBy: { date: 'asc' },
        take: filters?.limit || 100,
        skip: filters?.skip || 0,
      });
    } catch (e: any) {
      this.logger.error('Failed to query database events', e);
      return [];
    }
  }

  /**
   * Specifically returns events requiring human review.
   */
  async getReviewEvents() {
    return this.getEvents({ status: EventStatus.REVIEW_REQUIRED });
  }

  /**
   * Retrieves a single event by ID.
   */
  async getEventById(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found.');
    return event;
  }

  /**
   * Creates an event manually (skipping AI).
   */
  async createEvent(input: { 
    title: string; 
    date: string; 
    time: string; 
    venue: string; 
    eventType?: string;
    speaker?: string;
    department?: string;
    topic?: string;
    organizerEmail?: string;
    status?: EventStatus;
    priority?: EventPriority;
    description?: string;
    category?: string;
    posterUrl?: string;
    registrationLink?: string;
    tags?: string[];
  }) {
    const { 
      title, 
      date, 
      time, 
      venue, 
      eventType,
      speaker,
      department,
      topic,
      organizerEmail,
      status,
      priority,
      description,
      category,
      posterUrl,
      registrationLink,
      tags
    } = input;

    if (!title || !date || !time || !venue) {
      throw new BadRequestException('Event details are incomplete.');
    }

    try {
      return await this.prisma.event.create({
        data: { 
          title, 
          date: new Date(date), 
          time, 
          venue, 
          eventType: eventType || 'Manual Entry',
          speaker: speaker || null,
          department: department || null,
          topic: topic || null,
          organizerEmail: organizerEmail || null,
          status: status || EventStatus.PUBLISHED,
          priority: priority || EventPriority.MEDIUM,
          description: description || null,
          category: category || null,
          posterUrl: posterUrl || null,
          registrationLink: registrationLink || null,
          tags: tags || []
        }
      });
    } catch (e) {
      this.logger.error('Failed to create event', e);
      throw new BadRequestException('Could not create event');
    }
  }

  /**
   * Updates full event details.
   */
  async updateEvent(id: string, input: Prisma.EventUpdateInput) {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: input
      });
    } catch (e) {
      throw new NotFoundException('Event not found.');
    }
  }

  /**
   * Patches only the status of an event (for AI review queue).
   */
  async updateEventStatus(id: string, status: EventStatus) {
    try {
      const updatedEvent = await this.prisma.event.update({
        where: { id },
        data: { status }
      });

      // If approved, route it to interested users
      if (status === EventStatus.PUBLISHED) {
        // We do this async without awaiting so it doesn't block the HTTP response
        this.notificationsService.routeEvent(updatedEvent).catch(e => {
          this.logger.error(`Failed to route published event ${id}: ${e.message}`);
        });
      }

      return updatedEvent;
    } catch (e) {
      throw new NotFoundException('Event not found.');
    }
  }

  /**
   * Deletes an event.
   */
  async deleteEvent(id: string) {
    try {
      return await this.prisma.event.delete({
        where: { id }
      });
    } catch (e) {
      throw new NotFoundException('Event not found.');
    }
  }


}
