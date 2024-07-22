import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Task document interface.
 */
export type TaskDocument = Task & Document;

/**
 * Task schema definition.
 */
@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 'pending' })
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
