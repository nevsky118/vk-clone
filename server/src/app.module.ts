import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsModule } from './friends/friends.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    PostsModule,
    FriendsModule,
    AuthModule,
    StorageModule,
    MessagesModule,
    ChatsModule,
    FeedModule,
  ],
})
export class AppModule {}
