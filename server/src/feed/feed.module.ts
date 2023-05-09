import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FriendsModule } from 'src/friends/friends.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [FriendsModule, PostsModule],
  controllers: [FeedController],
})
export class FeedModule {}
