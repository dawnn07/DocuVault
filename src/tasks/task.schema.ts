import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  channel?: string;

  @Prop()
  target?: string;

  @Prop()
  source?: string;

  @Prop()
  imageId?: string;

  @Prop({ type: Object })
  metadata?: any;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ source: 1, userId: 1, createdAt: -1 });
