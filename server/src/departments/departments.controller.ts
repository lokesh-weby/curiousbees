import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { FirebaseAuthGuard } from '../auth/firebase.guard';
import { ApprovedGuard } from '../auth/approved.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('departments')
@UseGuards(FirebaseAuthGuard, ApprovedGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: { name: string; code: string; description?: string }) {
    return this.departmentsService.create(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; code?: string; description?: string }
  ) {
    return this.departmentsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
