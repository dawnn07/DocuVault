import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/curent-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/types/request.type';

import { OcrWebhookDto } from './dto/ocr-webhook.dto';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@Controller('v1/webhooks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('ocr')
  processOcr(@CurrentUser() user: JwtPayload, @Body() ocrDto: OcrWebhookDto) {
    return this.webhooksService.processOcrWebhook(user.id, ocrDto);
  }
}
