import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const newMessage = new this.messageModel(createMessageDto);
    const savedMessage = await newMessage.save();

    return await savedMessage.populate({
      path: 'sender',
      select: 'name avatar',
    });
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    return await this.messageModel.find({ chatId }).populate({
      path: 'sender',
      select: 'name avatar',
    });
  }
}
