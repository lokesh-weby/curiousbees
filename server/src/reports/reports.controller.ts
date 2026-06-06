import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { ApprovedGuard } from '../auth/approved.guard';

@Controller('reports')
@UseGuards(FirebaseAuthGuard, ApprovedGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.reportsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.reportsService.findOne(id, req.user.id, req.user.role);
  }

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { title: string; description?: string; evidenceUrl?: string; supervisorId: string }
  ) {
    return this.reportsService.create(req.user.id, body);
  }

  @Put(':id/review')
  async review(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; feedback?: string }
  ) {
    return this.reportsService.review(id, req.user.id, body);
  }
}
