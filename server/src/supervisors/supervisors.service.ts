import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupervisorsService {
  private readonly logger = new Logger(SupervisorsService.name);

  constructor(private prisma: PrismaService) {}

  async getSupervisors(search?: string) {
    const supervisors = await this.prisma.user.findMany({
      where: {
        role: 'RESEARCH_SUPERVISOR',
        approved: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { department: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        image: true,
      },
      take: 20,
    });

    this.logger.log(`[AUTH] Supervisor Count: ${supervisors.length} (search='${search || ''}')`);
    return supervisors;
  }

  async getPendingScholars(supervisorId: string) {
    return this.prisma.user.findMany({
      where: {
        supervisorId: supervisorId,
        role: 'RESEARCH_SCHOLAR',
        approved: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        image: true,
        createdAt: true,
      },
    });
  }

  async approveScholar(supervisorId: string, scholarId: string) {
    const scholar = await this.prisma.user.findFirst({
      where: {
        id: scholarId,
        supervisorId: supervisorId,
        role: 'RESEARCH_SCHOLAR',
      },
    });

    if (!scholar) {
      throw new BadRequestException('Pending scholar request not found.');
    }

    return this.prisma.user.update({
      where: { id: scholarId },
      data: {
        approved: true,
        status: 'APPROVED',
        approvedBy: supervisorId,
        approvedAt: new Date(),
      },
    });
  }

  async rejectScholar(supervisorId: string, scholarId: string) {
    const scholar = await this.prisma.user.findFirst({
      where: {
        id: scholarId,
        supervisorId: supervisorId,
        role: 'RESEARCH_SCHOLAR',
      },
    });

    if (!scholar) {
      throw new BadRequestException('Pending scholar request not found.');
    }

    return this.prisma.user.update({
      where: { id: scholarId },
      data: { supervisorId: null, supervisorEmail: null, approved: false },
    });
  }
}
