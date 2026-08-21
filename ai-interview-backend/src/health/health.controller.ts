import { Controller, Get } from '@nestjs/common';
import { IsPublic } from '../common/decorators/public.decorator';
import { HealthService } from './health.service';

@Controller()
@IsPublic()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  healthCheck() {
    return this.healthService.getHealth();
  }
}
