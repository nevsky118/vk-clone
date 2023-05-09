import { IsString, IsOptional } from 'class-validator';

export class PostDto {
  @IsString()
  @IsOptional()
  content: string;
}
