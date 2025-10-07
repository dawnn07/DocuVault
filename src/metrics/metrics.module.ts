import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Document,
  DocumentSchema,
} from 'src/documents/schemas/document.schema';
import { Tag, TagSchema } from 'src/tags/tag.schema';
import { Task, TaskSchema } from 'src/tasks/task.schema';
import { Usage, UsageSchema } from 'src/usage/usage.schema';

import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: Tag.name, schema: TagSchema },
      { name: Usage.name, schema: UsageSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
