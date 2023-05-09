import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FriendDocument = HydratedDocument<Friend>;

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
export class Friend {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  from: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  to: mongoose.Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  pending: boolean;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

// FriendSchema.index({ user: 1, friend: 1 }, { unique: true });
