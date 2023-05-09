import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
  timestamps: true,
})
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
  chatId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: mongoose.Types.ObjectId;

  @Prop()
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
