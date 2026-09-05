import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  QueueChartBucket,
  QueueJobsQueryDto,
  QueueOverviewQueryDto,
} from './dto/operate-system.dto';
import { QueueName } from './operate-system.constants';
import { OperateSystemService } from './operate-system.service';

@Controller('admin/operate-system')
export class OperateSystemController {
  constructor(private readonly operateSystemService: OperateSystemService) {}

  @Get('queues/overview')
  getQueueOverview(@Query() query: QueueOverviewQueryDto) {
    return this.operateSystemService.getQueueOverview(
      query.bucket ?? QueueChartBucket.HOUR,
    );
  }

  @Get('queues/jobs')
  getJobs(@Query() query: QueueJobsQueryDto) {
    return this.operateSystemService.getJobs(query);
  }

  @Get('queues/:queueName/jobs/:jobId')
  getJobDetail(
    @Param('queueName') queueName: QueueName,
    @Param('jobId') jobId: string,
  ) {
    return this.operateSystemService.getJobDetail(queueName, jobId);
  }
}
