import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { JwtPayload } from 'src/common/types/request.type';

import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('v1/tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(user.sub, createTagDto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.tagsService.findByOwner(user.sub);
  }

  @Delete(':id')
  delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.tagsService.delete(id, user.sub);
  }
}
