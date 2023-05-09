import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { MessagesService } from 'src/messages/messages.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { AuthService } from 'src/auth/auth.service';
import SocketWithUser from 'src/common/socket-with-user.interface';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: SocketWithUser) {
    const token = client.handshake.headers.authorization.split(' ')[1];
    const payload = this.authService.verifyToken(token);

    if (!payload) {
      client.disconnect(true);
    } else {
      client.user = payload;
    }
  }

  @SubscribeMessage('joinChat')
  async joinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const chat = await this.chatsService.getChatById(chatId);

    if (chat) {
      if (chat.members.includes(client.user.sub as any)) {
        client.join(chatId);
        client.emit('joinedChat', { chat });
      }
    }
  }

  @SubscribeMessage('leaveChat')
  async leaveChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const chat = await this.chatsService.getChatById(chatId);

    if (chat) {
      if (chat.members.includes(client.user.sub as any)) {
        client.leave(chatId);
        client.emit('leftChat', { chat });
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: Pick<CreateMessageDto, 'chatId' | 'text'>,
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const message = await this.messagesService.create({
      ...data,
      sender: client.user.sub,
    });

    await this.chatsService.updateLastMessage(
      message.chatId.toString(),
      // @ts-expect-error
      message.id,
    );

    this.server.to(data.chatId).emit('newMessage', message);
  }

  @SubscribeMessage('requestAllMessages')
  async requestAllMessages(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: SocketWithUser,
  ) {
    const messages = await this.messagesService.getMessagesByChatId(chatId);

    this.server.to(chatId).emit('receiveAllMessages', messages);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }
}
