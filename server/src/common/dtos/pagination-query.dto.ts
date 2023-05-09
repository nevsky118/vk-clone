import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;

  @IsOptional()
  q?: string;
}
