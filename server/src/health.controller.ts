import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('health')
export class HealthController {
  @Get('db')
  async checkDb() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', message: 'Database connection successful' };
    } catch (error) {
      return { status: 'error', message: error };
    }
  }
}
