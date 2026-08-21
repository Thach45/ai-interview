import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { QUEUE_NAMES } from '../operate-system.constants';

export enum QueueJobState {
  ALL = 'all',
  WAITING = 'waiting',
  ACTIVE = 'active',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum QueueChartBucket {
  HOUR = 'hour',
  DAY = 'day',
}

export class QueueOverviewQueryDto {
  @IsOptional()
  @IsEnum(QueueChartBucket)
  bucket?: QueueChartBucket = QueueChartBucket.HOUR;
}

export class QueueJobsQueryDto {
  @IsOptional()
  @IsIn(QUEUE_NAMES)
  queueName?: (typeof QUEUE_NAMES)[number];

  @IsOptional()
  @IsEnum(QueueJobState)
  state?: QueueJobState = QueueJobState.ALL;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(100)
  limit?: number = 20;
}
