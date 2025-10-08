import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @MinLength(1)
  primaryTag: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    return Array.isArray(value) ? value.map(String) : [String(value)];
  })
  secondaryTags?: string[];

  @IsString()
  @IsOptional()
  textContent?: string;
}
