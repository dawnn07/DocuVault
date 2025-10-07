import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UsageDocument = Usage & Document;

@Schema({ timestamps: true })
export class Usage {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true, default: 5 })
  credits: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: Object })
  metadata: any;
}

export const UsageSchema = SchemaFactory.createForClass(Usage);
UsageSchema.index({ userId: 1, timestamp: -1 });
