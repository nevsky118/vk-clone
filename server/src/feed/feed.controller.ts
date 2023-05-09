import { Controller, Req, Get, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import RequestWithUser from 'src/common/request-with-user.interface';
import { FriendsService } from 'src/friends/friends.service';
import { PostsService } from 'src/posts/posts.service';

@Controller('feed')
export class FeedController {
  constructor(
    private friendsService: FriendsService,
    private postsService: PostsService,
  ) {}

  @Get()
  async getFeed(
    @Req() req: RequestWithUser,
    @Query() query: PaginationQueryDto,
  ) {
    // получаем весь список друзей
    const friends = await this.friendsService.findAllFriendsById(req.user.sub);

    // Создаем массив промисов на получение всех постов друзей
    const promises = friends.map(async (friend) => {
      const posts = await this.postsService.findAllPostsByAuthor(friend);
      return posts;
    });

    // Ожидаем завершения всех промисов и объединяем все посты в единую коллекцию
    const feed = await Promise.all(promises).then((results) =>
      results.flat().sort((a, b) => b.createdAt - a.createdAt),
    );

    // Применяем пагинацию
    const { page, limit } = query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedFeed = feed.slice(startIndex, endIndex);
    const hasNextPage = endIndex < feed.length;

    return { docs: paginatedFeed, page, limit, hasNextPage };
  }
}
