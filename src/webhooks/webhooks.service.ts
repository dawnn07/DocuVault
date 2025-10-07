import { Injectable } from '@nestjs/common';
import { AuditService } from 'src/audit/audit.service';

import { TasksService } from '../tasks/tasks.service';
import { ContentClassifierService } from './content-classifier.service';
import { OcrWebhookDto } from './dto/ocr-webhook.dto';

@Injectable()
export class WebhooksService {
  constructor(
    private tasksService: TasksService,
    private auditService: AuditService,
    private classifier: ContentClassifierService
  ) {}

  async processOcrWebhook(
    userId: string,
    webhookDto: OcrWebhookDto
  ): Promise<any> {
    await this.auditService.log({
      userId,
      action: 'webhook_received',
      entityType: 'ocr',
      entityId: webhookDto.imageId,
      metadata: {
        source: webhookDto.source,
        textLength: webhookDto.text.length,
      },
    });

    const classification = this.classifier.classify(webhookDto.text);

    if (classification.isAd) {
      const tasksToday = await this.tasksService.countTasksBySourceToday(
        userId,
        webhookDto.source
      );

      if (tasksToday >= 3) {
        return {
          success: true,
          classification: classification.category,
          message: 'Rate limit reached for this sender today',
          taskCreated: false,
        };
      }

      const unsubInfo = this.classifier.extractUnsubscribeInfo(webhookDto.text);

      const task = await this.tasksService.create(userId, {
        type: 'unsubscribe',
        channel: unsubInfo?.channel || 'unknown',
        target: unsubInfo?.target || 'not_found',
        source: webhookDto.source,
        imageId: webhookDto.imageId,
        metadata: {
          classification: classification.category,
          originalMeta: webhookDto.meta as Record<string, unknown>,
        },
      });

      await this.auditService.log({
        userId,
        action: 'task_created',
        entityType: 'task',
        entityId: (task._id as string | number).toString(),
        metadata: {
          taskType: 'unsubscribe',
          source: webhookDto.source,
        },
      });

      return {
        success: true,
        classification: classification.category,
        taskCreated: true,
        task: {
          id: task._id,
          type: task.type,
          channel: task.channel,
          target: task.target,
        },
      };
    }

    return {
      success: true,
      classification: classification.category,
      taskCreated: false,
      message: 'Document classified, no action required',
    };
  }
}
