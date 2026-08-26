import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/subscription.dto';

@Controller('admin/packages')
export class AdminSubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getAllPackages() {
    return this.subscriptionService.getAllPackagesForAdmin();
  }

  @Get(':id')
  async getPackageById(@Param('id') id: string) {
    return this.subscriptionService.getPackageById(id);
  }

  @Post()
  async createPackage(@Body() dto: CreatePackageDto) {
    return this.subscriptionService.createPackage(dto);
  }

  @Put(':id')
  async updatePackage(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.subscriptionService.updatePackage(id, dto);
  }

  @Delete(':id')
  async deletePackage(@Param('id') id: string) {
    return this.subscriptionService.deletePackage(id);
  }
}
