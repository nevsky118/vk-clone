import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetMessagesDto {
  @IsNotEmpty()
  @IsMongoId()
  chatId: string;
}
