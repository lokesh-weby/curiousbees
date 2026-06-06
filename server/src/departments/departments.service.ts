import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; code: string; description?: string }) {
    const existingName = await this.prisma.department.findUnique({
      where: { name: data.name },
    });
    if (existingName) {
      throw new ConflictException('Department with this name already exists.');
    }

    const existingCode = await this.prisma.department.findUnique({
      where: { code: data.code },
    });
    if (existingCode) {
      throw new ConflictException('Department with this code already exists.');
    }

    return this.prisma.department.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const dept = await this.prisma.department.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!dept) {
      throw new NotFoundException('Department not found.');
    }
    return dept;
  }

  async update(id: string, data: { name?: string; code?: string; description?: string }) {
    await this.findOne(id);

    if (data.name) {
      const existingName = await this.prisma.department.findFirst({
        where: { name: data.name, id: { not: id } },
      });
      if (existingName) {
        throw new ConflictException('Another department with this name already exists.');
      }
    }

    if (data.code) {
      const existingCode = await this.prisma.department.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (existingCode) {
        throw new ConflictException('Another department with this code already exists.');
      }
    }

    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
