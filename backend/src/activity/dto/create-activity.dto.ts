import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}