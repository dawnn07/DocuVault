import { Module } from '@nestjs/common';
import { AuditModule } from 'src/audit/audit.module';
import { TasksModule } from 'src/tasks/tasks.module';

import { ContentClassifierService } from './content-classifier.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [TasksModule, AuditModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, ContentClassifierService],
})
export class WebhooksModule {}
