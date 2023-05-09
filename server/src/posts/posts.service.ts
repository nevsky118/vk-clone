import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostDto } from './dtos/post.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: PaginateModel<PostDocument>,
    private readonly usersService: UsersService,
  ) {}

  // создание поста
  async create(
    post: PostDto & { author: string; photo?: string },
  ): Promise<Post> {
    const createdPost = new this.postModel(post);
    return createdPost.save();
  }

  // поиск постов по автору
  async findPostsByAuthor(
    paginationQuery: PaginationQueryDto,
    author: string,
  ): Promise<PaginateResult<Post>> {
    const { limit, page, q } = paginationQuery;

    const options: PaginateOptions = {
      page,
      limit,
      populate: ['author'],
      sort: { createdAt: -1 },
    };

    if (q) {
      const posts = await this.postModel.paginate(
        { content: { $regex: q, $options: 'i' }, author },
        options,
      );
      return posts;
    }

    const posts = await this.postModel.paginate({ author }, options);
    return posts;
  }

  // поиск поста по айди
  async findPostById(postId: string): Promise<Post> {
    return this.postModel.findById(postId);
  }

  // обновление поста
  async update(postId: string, data: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel.findByIdAndUpdate(postId, data, {
      new: true,
    });

    return updatedPost;
  }

  // удаление поста
  async delete(userId: string, postId: string): Promise<Post> {
    const existingPost = await this.postModel.findById(postId);

    if (existingPost.author.toString() !== userId) {
      throw new UnauthorizedException();
    }

    await this.usersService.removeLikedPost(userId, postId);

    return await existingPost.deleteOne();
  }

  // лайк поста
  async like(userId: string, postId: string): Promise<Post> {
    const existingPost = await this.postModel.findById(postId);

    if (!existingPost) {
      throw new NotFoundException();
    }

    // находим пользователя
    const user = await this.usersService.findById(userId);

    const likedByUser = user.liked.includes(postId as any);

    // если пост уже был лайкнут
    if (likedByUser) {
      // удаляю лайк с поста и пользователя
      existingPost.likes -= 1;
      await this.usersService.removeLikedPost(userId, postId);
    } else {
      // добавляю лайк с поста и пользователя
      existingPost.likes += 1;
      await this.usersService.addLikedPost(userId, postId);
    }
    await existingPost.save();

    return existingPost;
  }

  async findAllPostsByAuthor(author: string): Promise<Post[]> {
    return await this.postModel.find({ author }).populate('author');
  }
}
