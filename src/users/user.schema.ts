import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({
    required: true,
    enum: ['admin', 'support', 'moderator', 'user'],
    default: 'user',
  })
  role: string;

  @Prop({ default: 0 })
  credits: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
