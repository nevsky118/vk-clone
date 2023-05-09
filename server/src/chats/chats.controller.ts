import { Body, Controller, Post, Get, Param, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { MessagesService } from 'src/messages/messages.service';
import RequestWithUser from 'src/common/request-with-user.interface';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  async createChat(@Body() data: CreateChatDto): Promise<any> {
    const newChat = await this.chatService.createChat(data);
    // @ts-ignore
    return { chatId: newChat.id };
  }

  @Get(':chatId')
  async getMessages(@Param('chatId') chatId: string): Promise<any> {
    return await this.messagesService.getMessagesByChatId(chatId);
  }

  @Get()
  async getChats(@Req() req: RequestWithUser): Promise<any> {
    return await this.chatService.getChats(req.user.sub);
  }
}
