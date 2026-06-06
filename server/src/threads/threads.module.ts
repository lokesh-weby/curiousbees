import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ThreadsController],
  providers: [ThreadsService],
  exports: [ThreadsService]
})
export class ThreadsModule {}
