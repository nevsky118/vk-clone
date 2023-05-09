import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
