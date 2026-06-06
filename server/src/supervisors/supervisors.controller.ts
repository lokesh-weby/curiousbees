import { Controller, Get, Put, Query, Param, UseGuards, Req } from '@nestjs/common';
import { SupervisorsService } from './supervisors.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { SupervisorGuard } from '../auth/guards/supervisor.guard';

@Controller()
export class SupervisorsController {
  constructor(private readonly supervisorsService: SupervisorsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('supervisors')
  async getSupervisors(@Query('search') search?: string) {
    return this.supervisorsService.getSupervisors(search);
  }

  @UseGuards(FirebaseAuthGuard, SupervisorGuard)
  @Get('supervisor/pending-scholars')
  async getPendingScholars(@Req() req: any) {
    return this.supervisorsService.getPendingScholars(req.user.id);
  }

  @UseGuards(FirebaseAuthGuard, SupervisorGuard)
  @Put('supervisor/approve/:id')
  async approveScholar(@Req() req: any, @Param('id') scholarId: string) {
    return this.supervisorsService.approveScholar(req.user.id, scholarId);
  }

  @UseGuards(FirebaseAuthGuard, SupervisorGuard)
  @Put('supervisor/reject/:id')
  async rejectScholar(@Req() req: any, @Param('id') scholarId: string) {
    return this.supervisorsService.rejectScholar(req.user.id, scholarId);
  }
}
