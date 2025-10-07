import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtPayload } from 'src/common/types/request.type';

import { MetricsService } from './metrics.service';

@ApiTags('metrics')
@Controller('v1/metrics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Roles('admin')
  getGlobalMetrics() {
    return this.metricsService.getMetrics();
  }

  @Get('user')
  @Roles('user', 'admin')
  getUserMetrics(@CurrentUser() user: JwtPayload) {
    return this.metricsService.getMetrics(user.id);
  }
}
