import { IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  repo?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;
}