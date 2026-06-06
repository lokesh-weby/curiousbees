import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully.');
    } catch (e: any) {
      this.logger.warn('⚠️ Database connection failed. NestJS will operate in demo mode with fallback mock services.');
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (e) {}
  }
}
