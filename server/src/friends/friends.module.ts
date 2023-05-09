import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from './entities/friend.entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Friend.name,
        useFactory: () => {
          const schema = FriendSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ]),
    UsersModule,
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
