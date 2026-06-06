import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { ApprovedGuard } from '../auth/approved.guard';

@Controller('publications')
@UseGuards(FirebaseAuthGuard, ApprovedGuard)
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.publicationsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { title: string; authors: string; doi?: string; publisher?: string; year: number; status: string }
  ) {
    return this.publicationsService.create(req.user.id, body);
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { title?: string; authors?: string; doi?: string; publisher?: string; year?: number; status?: string }
  ) {
    return this.publicationsService.update(id, req.user.id, req.user.role, body);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.publicationsService.remove(id, req.user.id, req.user.role);
  }
}
