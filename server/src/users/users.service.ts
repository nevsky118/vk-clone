import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import mongoose, {
  PaginateModel,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<UserDocument>,
  ) {}

  // создать пользователя
  async create(userData: UserDto): Promise<User> {
    const createdCat = new this.userModel(userData);
    return createdCat.save();
  }

  // найти пользователя по айди
  async findById(userId: string): Promise<User> {
    if (!mongoose.isObjectIdOrHexString(userId)) {
      throw new BadRequestException();
    }

    const user = this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`Порльзователь #${userId} не найден`);
    }

    return user;
  }

  // найти пользователя по почте
  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  // обновить пользователя
  async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, data, { new: true });
  }

  // обновить аватар
  async updateAvatar(userId: string, avatar: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, { avatar }, { new: true });
  }

  // добавить лайкнутый пост
  async addLikedPost(userId: string, postId: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { liked: postId },
      },
      { new: true },
    );
  }

  // удалить лайкнутый пост
  async removeLikedPost(userId: string, postId: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { liked: postId },
      },
      { new: true },
    );
  }

  // добавить друга
  async addFriend(userId: string, friendId: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { friends: friendId },
      },
      { new: true },
    );
  }

  // удалить друга
  async removeFriend(userId: string, friendId: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: friendId },
      },
      { new: true },
    );
  }

  // пагинированный поиск друзей для генерации списка друзей
  async findFriends(query: PaginationQueryDto, userId: string): Promise<any> {
    const { page, limit } = query;

    const skip = (page - 1) * limit;

    const user = await this.userModel.findById(userId);

    const { friends } = await user.populate({
      path: 'friends',
      options: {
        skip,
        limit,
      },
      select: 'name avatar university',
    });

    return friends;
  }

  // весь список друзей по айди пользователя
  async getFriendsByUserId(userId: string): Promise<mongoose.Types.ObjectId[]> {
    const user = await this.userModel.findById(userId);
    return user.friends;
  }

  // список пользователей для поиска друзей
  async findNonFriendUsers(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginateResult<User>> {
    const { limit, page, q } = query;

    const options: PaginateOptions = {
      page,
      limit,
      select: '-friends',
    };

    const filters = {
      ...(q && { name: { $regex: q, $options: 'i' } }),
      _id: { $ne: userId }, // Исключить из выборки самих себя
      friends: { $ne: userId }, // Исключить уже имеющихся друзей
    };

    const users = await this.userModel.paginate(filters, options);
    return users;
  }
}
