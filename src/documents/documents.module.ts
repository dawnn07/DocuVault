import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsModule } from 'src/tags/tags.module';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './schemas/document.schema';
import { DocumentSchema } from './schemas/document.schema';
import { DocumentTag, DocumentTagSchema } from './schemas/document-tag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: DocumentTag.name, schema: DocumentTagSchema },
    ]),
    TagsModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
