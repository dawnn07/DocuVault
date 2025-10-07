import { Module } from '@nestjs/common';
import { DocumentsModule } from 'src/documents/documents.module';
import { UsageModule } from 'src/usage/usage.module';

import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { MockProcessorService } from './processors/mock-processor.service';

@Module({
  imports: [DocumentsModule, UsageModule],
  controllers: [ActionsController],
  providers: [ActionsService, MockProcessorService],
  exports: [],
})
export class ActionsModule {}
