import { IsObject, IsOptional, IsString } from 'class-validator';

export class OcrWebhookDto {
  @IsString()
  source: string;

  @IsString()
  imageId: string;

  @IsString()
  text: string;

  @IsObject()
  @IsOptional()
  meta?: any;
}
