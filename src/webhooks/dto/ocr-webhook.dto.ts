import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class OcrWebhookDto {
  @ApiProperty({
    description: 'Source of the OCR data',
    example: 'scanner-01',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'ID of the processed image',
    example: 'img_1234567890',
  })
  @IsString()
  imageId: string;

  @ApiProperty({
    description: 'Text extracted from the image',
    example: 'LIMITED TIME SALE… unsubscribe: mailto:stop@brand.com',
  })
  @IsString()
  text: string;

  @ApiPropertyOptional({
    description: 'Optional metadata related to the OCR processing',
    example: { address: '123 Main St' },
  })
  @IsObject()
  @IsOptional()
  meta?: any;
}
