import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsUUID()
  @IsOptional()
  parentId: string | null;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
