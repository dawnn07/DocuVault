import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentDocument = HydratedDocument<Document>;

@Schema()
export class Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mime: string;

  @Prop({ default: '' })
  textContent: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
