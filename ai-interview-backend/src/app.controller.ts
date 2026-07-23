import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './common/decorators/public.decorator';

@Controller()
@IsPublic()
export class AppController {
  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
