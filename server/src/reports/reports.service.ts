import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(scholarId: string, data: { title: string; description?: string; evidenceUrl?: string; supervisorId: string }) {
    return this.prisma.report.create({
      data: {
        title: data.title,
        description: data.description,
        evidenceUrl: data.evidenceUrl,
        status: 'PENDING',
        scholarId,
        supervisorId: data.supervisorId,
      },
      include: {
        scholar: {
          select: { id: true, name: true, email: true },
        },
        supervisor: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(userId: string, role: string) {
    if (role === 'RESEARCH_SCHOLAR') {
      return this.prisma.report.findMany({
        where: { scholarId: userId },
        include: {
          supervisor: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (role === 'RESEARCH_SUPERVISOR') {
      return this.prisma.report.findMany({
        where: { supervisorId: userId },
        include: {
          scholar: {
            select: { id: true, name: true, email: true, department: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (role === 'INSTITUTION_ADMIN') {
      return this.prisma.report.findMany({
        include: {
          scholar: {
            select: { id: true, name: true, email: true, department: true },
          },
          supervisor: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    return [];
  }

  async findOne(id: string, userId: string, role: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        scholar: {
          select: { id: true, name: true, email: true, department: true },
        },
        supervisor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    if (
      report.scholarId !== userId &&
      report.supervisorId !== userId &&
      role !== 'INSTITUTION_ADMIN'
    ) {
      throw new ForbiddenException('Access denied. You cannot view this report.');
    }

    return report;
  }

  async review(id: string, supervisorId: string, data: { status: string; feedback?: string }) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    if (report.supervisorId !== supervisorId) {
      throw new ForbiddenException('Access denied. Only the assigned supervisor can review this report.');
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        status: data.status,
        feedback: data.feedback,
      },
      include: {
        scholar: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}
