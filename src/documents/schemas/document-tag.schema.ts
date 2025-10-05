import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentTagDocument = HydratedDocument<DocumentTag>;

@Schema()
export class DocumentTag {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Document' })
  documentId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Tag' })
  tagId: Types.ObjectId;

  @Prop({ required: true, default: false })
  isPrimary: boolean;
}

export const DocumentTagSchema = SchemaFactory.createForClass(DocumentTag);
