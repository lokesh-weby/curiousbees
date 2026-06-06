import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { ApprovedGuard } from '../auth/approved.guard';
import { EventStatus, EventPriority, Prisma } from '@prisma/client';

@Controller('events')
@UseGuards(FirebaseAuthGuard, ApprovedGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService
  ) {}

  @Get()
  async getEvents(
    @Query('status') status?: EventStatus,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string
  ) {
    return this.eventsService.getEvents({
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      skip: skip ? parseInt(skip, 10) : undefined,
    });
  }

  @Get('review')
  async getReviewEvents() {
    return this.eventsService.getReviewEvents();
  }

  @Post()
  async createEvent(
    @Body() body: { 
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
    }
  ) {
    return this.eventsService.createEvent(body);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() body: Prisma.EventUpdateInput
  ) {
    return this.eventsService.updateEvent(id, body);
  }

  @Patch(':id/status')
  async updateEventStatus(
    @Param('id') id: string,
    @Body() body: { status: EventStatus }
  ) {
    return this.eventsService.updateEventStatus(id, body.status);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
