import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

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
export class Post {
  @Prop()
  content: string;

  @Prop()
  photo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: mongoose.Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  likes: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ content: 'text' });
