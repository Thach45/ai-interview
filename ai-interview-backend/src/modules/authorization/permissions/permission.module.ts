import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionController } from './permission.controller';
import { PermissionDiscoveryService } from './permission-discovery.service';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PermissionRepository,
    PermissionDiscoveryService,
  ],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
