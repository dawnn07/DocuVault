import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  imageId?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
