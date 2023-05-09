import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dtos/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(@InjectModel('Chat') private readonly chatModel: Model<Chat>) {}

  async createChat(data: CreateChatDto): Promise<Chat> {
    const existingChat = await this.chatModel.findOne({
      members: { $all: data.members },
    });

    if (existingChat) {
      return existingChat;
    }

    const newChat = new this.chatModel(data);
    return await newChat.save();
  }

  async getChatById(chatId: string): Promise<Chat> {
    return await this.chatModel.findById(chatId);
  }

  async getChats(userId: string): Promise<Chat[]> {
    return await this.chatModel
      .find({ members: userId })
      .populate({
        path: 'members',
        select: 'name avatar',
      })
      .populate('lastMessage');
  }

  async updateLastMessage(chatId: string, messageId: string): Promise<Chat> {
    return await this.chatModel.findByIdAndUpdate(chatId, {
      lastMessage: messageId,
    });
  }
}
