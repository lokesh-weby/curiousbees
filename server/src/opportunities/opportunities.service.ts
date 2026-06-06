import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityInput } from '../shared/types';
import { CreateOpportunitySchema } from '../shared/shared-utils';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async getOpportunities(department?: string, researchDomain?: string) {
    return this.prisma.opportunity.findMany({
      where: {
        ...(department && { department }),
        ...(researchDomain && {
          researchDomain: { contains: researchDomain, mode: 'insensitive' }
        })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            department: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async createOpportunity(authorId: string, input: CreateOpportunityInput) {
    const parsed = CreateOpportunitySchema.safeParse(input);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors[0].message);
    }

    const { title, description, department, researchDomain } = parsed.data;

    // Verify user role is RESEARCH_SUPERVISOR (only faculty can post opportunities)
    const author = await this.prisma.user.findUnique({
      where: { id: authorId }
    });

    if (!author || author.role !== 'RESEARCH_SUPERVISOR') {
      throw new BadRequestException('Only verified faculty members are authorized to post research opportunities.');
    }

    return this.prisma.opportunity.create({
      data: {
        title,
        description,
        department,
        researchDomain,
        authorId
      },
      include: {
        author: {
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
    });
  }

  async createCollaborationRequest(scholarId: string, opportunityId: string, message?: string) {
    // 1. Verify scholar is approved
    const scholar = await this.prisma.user.findUnique({
      where: { id: scholarId }
    });
    if (!scholar) {
      throw new BadRequestException('Scholar not found.');
    }
    if (scholar.role !== 'RESEARCH_SCHOLAR') {
      throw new BadRequestException('Only scholars can submit collaboration requests.');
    }
    if (!scholar.approved) {
      throw new BadRequestException('Your profile is pending supervisor approval. You cannot request collaborations yet.');
    }

    // 2. Verify opportunity exists
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id: opportunityId }
    });
    if (!opportunity) {
      throw new BadRequestException('Opportunity not found.');
    }

    // 3. Prevent duplicate requests
    const existing = await this.prisma.collaborationRequest.findUnique({
      where: {
        scholarId_opportunityId: { scholarId, opportunityId }
      }
    });
    if (existing) {
      throw new BadRequestException('You have already submitted a collaboration request for this opportunity.');
    }

    return this.prisma.collaborationRequest.create({
      data: {
        scholarId,
        opportunityId,
        status: 'PENDING',
        message
      },
      include: {
        opportunity: true
      }
    });
  }

  async getRequestsForSupervisor(supervisorId: string) {
    return this.prisma.collaborationRequest.findMany({
      where: {
        opportunity: {
          authorId: supervisorId
        }
      },
      include: {
        scholar: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            department: true
          }
        },
        opportunity: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getRequestsForScholar(scholarId: string) {
    return this.prisma.collaborationRequest.findMany({
      where: { scholarId },
      include: {
        opportunity: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                department: true
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

  async updateRequestStatus(supervisorId: string, requestId: string, status: 'PUBLISHED' | 'REJECTED' | 'NEEDS_INFO') {
    const request = await this.prisma.collaborationRequest.findUnique({
      where: { id: requestId },
      include: {
        opportunity: true,
        scholar: true
      }
    });

    if (!request) {
      throw new BadRequestException('Collaboration request not found.');
    }

    if (request.opportunity.authorId !== supervisorId) {
      throw new BadRequestException('You are not authorized to update requests for this opportunity.');
    }

    const updated = await this.prisma.collaborationRequest.update({
      where: { id: requestId },
      data: { status }
    });

    // Write audit log
    await this.prisma.auditLog.create({
      data: {
        userId: supervisorId,
        action: 'UPDATE_COLLAB_REQUEST',
        details: `Supervisor updated request ${requestId} to status ${status}`
      }
    });

    // If approved (PUBLISHED), automatically spin up a collaboration workspace
    if (status === 'PUBLISHED') {
      const workspace = await this.prisma.workspace.create({
        data: {
          title: `Workspace: ${request.opportunity.title}`,
          description: `Research collaboration space for "${request.opportunity.title}" between Prof. ${request.opportunity.authorId} and scholar ${request.scholar.name || request.scholar.email}.`
        }
      });

      // Add Supervisor as Owner
      await this.prisma.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: supervisorId,
          role: 'OWNER'
        }
      });

      // Add Scholar as Member
      await this.prisma.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: request.scholarId,
          role: 'MEMBER'
        }
      });

      // Write audit log for workspace creation
      await this.prisma.auditLog.create({
        data: {
          userId: supervisorId,
          action: 'WORKSPACE_CREATE',
          details: `Auto-created workspace ${workspace.id} for opportunity ${request.opportunityId}`
        }
      });
    }

    return updated;
  }
}
