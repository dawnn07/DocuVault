import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @MinLength(1)
  primaryTag: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  secondaryTags?: string[];

  @IsString()
  @IsOptional()
  textContent?: string;
}
