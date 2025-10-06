import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
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
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  create(@CurrentUser() user: JwtPayload, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(user.id, createTagDto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    console.log('Fetching tags for user:', user);
    return this.tagsService.findByOwner(user.id);
  }

  @Delete(':id')
  delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.tagsService.delete(id, user.id);
  }
}
