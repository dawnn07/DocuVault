import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/types/request.type';

import { DocumentsService } from './documents.service';
import { SearchDocumentDto } from './dtos/search-document';
import { UploadDocumentDto } from './dtos/upload-document.dto';

@ApiTags('documents')
@Controller('v1')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('docs')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Upload a document file' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        primaryTag: { type: 'string' },
        secondaryTags: { type: 'array', items: { type: 'string' } },
        textContent: { type: 'string' },
      },
    },
  })
  async upload(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadDocumentDto
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.documentsService.upload(user.id, file, uploadDto);
  }

  @Get('folders')
  getFolders(@CurrentUser() user: JwtPayload) {
    return this.documentsService.getFolders(user.id);
  }

  @Get('folders/:tag/docs')
  getDocumentsByFolder(
    @CurrentUser() user: JwtPayload,
    @Param('tag') tag: string
  ) {
    return this.documentsService.getDocumentsByFolder(user.id, tag);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search documents' })
  search(
    @CurrentUser() user: JwtPayload,
    @Query() searchDto: SearchDocumentDto
  ) {
    return this.documentsService.search(user.id, searchDto);
  }
}
