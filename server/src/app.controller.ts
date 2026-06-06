import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get(['', 'api'])
  healthCheck() {
    return {
      message: 'Welcome to CuriousBees API',
      status: 'ok',
      service: 'CuriousBees API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      docs: '/api',
    };
  }

  @Get(['health', 'api/health'])
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
