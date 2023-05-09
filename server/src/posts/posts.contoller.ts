import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostType } from './entities/post.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from 'src/common/request-with-user.interface';
import { StorageService } from 'src/storage/storage.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginateResult } from 'mongoose';
import { PostDto } from './dtos/post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createPost(
    @UploadedFile() photo: Express.Multer.File,
    @Req() req: RequestWithUser,
    @Body() post: PostDto,
  ): Promise<any> {
    // генерируем айди для поста

    // если прикреплена фотография
    if (photo) {
      // загружаем в хранилище, получаем ссылку
      let uploadedPhoto = await this.storageService.uploadOne(
        photo,
        `${req.user.sub}/posts`,
      );

      // создаем пост
      return this.postsService.create({
        ...post,
        photo: uploadedPhoto,
        author: req.user.sub,
      });
    }

    // создаем пост
    return this.postsService.create({
      ...post,
      author: req.user.sub,
    });
  }

  @Public()
  @Get(':author')
  async findPostsByAuthor(
    @Param('author') author: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginateResult<PostType>> {
    return this.postsService.findPostsByAuthor(query, author);
  }

  @Put(':postId')
  @UseInterceptors(FileInterceptor('photo'))
  async updatePost(
    @UploadedFile() photo: Express.Multer.File,
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostType> {
    const post = await this.postsService.findPostById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    if (post.author.toString() !== req.user.sub) {
      throw new BadRequestException();
    }

    // если прикреплен новый файл
    if (photo) {
      // удаляем старое фото
      await this.storageService.deleteOne(post.photo);

      // загружаем новое, получаем ссылку
      let uploadedPhoto = await this.storageService.uploadOne(
        photo,
        `${req.user.sub}/posts`,
      );

      // обновляем пост
      return this.postsService.update(postId, {
        ...updatePostDto,
        photo: uploadedPhoto,
      });
    }

    // обновляем пост
    return this.postsService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  async deletePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<PostType> {
    // удаляем пост
    const deletedPost = await this.postsService.delete(req.user.sub, postId);

    // удаляем из хранилища фото
    await this.storageService.deleteOne(deletedPost.photo);

    return deletedPost;
  }

  @Post(':postId/like')
  async like(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ): Promise<PostType> {
    return await this.postsService.like(req.user.sub, postId);
  }
}
