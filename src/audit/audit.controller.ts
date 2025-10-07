import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtPayload } from 'src/common/types/request.type';

import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller('v1/audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('admin')
  findAll(@Query('limit') limit?: number) {
    return this.auditService.findAll(limit || 1000);
  }

  @Get('user')
  @Roles('user', 'admin')
  findByUser(@CurrentUser() user: JwtPayload, @Query('limit') limit?: number) {
    return this.auditService.findByUser(user.id, limit || 100);
  }

  @Get('entity/:type/:id')
  @Roles('admin')
  findByEntity(@Param('type') type: string, @Param('id') id: string) {
    return this.auditService.findByEntity(type, id);
  }
}
