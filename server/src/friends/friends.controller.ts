import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Friend } from './entities/friend.entity';
import { FriendDto } from './dtos/friend.dto';
import { Public } from 'src/common/decorators/public.decorator';
import RequestWithUser from 'src/common/request-with-user.interface';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginateResult } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService,
  ) {}

  // создать заявку в друзья
  @Post('create')
  async create(
    @Req() req: RequestWithUser,
    @Body() body: FriendDto,
  ): Promise<Friend> {
    return this.friendsService.create(req.user.sub, body.to);
  }

  // удалить из друзей
  @Delete(':requestId')
  async delete(@Param('requestId') requestId: string): Promise<Friend> {
    return this.friendsService.delete(requestId);
  }

  // принять заявку в друзья
  @Patch(':requestId/accept')
  async accept(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ): Promise<Friend> {
    return this.friendsService.accept(requestId, req.user.sub);
  }

  // отклонить заявку в друзья
  @Patch(':requestId/reject')
  async reject(
    @Req() req: RequestWithUser,
    @Param('requestId') requestId: string,
  ): Promise<Friend> {
    return this.friendsService.reject(requestId, req.user.sub);
  }

  // список входящих заявок в друзья
  @Get('incoming')
  async getIncomingFriendRequests(
    @Req() req: RequestWithUser,
  ): Promise<Friend[]> {
    return this.friendsService.findIncomingRequests(req.user.sub);
  }

  // список исходящих заявок в друзья
  @Get('outgoing')
  async getOutgoingFriendRequests(
    @Req() req: RequestWithUser,
  ): Promise<Friend[]> {
    return this.friendsService.findOutgoingRequests(req.user.sub);
  }

  // список друзей авторизованного пользователя
  @Get('list')
  async getFriends(
    @Req() req: RequestWithUser,
    @Query() query: PaginationQueryDto,
  ): Promise<any> {
    return this.friendsService.findFriendsById(query, req.user.sub);
  }

  // список друзей пользователя по айди
  @Public()
  @Get('list/:userId')
  async getFriendsByUserId(
    @Param('userId') userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<any> {
    return this.friendsService.findFriendsById(query, userId);
  }

  // статус заявки в друзья
  @Get('status/:friendId')
  async getFriendRequestById(
    @Req() req: RequestWithUser,
    @Param('friendId') friendId: string,
  ): Promise<Friend> {
    return this.friendsService.findFriendRequest(req.user.sub, friendId);
  }

  // найти друзей
  @Get('find')
  async getFriendsFindList(
    @Req() req: RequestWithUser,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginateResult<User>> {
    return this.usersService.findNonFriendUsers(req.user.sub, query);
  }
}
