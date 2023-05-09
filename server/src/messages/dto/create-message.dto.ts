import { IsMongoId, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  chatId: string;

  @IsNotEmpty()
  @IsMongoId()
  sender: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  text: string;
}
