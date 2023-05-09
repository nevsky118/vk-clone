import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { PostsController } from './posts.contoller';
import { StorageModule } from 'src/storage/storage.module';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          const schema = PostSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ]),
    UsersModule,
    StorageModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
