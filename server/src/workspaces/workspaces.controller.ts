import { Controller, Get, Post, Put, Body, UseGuards, Req, Param, BadRequestException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { ApprovedGuard } from '../auth/approved.guard';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
@UseGuards(FirebaseAuthGuard, ApprovedGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async getWorkspaces(@Req() req: any) {
    return this.workspacesService.getWorkspaces(req.user.id);
  }

  @Get(':id')
  async getWorkspace(@Req() req: any, @Param('id') workspaceId: string) {
    return this.workspacesService.getWorkspace(req.user.id, workspaceId);
  }

  @Post(':id/files')
  async addFile(
    @Req() req: any,
    @Param('id') workspaceId: string,
    @Body('name') name: string,
    @Body('url') url: string,
    @Body('size') size: number
  ) {
    if (!name || !url) {
      throw new BadRequestException('File name and URL are required.');
    }
    return this.workspacesService.addFile(req.user.id, workspaceId, name, url, size || 0);
  }

  @Post(':id/milestones')
  async addMilestone(
    @Req() req: any,
    @Param('id') workspaceId: string,
    @Body('title') title: string,
    @Body('description') description?: string,
    @Body('dueDate') dueDate?: string
  ) {
    if (!title) {
      throw new BadRequestException('Milestone title is required.');
    }
    return this.workspacesService.addMilestone(req.user.id, workspaceId, title, description, dueDate);
  }

  @Put(':id/milestones/:milestoneId')
  async toggleMilestone(
    @Req() req: any,
    @Param('id') workspaceId: string,
    @Param('milestoneId') milestoneId: string,
    @Body('completed') completed: boolean
  ) {
    if (completed === undefined) {
      throw new BadRequestException('completed flag is required.');
    }
    return this.workspacesService.toggleMilestone(req.user.id, workspaceId, milestoneId, completed);
  }

  @Post(':id/announcements')
  async addAnnouncement(
    @Req() req: any,
    @Param('id') workspaceId: string,
    @Body('title') title: string,
    @Body('content') content: string
  ) {
    if (!title || !content) {
      throw new BadRequestException('Announcement title and content are required.');
    }
    return this.workspacesService.addAnnouncement(req.user.id, workspaceId, title, content);
  }
}
