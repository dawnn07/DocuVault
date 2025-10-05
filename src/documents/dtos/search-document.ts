import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class SearchDocumentDto {
  @IsString()
  q: string;

  @IsEnum(['folder', 'files'])
  @IsOptional()
  scope?: 'folder' | 'files';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return Array.isArray(value) ? value.map(String) : [];
  })
  ids?: string[];
}
