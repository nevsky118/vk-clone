import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Friend, FriendDocument } from './entities/friend.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: PaginateModel<FriendDocument>,
    private readonly usersService: UsersService,
  ) {}

  // создать запрос в друзья
  async create(userId: string, friendId: string): Promise<Friend> {
    // нельзя отправить запрос самому себе
    if (userId === friendId) {
      throw new BadRequestException();
    }

    const existingFriendRequest = await this.friendModel.findOne({
      from: userId,
      to: friendId,
    });

    if (existingFriendRequest) {
      throw new ConflictException('Запрос на добавление в друзья уже создан');
    }

    const friendRequest = new this.friendModel({ from: userId, to: friendId });

    return await friendRequest.save();
  }

  // принять запрос в друзья
  async accept(requestId: string, userId: string): Promise<Friend> {
    // поиск заявки в друзья
    const friendRequest = await this.friendModel.findById(requestId);

    if (!friendRequest) {
      throw new NotFoundException('Заявка в друзья не найдена');
    }

    if (!friendRequest.pending) {
      throw new BadRequestException('Заявка уже принята');
    }

    if (friendRequest.from.toString() === userId) {
      throw new BadRequestException();
    }

    // Обновляю заявку, статус pending = false.
    friendRequest.pending = false;

    // Добавляю айди друга в модель каждого пользователя
    await this.usersService.addFriend(
      friendRequest.from.toString(),
      friendRequest.to.toString(),
    );
    await this.usersService.addFriend(
      friendRequest.to.toString(),
      friendRequest.from.toString(),
    );

    return await friendRequest.save();
  }

  // отклонить запрос в друзья
  async reject(requestId: string, userId: string): Promise<Friend> {
    const friendRequest = await this.friendModel.findById(requestId);

    if (!friendRequest) {
      throw new NotFoundException('Заявка в друзья не найдена');
    }

    return await friendRequest.deleteOne();
  }

  // удалить запрос в друзья
  async delete(requestId: string): Promise<Friend> {
    const friendRequest = await this.friendModel.findByIdAndDelete(requestId);

    if (!friendRequest) {
      throw new NotFoundException('Заявка в друзья не найдена');
    }

    // удаляю у каждого пользователя айди друга
    await this.usersService.removeFriend(
      friendRequest.from.toString(),
      friendRequest.to.toString(),
    );
    await this.usersService.removeFriend(
      friendRequest.to.toString(),
      friendRequest.from.toString(),
    );

    return friendRequest;
  }

  // входящие запросы в друзья
  async findIncomingRequests(userId: string) {
    const requests = await this.friendModel
      .find({ to: userId, pending: true })
      .populate('from');
    return requests;
  }

  // исходящие запросы в друзья
  async findOutgoingRequests(userId: string) {
    const requests = await this.friendModel
      .find({
        from: userId,
        pending: true,
      })
      .populate('to');
    return requests;
  }

  // пагинированный поиск друзей по айди пользователя
  async findFriendsById(
    query: PaginationQueryDto,
    userId: string,
  ): Promise<any> {
    const { page, limit } = query;

    const friends = await this.usersService.findFriends(query, userId);

    const friendList = await Promise.all(
      // @ts-ignore
      friends.map(async ({ id, name, university, avatar }) => {
        const friendShip = await this.friendModel.findOne({
          $or: [
            { from: userId, to: id, pending: false },
            { to: userId, from: id, pending: false },
          ],
        });

        return { id, name, university, avatar, friendShipId: friendShip.id };
      }),
    );

    return { docs: friendList, page, totalDocs: friends.length };
  }

  // поиск всех друзей по айди
  async findAllFriendsById(userId: string): Promise<any> {
    const friends = await this.usersService.getFriendsByUserId(userId);
    return friends;
  }

  // поиск заявки в друзья
  async findFriendRequest(userId: string, friendId: string): Promise<Friend> {
    const existingFriendRequest = await this.friendModel.findOne({
      from: userId,
      to: friendId,
    });

    if (!existingFriendRequest) {
      return null;
    }

    return existingFriendRequest;
  }
}
