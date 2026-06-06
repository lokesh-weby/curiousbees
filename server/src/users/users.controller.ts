import { Controller, Get, Put, Body, Query, UseGuards, Req, BadRequestException, Param } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { UsersService } from './users.service';
import { UpdateProfileInput } from '../shared/types';



@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: UpdateProfileInput) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Get('collaborators')
  async getCollaborators(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('department') department?: string
  ) {
    return this.usersService.getCollaborators(req.user.id, search, department);
  }

  @Get('interests')
  async getAllInterests() {
    return this.usersService.getAllInterests();
  }

  @Put('request-supervisor')
  async requestSupervisor(@Req() req: any, @Body('supervisorId') supervisorId: string) {
    if (req.user.role !== 'RESEARCH_SCHOLAR') {
      throw new BadRequestException('Only research scholars can request a supervisor.');
    }
    if (!supervisorId) {
      throw new BadRequestException('supervisorId is required.');
    }
    return this.usersService.requestSupervisor(req.user.id, supervisorId);
  }

  @Get('approvals')
  async getApprovals(@Req() req: any) {
    if (req.user.role !== 'RESEARCH_SUPERVISOR' && req.user.role !== 'INSTITUTION_ADMIN') {
      throw new BadRequestException('Only faculty supervisors can fetch pending approvals.');
    }
    return this.usersService.getApprovals(req.user.id);
  }

  @Put('approve-scholar')
  async approveScholar(@Req() req: any, @Body('scholarId') scholarId: string) {
    if (req.user.role !== 'RESEARCH_SUPERVISOR' && req.user.role !== 'INSTITUTION_ADMIN') {
      throw new BadRequestException('Only faculty supervisors can approve scholars.');
    }
    if (!scholarId) {
      throw new BadRequestException('scholarId is required.');
    }
    return this.usersService.approveScholar(req.user.id, scholarId);
  }

  @Put('approve-supervisor')
  async approveSupervisor(@Req() req: any, @Body('supervisorId') supervisorId: string) {
    if (req.user.role !== 'INSTITUTION_ADMIN') {
      throw new BadRequestException('Only administrators can approve supervisors.');
    }
    if (!supervisorId) {
      throw new BadRequestException('supervisorId is required.');
    }
    return this.usersService.approveSupervisor(req.user.id, supervisorId);
  }

  @Put('decline-supervisor')
  async declineSupervisor(@Req() req: any, @Body('supervisorId') supervisorId: string) {
    if (req.user.role !== 'INSTITUTION_ADMIN') {
      throw new BadRequestException('Only administrators can decline supervisors.');
    }
    if (!supervisorId) {
      throw new BadRequestException('supervisorId is required.');
    }
    return this.usersService.declineSupervisor(req.user.id, supervisorId);
  }

  @Put('decline-scholar')
  async declineScholar(@Req() req: any, @Body('scholarId') scholarId: string) {
    if (req.user.role !== 'RESEARCH_SUPERVISOR' && req.user.role !== 'INSTITUTION_ADMIN') {
      throw new BadRequestException('Only faculty supervisors can decline scholars.');
    }
    if (!scholarId) {
      throw new BadRequestException('scholarId is required.');
    }
    return this.usersService.declineScholar(req.user.id, scholarId);
  }

  @Get('all')
  async getAllUsers(@Req() req: any) {
    return this.usersService.getAllUsers(req.user.id);
  }

  @Get('supervisors')
  async getSupervisors() {
    return this.usersService.getSupervisors();
  }

  @Get('my-scholars')
  async getMyScholars(@Req() req: any) {
    if (req.user.role !== 'RESEARCH_SUPERVISOR' && req.user.role !== 'INSTITUTION_ADMIN') {
      throw new BadRequestException('Only supervisors can view their assigned scholars.');
    }
    return this.usersService.getMyScholars(req.user.id);
  }

  @Put(':id/role')
  async updateUserRole(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body('role') role: 'RESEARCH_SUPERVISOR' | 'RESEARCH_SCHOLAR' | 'INSTITUTION_ADMIN'
  ) {
    if (!role || !['RESEARCH_SUPERVISOR', 'RESEARCH_SCHOLAR', 'INSTITUTION_ADMIN'].includes(role)) {
      throw new BadRequestException('Invalid user role.');
    }
    return this.usersService.updateUserRole(req.user.id, targetUserId, role);
  }

  @Put(':id/suspend')
  async suspendUser(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body('suspended') suspended: boolean
  ) {
    return this.usersService.suspendUser(req.user.id, targetUserId, suspended);
  }

  @Get('audit-logs')
  async getAuditLogs(@Req() req: any) {
    return this.usersService.getAuditLogs(req.user.id);
  }
}
