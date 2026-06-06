import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  // Check if a user is a member of the workspace
  private async checkMembership(userId: string, workspaceId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId }
      }
    });
    if (!member) {
      throw new ForbiddenException('You are not a member of this workspace.');
    }
    return member;
  }

  async getWorkspaces(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getWorkspace(userId: string, workspaceId: string) {
    await this.checkMembership(userId, workspaceId);

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                department: true
              }
            }
          }
        },
        files: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            uploadedAt: 'desc'
          }
        },
        milestones: {
          orderBy: {
            dueDate: 'asc'
          }
        },
        announcements: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found.');
    }

    return workspace;
  }

  async addFile(userId: string, workspaceId: string, name: string, url: string, size: number) {
    await this.checkMembership(userId, workspaceId);

    const file = await this.prisma.workspaceFile.create({
      data: {
        workspaceId,
        name,
        url,
        size,
        uploadedById: userId
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'WORKSPACE_ADD_FILE',
        details: `User uploaded file "${name}" to workspace ${workspaceId}`
      }
    });

    return file;
  }

  async addMilestone(userId: string, workspaceId: string, title: string, description?: string, dueDate?: string) {
    const member = await this.checkMembership(userId, workspaceId);
    
    // Only workspace owners (supervisors) can create milestones
    if (member.role !== 'OWNER') {
      throw new ForbiddenException('Only workspace owners can create milestones.');
    }

    const milestone = await this.prisma.workspaceMilestone.create({
      data: {
        workspaceId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'WORKSPACE_ADD_MILESTONE',
        details: `Supervisor created milestone "${title}" in workspace ${workspaceId}`
      }
    });

    return milestone;
  }

  async toggleMilestone(userId: string, workspaceId: string, milestoneId: string, completed: boolean) {
    await this.checkMembership(userId, workspaceId);

    const milestone = await this.prisma.workspaceMilestone.findUnique({
      where: { id: milestoneId }
    });

    if (!milestone || milestone.workspaceId !== workspaceId) {
      throw new BadRequestException('Milestone not found in this workspace.');
    }

    const updated = await this.prisma.workspaceMilestone.update({
      where: { id: milestoneId },
      data: { completed }
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'WORKSPACE_TOGGLE_MILESTONE',
        details: `User toggled milestone "${milestone.title}" to completed=${completed}`
      }
    });

    return updated;
  }

  async addAnnouncement(userId: string, workspaceId: string, title: string, content: string) {
    await this.checkMembership(userId, workspaceId);

    const announcement = await this.prisma.workspaceAnnouncement.create({
      data: {
        workspaceId,
        title,
        content,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'WORKSPACE_ADD_ANNOUNCEMENT',
        details: `User posted announcement "${title}" in workspace ${workspaceId}`
      }
    });

    return announcement;
  }
}
