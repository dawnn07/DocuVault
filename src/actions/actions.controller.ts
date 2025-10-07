import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtPayload } from 'src/common/types/request.type';

import { ActionsService } from './actions.service';
import { RunActionDto } from './dto/run-action.dto';

@ApiTags('actions')
@Controller('v1/actions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post('run')
  @Roles('user', 'admin')
  runAction(
    @CurrentUser() user: JwtPayload,
    @Body() runActionDto: RunActionDto
  ) {
    return this.actionsService.runAction(user.id, runActionDto);
  }
}
