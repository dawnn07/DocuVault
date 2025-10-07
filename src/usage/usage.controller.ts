import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/types/request.type';

import { UsageService } from './usage.service';

@ApiTags('usage')
@Controller('v1/actions/usage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get('month')
  getMonthlyUsage(@CurrentUser() user: JwtPayload) {
    return this.usageService.getMonthlyUsage(user.id);
  }
}
