import { Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { ApprovedGuard } from '../auth/approved.guard';
import { ThreadsService } from './threads.service';
import { CreateThreadInput } from '../shared/types';

@Controller('threads')
@UseGuards(FirebaseAuthGuard, ApprovedGuard)
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  async getThreads(@Query('search') search?: string, @Query('tag') tag?: string) {
    return this.threadsService.getThreads(search, tag);
  }

  @Get(':id')
  async getThreadById(@Param('id') id: string) {
    return this.threadsService.getThreadById(id);
  }

  @Post()
  async createThread(@Req() req: any, @Body() body: CreateThreadInput) {
    return this.threadsService.createThread(req.user.id, body);
  }

  @Delete(':id')
  async deleteThread(@Req() req: any, @Param('id') id: string) {
    return this.threadsService.deleteThread(req.user.id, id, req.user.role);
  }
}
