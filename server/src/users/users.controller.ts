import {
  Controller,
  Get,
  UseInterceptors,
  Param,
  Body,
  Patch,
  Put,
  UploadedFile,
  Req,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import RequestWithUser from 'src/common/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Public()
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, user);
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<User> {
    const user = await this.usersService.findById(req.user.sub);

    if (avatar) {
      let uploadedAvatar = await this.storageService.uploadOne(
        avatar,
        req.user.sub,
      );

      if (user.avatar) {
        // удаляем старый аватар, если загружен новый
        await this.storageService.deleteOne(user.avatar);
      }

      return this.usersService.updateAvatar(req.user.sub, uploadedAvatar);
    } else {
      throw new BadRequestException();
    }
  }

  @Delete('avatar')
  async deleteAvatar(@Req() req: RequestWithUser): Promise<User> {
    const user = await this.usersService.findById(req.user.sub);

    if (user.avatar) {
      // удаляем аватар
      await this.storageService.deleteOne(user.avatar);
    }

    return this.usersService.updateAvatar(req.user.sub, null);
  }
}
