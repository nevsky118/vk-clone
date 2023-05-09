import { IsString, IsNotEmpty } from 'class-validator';

export class FriendDto {
  @IsString()
  @IsNotEmpty()
  to: string;
}
